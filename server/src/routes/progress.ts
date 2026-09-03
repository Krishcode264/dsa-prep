import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_solved,
        COUNT(*) FILTER (WHERE q.difficulty = 'EASY') as easy_solved,
        COUNT(*) FILTER (WHERE q.difficulty = 'MEDIUM') as medium_solved,
        COUNT(*) FILTER (WHERE q.difficulty = 'HARD') as hard_solved
      FROM user_progress up
      JOIN questions q ON up.question_id = q.id
      WHERE up.user_id = $1 AND up.solved = true
    `, [userId]);

    const recentResult = await pool.query(`
      SELECT q.title, q.difficulty, q.link, up.solved_at
      FROM user_progress up
      JOIN questions q ON up.question_id = q.id
      WHERE up.user_id = $1 AND up.solved = true
      ORDER BY up.solved_at DESC
      LIMIT 10
    `, [userId]);

    const stats = statsResult.rows[0];
    
    res.json({
      total_solved: parseInt(stats.total_solved || '0'),
      easy_solved: parseInt(stats.easy_solved || '0'),
      medium_solved: parseInt(stats.medium_solved || '0'),
      hard_solved: parseInt(stats.hard_solved || '0'),
      recent_solved: recentResult.rows
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:userId/all', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const result = await pool.query(`
      SELECT question_id 
      FROM user_progress 
      WHERE user_id = $1 AND solved = true
    `, [userId]);

    res.json({ solved_ids: result.rows.map(r => r.question_id) });
  } catch (err) {
    next(err);
  }
});

router.post('/:userId/:questionId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const questionId = parseInt(req.params.questionId);
    const { solved } = req.body;

    if (isNaN(userId) || isNaN(questionId)) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }

    const query = `
      INSERT INTO user_progress (user_id, question_id, solved, solved_at)
      VALUES ($1, $2, $3, CASE WHEN $3 = true THEN NOW() ELSE NULL END)
      ON CONFLICT (user_id, question_id) DO UPDATE SET
        solved = EXCLUDED.solved,
        solved_at = EXCLUDED.solved_at
    `;
    
    await pool.query(query, [userId, questionId, solved]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.post('/:userId/sync', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const { questionIds } = req.body;

    if (isNaN(userId) || userId < 1) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!Array.isArray(questionIds)) {
      return res.status(400).json({ error: 'questionIds must be an array' });
    }
    if (questionIds.length === 0) {
      return res.json({ success: true, synced: 0 });
    }
    // Cap array size to prevent DoS via huge payloads
    if (questionIds.length > 5000) {
      return res.status(400).json({ error: 'Too many question IDs (max 5000)' });
    }
    // Validate every entry is a positive integer
    const validIds: number[] = questionIds
      .map((id: any) => parseInt(id))
      .filter((id: number) => !isNaN(id) && id > 0);

    if (validIds.length === 0) {
      return res.json({ success: true, synced: 0 });
    }

    // ✅ Parameterized bulk upsert via unnest — zero SQL injection risk
    const result = await pool.query(`
      INSERT INTO user_progress (user_id, question_id, solved, solved_at)
      SELECT $1, q_id, true, NOW()
      FROM unnest($2::int[]) AS q_id
      -- Only insert for question IDs that actually exist
      WHERE q_id IN (SELECT id FROM questions)
      ON CONFLICT (user_id, question_id) DO UPDATE SET
        solved = true,
        solved_at = COALESCE(user_progress.solved_at, EXCLUDED.solved_at)
      RETURNING question_id
    `, [userId, validIds]);

    res.json({ success: true, synced: result.rowCount ?? 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
