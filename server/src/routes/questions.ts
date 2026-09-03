import express from 'express';
import { pool } from '../db';
import { QuestionWithCompanies, PaginatedResponse } from '../types';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { company, difficulty, topic, search, topicMatch, page: pageQ, limit: limitQ, userId: userIdQ, status } = req.query;
    const userId = userIdQ ? parseInt(userIdQ as string) : null;
    
    const page = Math.max(1, parseInt(pageQ as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitQ as string) || 50));
    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const values: any[] = [];

    if (company) {
      const companies = Array.isArray(company) ? company : [company];
      values.push(companies);
      whereClauses.push(`EXISTS (
        SELECT 1 FROM question_companies qc2 
        JOIN companies c2 ON qc2.company_id = c2.id 
        WHERE qc2.question_id = q.id AND c2.name = ANY($${values.length})
      )`);
    }

    if (difficulty) {
      values.push(difficulty);
      whereClauses.push(`q.difficulty = $${values.length}`);
    }

    if (topic) {
      const topics = Array.isArray(topic) ? topic : [topic];
      values.push(topics);
      if (topicMatch === 'ALL') {
        whereClauses.push(`q.topics @> $${values.length}::text[]`);
      } else {
        whereClauses.push(`q.topics && $${values.length}::text[]`);
      }
    }

    if (search) {
      values.push(`%${search}%`);
      whereClauses.push(`q.title ILIKE $${values.length}`);
    }

    // Filter by solved/unsolved status — requires userId
    if (userId && (status === 'solved' || status === 'unsolved')) {
      values.push(userId);
      const userIdParam = `$${values.length}`;
      if (status === 'solved') {
        whereClauses.push(`EXISTS (
          SELECT 1 FROM user_progress up
          WHERE up.question_id = q.id AND up.user_id = ${userIdParam} AND up.solved = true
        )`);
      } else {
        whereClauses.push(`NOT EXISTS (
          SELECT 1 FROM user_progress up
          WHERE up.question_id = q.id AND up.user_id = ${userIdParam} AND up.solved = true
        )`);
      }
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*)::int as total FROM questions q ${whereSql}`, values);
    const total = countResult.rows[0].total;

    // Get paginated data
    const dataValues = [...values, limit, offset];
    const dataQuery = `
      SELECT 
        q.id, q.title, q.difficulty, q.acceptance_rate, q.link, q.topics,
        COALESCE(
          json_agg(
            json_build_object('name', c.name, 'frequency', qc.frequency)
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS companies
      FROM questions q
      LEFT JOIN question_companies qc ON q.id = qc.question_id
      LEFT JOIN companies c ON qc.company_id = c.id
      ${whereSql}
      GROUP BY q.id
      ORDER BY q.id ASC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const result = await pool.query(dataQuery, dataValues);

    const response: PaginatedResponse<QuestionWithCompanies> = {
      data: result.rows,
      pagination: {
        page,
        limit,
        total
      }
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const questionId = parseInt(req.params.id);
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;

    if (isNaN(questionId)) {
      return res.status(400).json({ error: 'Invalid question ID' });
    }

    const query = `
      SELECT 
        q.id, q.title, q.difficulty, q.acceptance_rate, q.link, q.topics,
        COALESCE(
          json_agg(
            json_build_object('name', c.name, 'frequency', qc.frequency)
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS companies
        ${userId ? `, COALESCE((SELECT solved FROM user_progress up WHERE up.question_id = q.id AND up.user_id = $2), false) as solved` : ''}
      FROM questions q
      LEFT JOIN question_companies qc ON q.id = qc.question_id
      LEFT JOIN companies c ON qc.company_id = c.id
      WHERE q.id = $1
      GROUP BY q.id
    `;

    const values = userId ? [questionId, userId] : [questionId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
