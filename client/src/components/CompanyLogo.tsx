import { useState, useMemo } from 'react';

interface CompanyLogoProps {
  companyName: string;
  size?: number; // e.g. 48 for 48x48px
  className?: string;
}

const DOMAIN_MAP: Record<string, string> = {
  amazon: 'amazon.com',
  google: 'google.com',
  apple: 'apple.com',
  tiktok: 'tiktok.com',
  microsoft: 'microsoft.com',
  bloomberg: 'bloomberg.com',
  meta: 'meta.com',
  facebook: 'facebook.com',
  citadel: 'citadel.com',
  linkedin: 'linkedin.com',
  'goldman sachs': 'goldmansachs.com',
  uber: 'uber.com',
  adobe: 'adobe.com',
  netflix: 'netflix.com',
  twitter: 'x.com',
  x: 'x.com',
  salesforce: 'salesforce.com',
  walmart: 'walmart.com',
  oracle: 'oracle.com',
  nvidia: 'nvidia.com',
  spotify: 'spotify.com',
  airbnb: 'airbnb.com',
  stripe: 'stripe.com',
  atlassian: 'atlassian.com',
  doordash: 'doordash.com',
  lyft: 'lyft.com',
  snapchat: 'snapchat.com',
  pinterest: 'pinterest.com',
  databricks: 'databricks.com',
  snowflake: 'snowflake.com',
  palantir: 'palantir.com',
  cisco: 'cisco.com',
  ibm: 'ibm.com',
  intel: 'intel.com',
};

function getDomain(name: string): string {
  const clean = name.trim().toLowerCase();
  if (DOMAIN_MAP[clean]) return DOMAIN_MAP[clean];
  const sanitized = clean.replace(/[^a-z0-9]/g, '');
  return `${sanitized}.com`;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, Math.min(2, name.length)).toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#6366F1', '#14B8A6', '#F97316'
  ];
  return colors[Math.abs(hash) % colors.length];
}

export default function CompanyLogo({ companyName, size = 48, className = '' }: CompanyLogoProps) {
  const domain = useMemo(() => getDomain(companyName), [companyName]);
  const initials = useMemo(() => getInitials(companyName), [companyName]);
  const fallbackBgColor = useMemo(() => stringToColor(companyName), [companyName]);

  // Stage 0: Clearbit Logo, Stage 1: Google Favicon API, Stage 2: SVG Monogram
  const [stage, setStage] = useState<number>(0);

  const clearbitUrl = `https://logo.clearbit.com/${domain}`;
  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const handleImgError = () => {
    setStage(prev => prev + 1);
  };

  const dimStyle = { width: `${size}px`, height: `${size}px` };

  if (stage === 0) {
    return (
      <div 
        style={dimStyle} 
        className={`bg-white border-2 border-[color:var(--border-main)] rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_var(--border-main)] ${className}`}
      >
        <img
          src={clearbitUrl}
          alt={`${companyName} logo`}
          onError={handleImgError}
          className="w-full h-full object-contain p-1.5"
        />
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div 
        style={dimStyle} 
        className={`bg-white border-2 border-[color:var(--border-main)] rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_var(--border-main)] ${className}`}
      >
        <img
          src={googleFaviconUrl}
          alt={`${companyName} favicon`}
          onError={handleImgError}
          className="w-3/4 h-3/4 object-contain"
        />
      </div>
    );
  }

  // Fallback: Dynamic High-Contrast Brutalist SVG Monogram Avatar
  return (
    <div 
      style={dimStyle} 
      className={`border-2 border-[color:var(--border-main)] rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_var(--border-main)] ${className}`}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="100" height="100" fill={fallbackBgColor} />
        <rect width="100" height="100" fill="black" opacity="0.15" />
        <text 
          x="50" 
          y="54" 
          fill="#FFFFFF" 
          fontSize={initials.length > 1 ? "40" : "50"} 
          fontWeight="900" 
          fontFamily="sans-serif"
          textAnchor="middle" 
          dominantBaseline="central"
          letterSpacing="-1"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
