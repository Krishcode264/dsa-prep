import type { Question } from '../types';
import { useSolvedIds, useToggleSolved } from '../hooks/useSolvedProgress';
import { useState, useCallback } from 'react';
import QuestionDetailModal from './QuestionDetailModal';
import QuestionRow from './table/QuestionRow';
import QuestionCard from './table/QuestionCard';

interface QuestionTableProps {
  questions: Question[];
  activeCompanies: string[];
}

export default function QuestionTable({ questions, activeCompanies }: QuestionTableProps) {
  const solvedIds = useSolvedIds();
  const handleToggle = useToggleSolved();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleSelect = useCallback((q: Question) => {
    setSelectedQuestion(q);
  }, []);

  return (
    <div className="bg-[color:var(--surface)] overflow-hidden w-full text-[color:var(--text-main)] border border-[color:var(--border-main)] brutalist-no-radius">
      <div>
        {/* Mobile card view */}
        <div className="block md:hidden">
          {questions.map((q, index) => (
            <QuestionCard 
              key={q.id} 
              question={q}
              index={index} 
              isSolved={solvedIds.has(q.id)}
              onToggle={handleToggle}
              onSelect={handleSelect}
              activeCompanies={activeCompanies}
            />
          ))}
          {questions.length === 0 && (
            <div className="px-4 py-16 text-center">
              <div className="flex flex-col items-center justify-center text-[color:var(--text-muted)]">
                <p className="text-lg font-bold uppercase tracking-widest text-[color:var(--text-main)] border-2 border-[color:var(--border-main)] py-2 px-4">No Records</p>
                <p className="text-xs mt-3 font-bold">Adjust your filters.</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop table view */}
        <table className="hidden md:table w-full text-left text-sm border-collapse table-fixed">
          <thead className="bg-[color:var(--surface-active)] border-b border-[color:var(--border-main)] font-bold tracking-wide sticky top-0 z-20">
            <tr>
              <th className="px-4 lg:px-6 py-3 lg:py-4 w-12 lg:w-14 text-center text-[color:var(--text-main)] uppercase text-xs">#</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 w-10 lg:w-12 text-center text-[color:var(--text-main)]" title="Status">
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 w-[35%] text-[color:var(--text-main)] uppercase text-xs">Problem</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 w-24 lg:w-28 border-l border-[color:var(--border-main)] text-[color:var(--text-main)] uppercase text-xs">Difficulty</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 w-20 lg:w-28 border-l border-[color:var(--border-main)] text-[color:var(--text-main)] uppercase text-xs text-center">Acc.</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 border-l border-[color:var(--border-main)] text-[color:var(--text-main)] uppercase text-xs">Companies</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 border-l border-[color:var(--border-main)] text-[color:var(--text-main)] uppercase text-xs">Topics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border-main)]">
            {questions.map((q, index) => (
              <QuestionRow 
                key={q.id}
                question={q}
                index={index}
                isSolved={solvedIds.has(q.id)}
                onToggle={handleToggle}
                onSelect={handleSelect}
                activeCompanies={activeCompanies}
              />
            ))}
            
            {questions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center text-[color:var(--text-muted)]">
                    <p className="text-xl font-bold uppercase tracking-widest text-[color:var(--text-main)] border-2 border-[color:var(--border-main)] py-2 px-6">No Records</p>
                    <p className="text-sm mt-4 font-bold">Adjust your multi-select filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedQuestion && (
        <QuestionDetailModal 
          question={selectedQuestion} 
          onClose={() => setSelectedQuestion(null)} 
        />
      )}
    </div>
  );
}
