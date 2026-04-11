import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import questionsRouter from './routes/questions';
import companiesRouter from './routes/companies';
import topicsRouter from './routes/topics';
import progressRouter from './routes/progress';
import usersRouter from './routes/users';
import statsRouter from './routes/stats';
import sitemapRouter from './routes/sitemap';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for simplicity with SPA, re-enable if needed for strict production
}));

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Stricter limit for auth routes: 15 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again after 15 minutes.' }
});

app.use(cors({
  origin: process.env.VITE_API_URL || '*',
  credentials: true
}));
app.use(express.json());

// Apply global limiter to all /api routes
app.use('/api', globalLimiter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// SEO routes (sitemap.xml and robots.txt)
app.use('/', sitemapRouter);

// API Routes
app.use('/api/auth', authLimiter, authRouter); // Apply stricter limit to auth
app.use('/api/questions', questionsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/users', usersRouter);
app.use('/api/stats', statsRouter);

// Serve static client build in production
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// SPA catch-all: serve index.html for any non-API route (must be after all API routes)
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
