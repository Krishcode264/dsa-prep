import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT id, name 
      FROM companies 
      ORDER BY name ASC
    `);
    
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

export default router;
