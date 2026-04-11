import React from 'react';
import type { Question } from '../../types';
import CompanyPill from './CompanyPill';
import TopicPill from './TopicPill';

interface QuestionRowProps {
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

const QuestionRow = React.memo(({ 
  question, 
  index, 
  isSolved, 
  onToggle, 
  onSelect, 
  activeCompanies 
}: QuestionRowProps) => {
  const q = question;

  // Sort companies by active then freq
  const sortedCompanies = [...q.companies].sort((a, b) => {
    const aActive = activeCompanies.includes(a.name);
    const bActive = activeCompanies.includes(b.name);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return b.frequency - a.frequency;
  });

  const visibleComps = sortedCompanies.slice(0, 2);
  const hiddenComps = Math.max(0, sortedCompanies.length - 2);

  const visibleTopics = q.topics.slice(0, 2);
  const hiddenTopics = Math.max(0, q.topics.length - 2);

  return (
    <tr className={`group transition-colors duration-200 ${isSolved ? 'bg-[color:var(--surface-active)]' : 'hover:bg-[color:var(--surface-hover)]'}`}>
      <td className={`px-4 lg:px-6 py-3 lg:py-4 text-center font-mono text-xs ${isSolved ? 'text-[color:var(--text-main)] font-extrabold' : 'text-[color:var(--text-muted)]'}`}>
        {index + 1}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-center">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSolved}
            onChange={() => onToggle(q.id, isSolved)}
            className="peer sr-only"
          />
          <div className={`w-5 h-5 flex items-center justify-center transition-all duration-200 border border-[color:var(--border-main)] ${isSolved ? 'bg-[color:var(--text-main)] text-[color:var(--primary)]' : 'bg-[color:var(--surface)] text-transparent group-hover:bg-[color:var(--surface-hover)]'}`}>
            {isSolved && <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
          </div>
        </label>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 border-r border-[color:var(--border-main)]">
        <div className="flex items-center gap-2 text-[color:var(--text-main)]">
          <button 
            onClick={() => onSelect(q)}
            className={`font-medium hover:underline underline-offset-4 transition-all truncate text-left ${isSolved ? 'font-bold' : ''}`}
          >
            {q.title}
          </button>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 border-r border-[color:var(--border-main)]">
        <span className={`px-2 py-0.5 lg:px-2.5 lg:py-1 text-[10px] uppercase font-bold tracking-wider ${getDifficultyBadge(q.difficulty)}`}>
          {q.difficulty}
        </span>
      </td>
      <td className={`px-4 lg:px-6 py-3 lg:py-4 border-r border-[color:var(--border-main)] font-mono text-xs lg:text-sm transition-colors text-center ${isSolved ? 'text-[color:var(--text-main)] font-bold' : 'text-[color:var(--text-muted)] group-hover:text-[color:var(--text-main)]'}`}>
        {(q.acceptance_rate * 100).toFixed(1)}%
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 border-r border-[color:var(--border-main)]">
        <div className="flex flex-wrap gap-1.5">
          {visibleComps.map(c => <CompanyPill key={c.name} company={c.name} frequency={c.frequency} />)}
          {hiddenComps > 0 && (
            <button 
              onClick={() => onSelect(q)}
              className="inline-flex items-center px-[7px] py-[2px] text-[10px] font-bold transition-all focus:outline-none bg-[color:var(--surface)] border border-[color:var(--border-subtle)] hover:border-[color:var(--border-main)] text-[color:var(--text-main)]"
            >
              +{hiddenComps} more
            </button>
          )}
        </div>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex flex-wrap gap-1.5">
          {visibleTopics.map(t => <TopicPill key={t} topic={t} />)}
          {hiddenTopics > 0 && (
            <button 
              onClick={() => onSelect(q)}
              className="inline-flex items-center px-[7px] py-[2px] text-[10px] font-bold transition-all focus:outline-none bg-[color:var(--surface)] text-[color:var(--text-main)] border border-[color:var(--border-subtle)] hover:border-[color:var(--border-main)]"
            >
              +{hiddenTopics} more
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}, (prev, next) => {
  // Only re-render if the question itself or its solved status or activeCompanies change
  return (
    prev.isSolved === next.isSolved && 
    prev.question.id === next.question.id &&
    prev.activeCompanies === next.activeCompanies &&
    prev.index === next.index
  );
});

export default QuestionRow;
