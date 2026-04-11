interface SEOIntroBlockProps {
  activeCompany: string | null;
  hasAnyFilter: boolean;
}

export default function SEOIntroBlock({ activeCompany, hasAnyFilter }: SEOIntroBlockProps) {
  // Hide the block when any filter is active (non-company) to avoid cluttering filtered views
  if (hasAnyFilter && !activeCompany) return null;

  if (activeCompany) {
    return (
      <section aria-label={`${activeCompany} interview questions`} className="pb-3 sm:pb-4 border-b border-[color:var(--border-subtle)] mb-3 sm:mb-4">
        <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-[color:var(--text-main)] mb-1.5">
          {activeCompany} DSA Interview Questions
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed max-w-2xl">
          LeetCode problems frequently asked in {activeCompany} coding interviews, sorted by frequency.
          Use the filters to narrow by topic or difficulty level.
        </p>
      </section>
    );
  }

  // Default: no filters active — show the full SEO content block
  return (
    <section aria-label="About DSA Tracker" className="pb-3 sm:pb-4 border-b border-[color:var(--border-subtle)] mb-3 sm:mb-4">
      <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-[color:var(--text-main)] mb-1.5">
        Company Wise DSA Questions
      </h1>
      <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed max-w-2xl">
        Browse LeetCode questions frequently asked in top tech company interviews — Google, Amazon,
        Microsoft, Meta, Apple, and more. Filter by company, topic, or difficulty. Tick questions as
        solved and track your interview prep progress.
      </p>
      <p className="text-[10px] sm:text-xs text-[color:var(--text-muted)] mt-1.5 leading-relaxed max-w-2xl opacity-70">
        Data sourced from company-wise frequency data. Questions sorted by how frequently they appear
        in real interviews.
      </p>
    </section>
  );
}
