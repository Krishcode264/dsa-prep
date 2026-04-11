import { useState } from 'react';

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch(err => {
          console.warn('Could not copy text: ', err);
        });
    } else {
      console.warn('Clipboard API not available');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-3 inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
        copied 
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200 cursor-pointer'
      }`}
    >
      {copied ? 'Copied!' : '↗ Link'}
    </button>
  );
}
