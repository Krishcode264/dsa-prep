import express from 'express';
import { pool } from '../db';

const router = express.Router();

/**
 * Helper to determine canonical base URL from request headers or environment
 */
function getBaseUrl(req: express.Request): string {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, '');
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'company-wise-dsa-prep.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
  return `${proto}://${host}`;
}

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const baseUrl = getBaseUrl(req);
    const result = await pool.query('SELECT name FROM companies ORDER BY name');
    const companies: { name: string }[] = result.rows;

    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Core Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/companies</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${baseUrl}/questions</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>`;

    // Add company-specific routes
    for (const company of companies) {
      const encoded = encodeURIComponent(company.name);

      xml += `
  <url>
    <loc>${baseUrl}/companies/${encoded}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    }

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

router.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const robotsTxt = `# Allow all major Search Engines & AI Web Crawlers
User-agent: *
Allow: /
Disallow: /api/

# OpenAI ChatGPT Crawler
User-agent: GPTBot
Allow: /

# Perplexity AI Crawler
User-agent: PerplexityBot
Allow: /

# Claude AI Crawler
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /

# Google Gemini / AI Crawler
User-agent: Google-Extended
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');
  res.send(robotsTxt);
});

export default router;
