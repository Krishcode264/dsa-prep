import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
    
    const query = `
      SELECT 
        c.id, 
        c.name, 
        COUNT(DISTINCT qc.question_id)::int as total_questions,
        COUNT(DISTINCT CASE WHEN up.solved = true THEN qc.question_id END)::int as solved_questions,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'EASY' THEN q.id END)::int as easy_total,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'MEDIUM' THEN q.id END)::int as medium_total,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'HARD' THEN q.id END)::int as hard_total,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'EASY' AND up.solved = true THEN q.id END)::int as easy_solved,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'MEDIUM' AND up.solved = true THEN q.id END)::int as medium_solved,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'HARD' AND up.solved = true THEN q.id END)::int as hard_solved
      FROM companies c
      JOIN question_companies qc ON c.id = qc.company_id
      JOIN questions q ON qc.question_id = q.id
      LEFT JOIN user_progress up ON q.id = up.question_id ${userId ? 'AND up.user_id = $1' : 'AND 1=0'}
      GROUP BY c.id, c.name
      ORDER BY total_questions DESC, c.name ASC
    `;
    
    const values = userId ? [userId] : [];
    const result = await pool.query(query, values);
    
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.get('/:name', async (req, res, next) => {
  try {
    const companyName = req.params.name;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
    
    const query = `
      SELECT 
        c.id, 
        c.name, 
        COUNT(DISTINCT qc.question_id)::int as total_questions,
        COUNT(DISTINCT CASE WHEN up.solved = true THEN qc.question_id END)::int as solved_questions,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'EASY' THEN q.id END)::int as easy_total,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'MEDIUM' THEN q.id END)::int as medium_total,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'HARD' THEN q.id END)::int as hard_total,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'EASY' AND up.solved = true THEN q.id END)::int as easy_solved,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'MEDIUM' AND up.solved = true THEN q.id END)::int as medium_solved,
        COUNT(DISTINCT CASE WHEN q.difficulty = 'HARD' AND up.solved = true THEN q.id END)::int as hard_solved
      FROM companies c
      JOIN question_companies qc ON c.id = qc.company_id
      JOIN questions q ON qc.question_id = q.id
      LEFT JOIN user_progress up ON q.id = up.question_id ${userId ? 'AND up.user_id = $2' : 'AND 1=0'}
      WHERE LOWER(c.name) = LOWER($1)
      GROUP BY c.id, c.name
    `;
    
    const values = userId ? [companyName, userId] : [companyName];
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;

