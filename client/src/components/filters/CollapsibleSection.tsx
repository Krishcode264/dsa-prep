import { useState, useRef, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export default function CollapsibleSection({ title, defaultOpen = true, children, className = '' }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem(`collapse_${title}`);
    if (saved !== null) return saved === 'true';
    return defaultOpen;
  });
  
  const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? '1000px' : '0px');
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    localStorage.setItem(`collapse_${title}`, String(isOpen));
    if (isOpen) {
      if (contentRef.current) {
        setMaxHeight(`${contentRef.current.scrollHeight + 50}px`);
      } else {
        setMaxHeight('1000px');
      }
    } else {
      setMaxHeight('0px');
    }
  }, [isOpen, title, children]);

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 group text-left cursor-pointer transition-colors border-b border-[color:var(--border-main)] mb-1"
      >
        <h2 className="font-extrabold text-[color:var(--text-main)] text-[11px] uppercase tracking-widest m-0">{title}</h2>
        <svg 
          className={`w-4 h-4 text-[color:var(--text-main)] transition-transform duration-250 ease-in-out ${isOpen ? 'rotate-0' : 'rotate-180'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        className="transition-[max-height] duration-250 ease-in-out overflow-hidden"
        style={{ maxHeight }}
      >
        <div ref={contentRef} className="pt-2 pb-2">
          {children}
        </div>
      </div>
    </div>
  );
}
