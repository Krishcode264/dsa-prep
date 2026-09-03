interface CompanyProgressBarProps {
  easySolved?: number;
  easyTotal?: number;
  mediumSolved?: number;
  mediumTotal?: number;
  hardSolved?: number;
  hardTotal?: number;
}

export default function CompanyProgressBar({
  easySolved = 0,
  easyTotal = 0,
  mediumSolved = 0,
  mediumTotal = 0,
  hardSolved = 0,
  hardTotal = 0,
}: CompanyProgressBarProps) {
  const totalQuestions = easyTotal + mediumTotal + hardTotal;
  const totalSolved = easySolved + mediumSolved + hardSolved;
  const overallPct = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : '0';

  // Calculate widths as percentage of totalQuestions
  const easyWidthPct = totalQuestions > 0 ? (easySolved / totalQuestions) * 100 : 0;
  const mediumWidthPct = totalQuestions > 0 ? (mediumSolved / totalQuestions) * 100 : 0;
  const hardWidthPct = totalQuestions > 0 ? (hardSolved / totalQuestions) * 100 : 0;

  return (
    <div className="bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] p-4 sm:p-5 brutalist-no-radius shadow-[4px_4px_0px_0px_var(--border-main)] my-4">
      {/* Top info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-[color:var(--text-main)]">
            Company Progress
          </span>
          <span className="px-2 py-0.5 bg-[color:var(--surface-active)] border border-[color:var(--border-main)] text-[10px] font-bold">
            {overallPct}% Completed
          </span>
        </div>
        <div className="text-xs font-mono font-bold text-[color:var(--text-main)]">
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{totalSolved}</span>
          <span className="opacity-60"> / {totalQuestions} Questions Solved</span>
        </div>
      </div>

      {/* Multi-colored Stacked Progress Bar */}
      <div className="w-full bg-[color:var(--surface-active)] h-4 border-2 border-[color:var(--border-main)] brutalist-no-radius overflow-hidden flex relative">
        {/* Easy Segment - Green */}
        {easyWidthPct > 0 && (
          <div
            style={{ width: `${easyWidthPct}%` }}
            className="h-full bg-emerald-500 border-r border-black/20 transition-all duration-500"
            title={`Easy Solved: ${easySolved}/${easyTotal}`}
          />
        )}
        {/* Medium Segment - Yellow/Orange */}
        {mediumWidthPct > 0 && (
          <div
            style={{ width: `${mediumWidthPct}%` }}
            className="h-full bg-amber-500 border-r border-black/20 transition-all duration-500"
            title={`Medium Solved: ${mediumSolved}/${mediumTotal}`}
          />
        )}
        {/* Hard Segment - Red */}
        {hardWidthPct > 0 && (
          <div
            style={{ width: `${hardWidthPct}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`Hard Solved: ${hardSolved}/${hardTotal}`}
          />
        )}
      </div>

      {/* Breakdown Legend */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[color:var(--border-main)] text-[11px] font-bold">
        {/* Easy */}
        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-2 border border-emerald-500/30 brutalist-no-radius">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="uppercase text-[10px] text-emerald-800 dark:text-emerald-300">Easy</span>
          </div>
          <span className="font-mono text-emerald-700 dark:text-emerald-400">
            {easySolved} <span className="opacity-50">/ {easyTotal}</span>
          </span>
        </div>

        {/* Medium */}
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-2 border border-amber-500/30 brutalist-no-radius">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
            <span className="uppercase text-[10px] text-amber-800 dark:text-amber-300">Medium</span>
          </div>
          <span className="font-mono text-amber-700 dark:text-amber-400">
            {mediumSolved} <span className="opacity-50">/ {mediumTotal}</span>
          </span>
        </div>

        {/* Hard */}
        <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-950/40 p-2 border border-rose-500/30 brutalist-no-radius">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
            <span className="uppercase text-[10px] text-rose-800 dark:text-rose-300">Hard</span>
          </div>
          <span className="font-mono text-rose-700 dark:text-rose-400">
            {hardSolved} <span className="opacity-50">/ {hardTotal}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
