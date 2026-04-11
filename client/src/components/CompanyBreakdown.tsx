import type { CompanyStat } from '../types';

interface CompanyBreakdownProps {
  companies: CompanyStat[];
}

export default function CompanyBreakdown({ companies }: CompanyBreakdownProps) {
  if (companies.length === 0) {
    return (
      <div className="bg-[color:var(--surface)] border border-[color:var(--border-main)] brutalist-no-radius p-6 h-full flex flex-col justify-center items-center text-[color:var(--text-muted)]">
        <p className="text-[10px] uppercase font-bold tracking-widest">No company data available.</p>
      </div>
    );
  }

  const maxTotal = Math.max(...companies.map(c => c.total_questions), 1);

  return (
    <div className="bg-[color:var(--surface)] border border-[color:var(--border-main)] border-b-8 brutalist-no-radius p-6 flex flex-col relative h-full">
      <h3 className="text-[color:var(--text-muted)] text-[10px] font-extrabold uppercase tracking-widest mb-6 border-b border-[color:var(--border-main)] pb-2">Top Company Completion</h3>
      
      <div className="flex flex-col gap-6 flex-1 pr-2 mt-2 overflow-y-auto min-h-0 h-0 custom-scrollbar pr-2">
        {companies.map((c) => {
          const solvedPctRaw = (c.solved_questions / c.total_questions) * 100;
          const totalWidthPct = (c.total_questions / maxTotal) * 100;
          
          return (
            <div key={c.name} className="flex flex-col gap-2 group mb-6">
              <div className="flex justify-between items-end text-sm">
                <span className="font-extrabold text-[color:var(--text-main)] uppercase tracking-wider text-[11px]">{c.name}</span>
                <div className="flex items-baseline gap-1 font-mono text-[10px]">
                  <span className={c.solved_questions > 0 ? "text-[color:var(--text-main)] font-extrabold" : "text-[color:var(--text-muted)]"}>{c.solved_questions}</span>
                  <span className="text-[color:var(--text-muted)] font-bold">/ {c.total_questions}</span>
                </div>
              </div>
              
              <div className="w-full bg-[color:var(--surface-active)] h-2 border border-[color:var(--border-main)] brutalist-no-radius overflow-hidden">
                <div 
                  className="h-full bg-[color:var(--border-subtle)] relative overflow-hidden" 
                  style={{ width: `${totalWidthPct}%` }}
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-[color:var(--text-main)] transition-all duration-1000 ease-out border-r border-[color:var(--border-main)]"
                    style={{ width: `${solvedPctRaw}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
