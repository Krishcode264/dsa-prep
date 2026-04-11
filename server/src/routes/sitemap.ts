import express from 'express';
import { pool } from '../db';

const router = express.Router();

const BASE_URL = process.env.SITE_URL || 'https://dsa-tracker.com';

router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT name FROM companies ORDER BY name');
    const companies: { name: string }[] = result.rows;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/questions</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

    for (const company of companies) {
      const encoded = encodeURIComponent(company.name);
      xml += `
  <url>
    <loc>${BASE_URL}/questions?company=${encoded}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

router.get('/robots.txt', (_req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${BASE_URL}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

export default router;
