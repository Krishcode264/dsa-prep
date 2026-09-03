import express from 'express';
import { pool } from '../db';

const router = express.Router();

// ─── Create or get guest user by username ────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const clean = username.trim();

    if (clean.length < 3 || clean.length > 30) {
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
      return res.status(400).json({ error: 'Username may only contain letters, numbers, underscores, and hyphens' });
    }

    const result = await pool.query(`
      INSERT INTO users (username) 
      VALUES ($1) 
      ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
      RETURNING id, username, created_at
    `, [clean]);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ─── Lookup user by username ──────────────────────────────────────────────────
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    // Validate to prevent scanning with special chars
    if (!username || username.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    const result = await pool.query(`
      SELECT id, username, created_at 
      FROM users 
      WHERE username = $1
    `, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
