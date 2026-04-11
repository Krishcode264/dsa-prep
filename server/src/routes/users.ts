import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // ON CONFLICT DO UPDATE trick to ensure we return the row even if it already exists
    const result = await pool.query(`
      INSERT INTO users (username) 
      VALUES ($1) 
      ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
      RETURNING id, username, created_at
    `, [username]);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    
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
