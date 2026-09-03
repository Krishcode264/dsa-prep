import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import morgan from 'morgan';

import authRouter from './routes/auth';
import questionsRouter from './routes/questions';
import companiesRouter from './routes/companies';
import topicsRouter from './routes/topics';
import progressRouter from './routes/progress';
import usersRouter from './routes/users';
import statsRouter from './routes/stats';
import sitemapRouter from './routes/sitemap';
import leetcodeRouter from './routes/leetcode';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

// ─── Request logging (dev: verbose, prod: minimal) ──────────────────────────
app.use(morgan(IS_PROD ? 'combined' : 'dev'));

// ─── Security Headers via Helmet ─────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: IS_PROD ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // needed for inline styles in SPA
      imgSrc: ["'self'", 'data:', 'https://logo.clearbit.com', 'https://www.google.com'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    }
  } : false,
  crossOriginEmbedderPolicy: false, // allow logo images from external domains
}));

// ─── CORS: Locked to allowed origins ─────────────────────────────────────────
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawOrigins
  ? rawOrigins.split(',').map(o => o.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin "${origin}" not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsing with size limit ────────────────────────────────────────────
// Prevents payload-bombing attacks (large JSON bodies)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── HTTP Parameter Pollution Prevention ────────────────────────────────────
// Prevents ?id=1&id=2&id=3... tricks that can break query logic
app.use(hpp({
  whitelist: ['company', 'topic'], // these are legitimately multi-value
}));

// ─── Rate Limiters ───────────────────────────────────────────────────────────

// Global: all /api routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 300,                    // 300 req per window per IP (generous for SPA use)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in 15 minutes.' },
  skip: (req) => req.method === 'OPTIONS', // skip preflight
});

// Auth routes: strict — prevents brute-force login/signup
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                     // 10 attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
});

// Sync routes: very strict — each call hits LeetCode's server externally
const syncLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 5,                     // 5 syncs per 10 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sync requests. Please wait 10 minutes before trying again.' },
});

// Write operations: prevent mass progress updates
const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 60,                    // 60 writes per minute (enough for normal use)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests. Slow down.' },
});

// Apply global to all /api
app.use('/api', globalLimiter);

// ─── Health check (no limiter — used by infra) ───────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── SEO routes ──────────────────────────────────────────────────────────────
app.use('/', sitemapRouter);

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/progress', writeLimiter, progressRouter);
app.use('/api/users', authLimiter, usersRouter);
app.use('/api/stats', statsRouter);
app.use('/api/sync', syncLimiter, leetcodeRouter);

// ─── Serve static client build in production ─────────────────────────────────
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath, {
  maxAge: IS_PROD ? '1d' : 0, // Cache static assets in prod
}));

// ─── SPA catch-all ───────────────────────────────────────────────────────────
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// Never leak stack traces or internal details to the client in production
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;

  // Always log full error server-side
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}`, err.message);
  if (!IS_PROD) console.error(err.stack);

  // Send sanitized response to client
  res.status(status).json({
    error: IS_PROD && status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`[${IS_PROD ? 'PROD' : 'DEV'}] Server running on http://localhost:${PORT}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
