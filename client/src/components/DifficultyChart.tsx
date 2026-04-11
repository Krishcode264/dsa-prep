import type { StatsPayload } from '../types';

export default function DifficultyChart({ stats }: { stats: StatsPayload }) {
  const { total, easy, medium, hard } = stats.user;
  
  const radius = 45;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  // Percentages relative to total solved
  const easyPct = total > 0 ? easy / total : 0;
  const mediumPct = total > 0 ? medium / total : 0;
  const hardPct = total > 0 ? hard / total : 0;

  const easyDash = easyPct * circumference;
  const mediumDash = mediumPct * circumference;
  const hardDash = hardPct * circumference;

  const easyOffset = 0;
  const mediumOffset = -easyDash;
  const hardOffset = -easyDash - mediumDash;

  return (
    <div className="bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] border-b-8 brutalist-no-radius p-6 pb-12 flex flex-col items-center justify-center h-full relative">
      <h3 className="text-[color:var(--text-muted)] text-[10px] font-extrabold uppercase tracking-widest absolute top-6 left-6 border-b border-[color:var(--border-main)]">Ratio</h3>
      
      <div className="relative w-48 h-48 mt-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--surface-active)"
            strokeWidth={strokeWidth}
          />
          
          {total > 0 && (
            <>
              {/* Easy Arc */}
              {easy > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="var(--text-main)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${easyDash} ${circumference}`}
                  strokeDashoffset={easyOffset}
                  strokeLinecap="square"
                  className="transition-all duration-1000 ease-out"
                />
              )}
              {/* Medium Arc */}
              {medium > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${mediumDash} ${circumference}`}
                  strokeDashoffset={mediumOffset}
                  strokeLinecap="square"
                  className="transition-all duration-1000 ease-out"
                />
              )}
              {/* Hard Arc */}
              {hard > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${hardDash} ${circumference}`}
                  strokeDashoffset={hardOffset}
                  strokeLinecap="square"
                  className="transition-all duration-1000 ease-out"
                />
              )}
            </>
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-[color:var(--text-main)]">{total}</span>
          <span className="text-[10px] text-[color:var(--text-muted)] uppercase font-bold mt-1">Solved</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 mt-6 text-[10px] font-bold text-[color:var(--text-main)] uppercase tracking-widest">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[color:var(--text-main)] border border-[color:var(--border-main)] brutalist-no-radius"></span> Easy</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[color:var(--text-muted)] border border-[color:var(--border-main)] brutalist-no-radius"></span> Med</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[color:var(--border-subtle)] border border-[color:var(--border-main)] brutalist-no-radius"></span> Hard</div>
      </div>
    </div>
  );
}
