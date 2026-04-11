import type { Question } from '../types';
import CompanyPill from './table/CompanyPill';
import TopicPill from './table/TopicPill';

interface QuestionDetailModalProps {
  question: Question;
  onClose: () => void;
}

export default function QuestionDetailModal({ question, onClose }: QuestionDetailModalProps) {
  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] border-b-8 brutalist-no-radius w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] mx-2 sm:mx-0">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b-2 border-[color:var(--border-main)] flex justify-between items-start bg-[color:var(--surface-active)] gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 border border-[color:var(--border-main)] bg-[color:var(--surface)] text-[color:var(--text-main)]">
                {question.difficulty}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 border border-[color:var(--border-main)] bg-[color:var(--surface)] text-[color:var(--text-main)]">
                {(question.acceptance_rate * 100).toFixed(1)}% Acceptance
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-[color:var(--text-main)] leading-tight">
              {question.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border-2 border-[color:var(--border-main)] hover:bg-[color:var(--surface-hover)] transition-colors text-[color:var(--text-main)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6 sm:space-y-8">
          {/* Companies Section */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-[color:var(--text-muted)] mb-4 border-b border-[color:var(--border-main)] pb-1 inline-block">
              Asking Companies
            </h3>
            <div className="flex flex-wrap gap-2">
              {question.companies.sort((a,b) => b.frequency - a.frequency).map(c => (
                <CompanyPill key={c.name} company={c.name} frequency={c.frequency} />
              ))}
            </div>
          </section>

          {/* Topics Section */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-[color:var(--text-muted)] mb-4 border-b border-[color:var(--border-main)] pb-1 inline-block">
              Core Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {question.topics.map(t => (
                <TopicPill key={t} topic={t} />
              ))}
            </div>
          </section>

          {/* Action */}
          <section className="pt-4">
            <a 
              href={question.link} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[color:var(--text-main)] text-[color:var(--surface)] font-black uppercase tracking-widest border-2 border-[color:var(--border-main)] hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--border-main)] text-xs sm:text-sm"
            >
              Solve Problem
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[color:var(--surface-active)] border-t border-[color:var(--border-main)] text-[10px] font-bold text-[color:var(--text-muted)] uppercase tracking-tighter">
          Ref ID: {question.id.toString().padStart(6, '0')} · Internal DSA Record
        </div>
      </div>
    </div>
  );
}
