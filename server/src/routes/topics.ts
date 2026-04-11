import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT unnest(topics) as topic 
      FROM questions 
      ORDER BY topic ASC
    `);
    
    res.json({ data: result.rows.map(row => row.topic) });
  } catch (err) {
    next(err);
  }
});

export default router;
