import React from 'react';
import type { Question } from '../../types';
import CompanyPill from './CompanyPill';
import TopicPill from './TopicPill';

interface QuestionCardProps {
  question: Question;
  index: number;
  isSolved: boolean;
  onToggle: (id: number, currentSolved: boolean) => void;
  onSelect: (q: Question) => void;
  activeCompanies: string[];
}

const getDifficultyBadge = (diff: string) => {
  switch (diff) {
    case 'EASY': return 'bg-[color:var(--surface)] text-[color:var(--text-main)] border border-[color:var(--border-main)]';
    case 'MEDIUM': return 'bg-[color:var(--surface)] text-[color:var(--text-main)] border border-[color:var(--border-main)]';
    case 'HARD': return 'bg-[color:var(--surface)] text-[color:var(--text-main)] border border-[color:var(--border-main)]';
    default: return 'bg-[color:var(--surface)] text-[color:var(--text-muted)] border-transparent';
  }
};

const QuestionCard = React.memo(({ 
  question, 
  index, 
  isSolved, 
  onToggle, 
  onSelect, 
  activeCompanies 
}: QuestionCardProps) => {
  const q = question;

  const sortedCompanies = [...q.companies].sort((a, b) => {
    const aActive = activeCompanies.includes(a.name);
    const bActive = activeCompanies.includes(b.name);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return b.frequency - a.frequency;
  });

  const visibleComps = sortedCompanies.slice(0, 3);
  const hiddenComps = Math.max(0, sortedCompanies.length - 3);
  const visibleTopics = q.topics.slice(0, 3);
  const hiddenTopics = Math.max(0, q.topics.length - 3);

  return (
    <div className={`p-3 border-b border-[color:var(--border-main)] transition-colors ${isSolved ? 'bg-[color:var(--surface-active)]' : ''}`}>
      <div className="flex items-start gap-2.5">
        {/* Checkbox */}
        <label className="inline-flex items-center cursor-pointer mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={isSolved}
            onChange={() => onToggle(q.id, isSolved)}
            className="peer sr-only"
          />
          <div className={`w-5 h-5 flex items-center justify-center transition-all duration-200 border border-[color:var(--border-main)] ${isSolved ? 'bg-[color:var(--text-main)] text-[color:var(--primary)]' : 'bg-[color:var(--surface)] text-transparent'}`}>
            {isSolved && <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
          </div>
        </label>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[9px] text-[color:var(--text-muted)] font-mono">#{index + 1}</span>
            <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider ${getDifficultyBadge(q.difficulty)}`}>
              {q.difficulty}
            </span>
            <span className="text-[10px] text-[color:var(--text-muted)] font-mono">
              {(q.acceptance_rate * 100).toFixed(1)}%
            </span>
          </div>
          
          <button 
            onClick={() => onSelect(q)}
            className={`text-sm font-medium hover:underline underline-offset-4 transition-all text-left text-[color:var(--text-main)] leading-snug ${isSolved ? 'font-bold' : ''}`}
          >
            {q.title}
          </button>

          {/* Companies */}
          {sortedCompanies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {visibleComps.map(c => <CompanyPill key={c.name} company={c.name} frequency={c.frequency} />)}
              {hiddenComps > 0 && (
                <button 
                  onClick={() => onSelect(q)}
                  className="inline-flex items-center px-[5px] py-[1px] text-[9px] font-bold bg-[color:var(--surface)] border border-[color:var(--border-subtle)] hover:border-[color:var(--border-main)] text-[color:var(--text-main)]"
                >
                  +{hiddenComps}
                </button>
              )}
            </div>
          )}

          {/* Topics */}
          {q.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {visibleTopics.map(t => <TopicPill key={t} topic={t} />)}
              {hiddenTopics > 0 && (
                <button
                  onClick={() => onSelect(q)}
                  className="inline-flex items-center px-[5px] py-[1px] text-[9px] font-bold bg-[color:var(--surface)] text-[color:var(--text-main)] border border-[color:var(--border-subtle)] hover:border-[color:var(--border-main)]"
                >
                  +{hiddenTopics}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
  return (
    prev.isSolved === next.isSolved && 
    prev.question.id === next.question.id &&
    prev.activeCompanies === next.activeCompanies &&
    prev.index === next.index
  );
});

export default QuestionCard;
