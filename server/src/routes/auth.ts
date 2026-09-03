import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db';

const router = express.Router();

// ─── Validation helpers ───────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  // Basic RFC-5322 compliant check — not a regex rabbit hole
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidUsername(username: string): boolean {
  // Alphanumeric + underscore + hyphen, 3–30 chars
  return /^[a-zA-Z0-9_-]{3,30}$/.test(username);
}

// ─── Signup ───────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Presence check
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    // Username validation
    if (!isValidUsername(cleanUsername)) {
      return res.status(400).json({
        error: 'Username must be 3–30 characters and contain only letters, numbers, underscores, or hyphens',
      });
    }

    // Email validation
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Password validation
    // bcrypt silently truncates at 72 bytes — enforce a max to prevent confusion
    if (cleanPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (cleanPassword.length > 72) {
      return res.status(400).json({ error: 'Password must not exceed 72 characters' });
    }

    const passwordHash = await bcrypt.hash(cleanPassword, 12); // cost factor 12 (was 10)

    const result = await pool.query(`
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `, [cleanUsername, cleanEmail, passwordHash]);

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      // Don't reveal WHICH field conflicts (username enumeration attack)
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    next(err);
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    // Bail early on obviously invalid input without hitting the DB
    if (!isValidEmail(cleanEmail) || cleanPassword.length < 1 || cleanPassword.length > 72) {
      // Use the same generic message to prevent user enumeration
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const result = await pool.query(`
      SELECT id, username, email, password_hash, created_at
      FROM users
      WHERE email = $1
    `, [cleanEmail]);

    // Constant-time comparison even if user doesn't exist (prevents timing attacks)
    const dummyHash = '$2a$12$invalidhashfortimingnormalizationpurposesonly123456';
    const hash = result.rows[0]?.password_hash ?? dummyHash;
    const isMatch = await bcrypt.compare(cleanPassword, hash);

    if (result.rows.length === 0 || !isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password_hash, ...userMetadata } = result.rows[0];
    res.json(userMetadata);
  } catch (err) {
    next(err);
  }
});

export default router;
