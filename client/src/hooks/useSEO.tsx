import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'DSA Tracker';
const BASE_URL = import.meta.env.VITE_DOMAIN_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://dsa-tracker.com');

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export default function useSEO({ title, description, keywords, url, jsonLd }: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = url ?? (typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}${window.location.search}`
    : BASE_URL);

  const jsonLdArray = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
