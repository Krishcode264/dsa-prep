import type { StatsPayload } from '../types';

interface StatsCardsProps {
  stats: StatsPayload;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { title: 'Total Solved', solved: stats.user.total, total: stats.global.total },
    { title: 'Easy Solved', solved: stats.user.easy, total: stats.global.easy },
    { title: 'Medium Solved', solved: stats.user.medium, total: stats.global.medium },
    { title: 'Hard Solved', solved: stats.user.hard, total: stats.global.hard },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {cards.map((c) => {
        const pct = c.total > 0 ? Math.min((c.solved / c.total) * 100, 100) : 0;
        return (
          <div key={c.title} className="bg-[color:var(--surface)] p-3 sm:p-6 flex flex-col border-2 border-[color:var(--border-main)] brutalist-no-radius min-h-[100px] sm:min-h-[140px] hover:bg-[color:var(--surface-hover)] transition-colors">
            <h3 className="text-[color:var(--text-muted)] text-[9px] sm:text-[11px] font-extrabold uppercase tracking-widest mb-2 sm:mb-4 flex items-center justify-between gap-1">
              <span className="truncate">{c.title}</span>
              <span className="text-[8px] sm:text-[10px] px-1 sm:px-2 py-0.5 border border-[color:var(--border-main)] text-[color:var(--text-main)] bg-[color:var(--surface-active)] shrink-0">{pct.toFixed(0)}%</span>
            </h3>
            <div className="flex items-baseline gap-1 sm:gap-2 mb-2">
              <span className="text-2xl sm:text-4xl font-extrabold text-[color:var(--text-main)] tracking-tighter">{c.solved}</span>
              <span className="text-[color:var(--text-muted)] font-bold text-[10px] sm:text-sm">/ {c.total}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
