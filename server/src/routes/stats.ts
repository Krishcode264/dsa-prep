import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const globalCountResult = await pool.query(`
      SELECT 
        COUNT(*) as global_total,
        COUNT(*) FILTER (WHERE difficulty = 'EASY') as global_easy,
        COUNT(*) FILTER (WHERE difficulty = 'MEDIUM') as global_medium,
        COUNT(*) FILTER (WHERE difficulty = 'HARD') as global_hard
      FROM questions
    `);

    const userSolvedResult = await pool.query(`
      SELECT 
        COUNT(*) as solved_total,
        COUNT(*) FILTER (WHERE q.difficulty = 'EASY') as solved_easy,
        COUNT(*) FILTER (WHERE q.difficulty = 'MEDIUM') as solved_medium,
        COUNT(*) FILTER (WHERE q.difficulty = 'HARD') as solved_hard
      FROM user_progress up
      JOIN questions q ON up.question_id = q.id
      WHERE up.user_id = $1 AND up.solved = true
    `, [userId]);

    const companyResult = await pool.query(`
      SELECT 
        c.name, 
        COUNT(qc.question_id)::int as total_questions,
        COUNT(qc.question_id) FILTER (WHERE up.solved = true)::int as solved_questions
      FROM companies c
      JOIN question_companies qc ON c.id = qc.company_id
      LEFT JOIN user_progress up ON qc.question_id = up.question_id AND up.user_id = $1
      GROUP BY c.id, c.name
      ORDER BY 
        (COUNT(qc.question_id) FILTER (WHERE up.solved = true))::float / NULLIF(COUNT(qc.question_id), 0) DESC,
        COUNT(qc.question_id) DESC
      LIMIT 10
    `, [userId]);

    const globalStats = globalCountResult.rows[0];
    const solvedStats = userSolvedResult.rows[0];

    res.json({
      global: {
        total: parseInt(globalStats.global_total || '0'),
        easy: parseInt(globalStats.global_easy || '0'),
        medium: parseInt(globalStats.global_medium || '0'),
        hard: parseInt(globalStats.global_hard || '0')
      },
      user: {
        total: parseInt(solvedStats.solved_total || '0'),
        easy: parseInt(solvedStats.solved_easy || '0'),
        medium: parseInt(solvedStats.solved_medium || '0'),
        hard: parseInt(solvedStats.solved_hard || '0')
      },
      companies: companyResult.rows
    });
  } catch (err) {
    next(err);
  }
});

export default router;
