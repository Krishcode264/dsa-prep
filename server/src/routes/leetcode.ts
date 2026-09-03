import express from 'express';
import { pool } from '../db';

const router = express.Router();

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';
const LEETCODE_PROBLEMS_URL = 'https://leetcode.com/api/problems/all/';

// ─── Shared helper: match slugs in our DB and bulk-upsert ────────────────────

async function matchAndUpsert(slugs: string[], userId: number) {
  if (slugs.length === 0) return { synced: 0, matchedIds: [] as number[] };

  const matchResult = await pool.query(`
    SELECT q.id
    FROM questions q
    WHERE LOWER(SUBSTRING(q.link FROM 'problems/([^/]+?)/?$')) = ANY($1::text[])
  `, [slugs.map(s => s.toLowerCase())]);

  const matchedIds: number[] = matchResult.rows.map((r: any) => r.id);
  if (matchedIds.length === 0) return { synced: 0, matchedIds };

  const values = matchedIds.map(id => `(${userId}, ${id}, true, NOW())`).join(', ');
  const upsertResult = await pool.query(`
    INSERT INTO user_progress (user_id, question_id, solved, solved_at)
    VALUES ${values}
    ON CONFLICT (user_id, question_id) DO UPDATE SET
      solved = true,
      solved_at = COALESCE(user_progress.solved_at, EXCLUDED.solved_at)
    RETURNING question_id
  `);

  return { synced: upsertResult.rowCount ?? 0, matchedIds };
}

// ─── Route 1: Quick sync via public API (no auth, recent 20 only) ───────────

/**
 * POST /api/sync/leetcode
 * Body: { username: string, userId: number }
 */
router.post('/leetcode', async (req, res, next) => {
  try {
    const { username, userId } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: 'LeetCode username is required.' });
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const cleanUsername = username.trim();

    // Verify user exists + get total solved count
    const userCheckResponse = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/',
        'User-Agent': 'Mozilla/5.0 (compatible; DSA-Prep-Sync/1.0)',
      },
      body: JSON.stringify({
        query: `query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum { difficulty count }
            }
          }
        }`,
        variables: { username: cleanUsername },
      }),
    });

    if (!userCheckResponse.ok) {
      return res.status(502).json({ error: 'Could not connect to LeetCode. Please try again later.' });
    }

    const userCheckData = await userCheckResponse.json() as any;
    if (!userCheckData?.data?.matchedUser) {
      return res.status(404).json({ error: `LeetCode user "${cleanUsername}" not found. Check the username and try again.` });
    }

    const lcStats: Array<{ difficulty: string; count: number }> =
      userCheckData.data.matchedUser.submitStats?.acSubmissionNum ?? [];
    const totalSolvedOnLC = lcStats.find(s => s.difficulty === 'All')?.count ?? 0;

    // Fetch recent 20 AC submissions (hard cap by LC public API)
    const submissionsResponse = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/',
        'User-Agent': 'Mozilla/5.0 (compatible; DSA-Prep-Sync/1.0)',
      },
      body: JSON.stringify({
        query: `query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            titleSlug
          }
        }`,
        variables: { username: cleanUsername, limit: 20 },
      }),
    });

    if (!submissionsResponse.ok) {
      return res.status(502).json({ error: 'Failed to fetch submissions from LeetCode.' });
    }

    const submissionsData = await submissionsResponse.json() as any;
    const submissions: Array<{ titleSlug: string }> =
      submissionsData?.data?.recentAcSubmissionList ?? [];

    if (submissions.length === 0) {
      return res.json({
        success: true, synced: 0, total_fetched: 0,
        total_solved_on_lc: totalSolvedOnLC, username: cleanUsername,
        message: `No recent accepted submissions found for @${cleanUsername} on LeetCode.`,
      });
    }

    const { synced } = await matchAndUpsert(submissions.map(s => s.titleSlug), parsedUserId);

    res.json({
      success: true,
      synced,
      total_fetched: submissions.length,
      total_solved_on_lc: totalSolvedOnLC,
      username: cleanUsername,
      message: synced > 0
        ? `Synced ${synced} question${synced !== 1 ? 's' : ''} from LeetCode.`
        : `Fetched ${submissions.length} submissions but none matched questions in our database.`,
    });

  } catch (err) {
    next(err);
  }
});

// ─── Route 2: Full sync via session cookie (all solved questions) ─────────────

/**
 * POST /api/sync/leetcode-cookie
 * Body: { sessionCookie: string, userId: number }
 *
 * Uses the LEETCODE_SESSION cookie to call LC's authenticated REST endpoint
 * which returns ALL problems with their AC status for the logged-in user.
 * This allows syncing the complete solved history, not just the recent 20.
 */
router.post('/leetcode-cookie', async (req, res, next) => {
  try {
    const { sessionCookie, userId } = req.body;

    if (!sessionCookie || typeof sessionCookie !== 'string' || sessionCookie.trim().length < 10) {
      return res.status(400).json({ error: 'A valid LEETCODE_SESSION cookie is required.' });
    }
    // Cap cookie length to prevent abuse (real LC session cookies are ~200-800 chars)
    if (sessionCookie.trim().length > 2000) {
      return res.status(400).json({ error: 'Session cookie is too long.' });
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId) || parsedUserId < 1) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const cleanCookie = sessionCookie.trim();

    // Call LC's authenticated REST endpoint — returns ALL problems with status
    const lcResponse = await fetch(LEETCODE_PROBLEMS_URL, {
      headers: {
        'Cookie': `LEETCODE_SESSION=${cleanCookie}`,
        'User-Agent': 'Mozilla/5.0 (compatible; DSA-Prep-Sync/1.0)',
        'Referer': 'https://leetcode.com/',
      },
    });

    if (!lcResponse.ok) {
      return res.status(502).json({ error: 'Could not connect to LeetCode. Please try again later.' });
    }

    const lcData = await lcResponse.json() as any;

    // If not authenticated, num_solved will be 0 and user_name will be empty
    const username: string = lcData.user_name || '';
    if (!username) {
      return res.status(401).json({
        error: 'Session cookie is invalid or expired. Please copy a fresh LEETCODE_SESSION cookie from your browser.',
      });
    }

    const totalSolvedOnLC: number = lcData.num_solved ?? 0;
    const allProblems: any[] = lcData.stat_status_pairs ?? [];

    // Filter only accepted (AC) problems
    const acSlugs: string[] = allProblems
      .filter((p: any) => p.status === 'ac')
      .map((p: any) => p.stat?.question__title_slug)
      .filter(Boolean);

    if (acSlugs.length === 0) {
      return res.json({
        success: true, synced: 0, total_fetched: 0,
        total_solved_on_lc: totalSolvedOnLC, username,
        message: `No solved problems found for @${username} on LeetCode.`,
      });
    }

    const { synced } = await matchAndUpsert(acSlugs, parsedUserId);

    res.json({
      success: true,
      synced,
      total_fetched: acSlugs.length,
      total_solved_on_lc: totalSolvedOnLC,
      username,
      message: synced > 0
        ? `Full sync complete — ${synced} question${synced !== 1 ? 's' : ''} matched from your ${acSlugs.length} LeetCode solves.`
        : `Fetched all ${acSlugs.length} solved questions from LeetCode but none matched questions in our database.`,
    });

  } catch (err) {
    next(err);
  }
});

export default router;
