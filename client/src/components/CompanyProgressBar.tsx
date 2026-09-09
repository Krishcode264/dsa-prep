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
    <div className="bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] p-4 sm:p-5 brutalist-no-radius shadow-[4px_4px_0px_0px_var(--border-main)] my-2">
      {/* Top info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-[color:var(--text-main)]">
            Company Progress
          </span>
          <span className="px-2.5 py-0.5 bg-[color:var(--surface-active)] border-2 border-[color:var(--border-main)] text-[10px] font-black uppercase tracking-wide">
            {overallPct}% Completed
          </span>
        </div>
        <div className="text-xs font-mono font-black text-[color:var(--text-main)]">
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">{totalSolved}</span>
          <span className="text-[color:var(--text-muted)] font-extrabold"> / {totalQuestions} Questions Solved</span>
        </div>
      </div>

      {/* Multi-colored Stacked Progress Bar */}
      <div className="w-full bg-[color:var(--surface-active)] h-5 border-2 border-[color:var(--border-main)] brutalist-no-radius overflow-hidden flex relative">
        {/* Easy Segment - Green */}
        {easyWidthPct > 0 && (
          <div
            style={{ width: `${easyWidthPct}%` }}
            className="h-full bg-emerald-500 border-r-2 border-[color:var(--border-main)] transition-all duration-500"
            title={`Easy Solved: ${easySolved}/${easyTotal}`}
          />
        )}
        {/* Medium Segment - Yellow/Orange */}
        {mediumWidthPct > 0 && (
          <div
            style={{ width: `${mediumWidthPct}%` }}
            className="h-full bg-amber-500 border-r-2 border-[color:var(--border-main)] transition-all duration-500"
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

      {/* High-Contrast Difficulty Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t-2 border-[color:var(--border-main)] text-xs font-bold">
        {/* Easy Card */}
        <div className="flex items-center justify-between bg-[color:var(--surface-hover)] p-3 border-2 border-[color:var(--border-main)] brutalist-no-radius shadow-[2px_2px_0px_0px_var(--border-main)]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-[color:var(--border-main)] bg-emerald-500 shrink-0"></span>
            <span className="uppercase text-xs font-black tracking-wider text-[color:var(--text-main)]">Easy</span>
          </div>
          <div className="font-mono text-xs font-black text-[color:var(--text-main)]">
            <span className="text-emerald-700 dark:text-emerald-400 font-black">{easySolved}</span>
            <span className="text-[color:var(--text-muted)] font-bold"> / {easyTotal}</span>
          </div>
        </div>

        {/* Medium Card */}
        <div className="flex items-center justify-between bg-[color:var(--surface-hover)] p-3 border-2 border-[color:var(--border-main)] brutalist-no-radius shadow-[2px_2px_0px_0px_var(--border-main)]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-[color:var(--border-main)] bg-amber-500 shrink-0"></span>
            <span className="uppercase text-xs font-black tracking-wider text-[color:var(--text-main)]">Medium</span>
          </div>
          <div className="font-mono text-xs font-black text-[color:var(--text-main)]">
            <span className="text-amber-700 dark:text-amber-400 font-black">{mediumSolved}</span>
            <span className="text-[color:var(--text-muted)] font-bold"> / {mediumTotal}</span>
          </div>
        </div>

        {/* Hard Card */}
        <div className="flex items-center justify-between bg-[color:var(--surface-hover)] p-3 border-2 border-[color:var(--border-main)] brutalist-no-radius shadow-[2px_2px_0px_0px_var(--border-main)]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-[color:var(--border-main)] bg-rose-500 shrink-0"></span>
            <span className="uppercase text-xs font-black tracking-wider text-[color:var(--text-main)]">Hard</span>
          </div>
          <div className="font-mono text-xs font-black text-[color:var(--text-main)]">
            <span className="text-rose-700 dark:text-rose-400 font-black">{hardSolved}</span>
            <span className="text-[color:var(--text-muted)] font-bold"> / {hardTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
