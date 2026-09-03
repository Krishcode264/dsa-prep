import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyLogo from '../components/CompanyLogo';
import { useUserStore } from '../store/userStore';
import { useCompanies } from '../hooks/useReferenceData';
import useSEO from '../hooks/useSEO';

export default function CompaniesPage() {
  const navigate = useNavigate();
  const { state: { currentUser } } = useUserStore();
  const userId = currentUser?.id;

  const { data: companies = [], isLoading: loading, error: queryError } = useCompanies(userId);
  const error = queryError ? (queryError as Error).message : null;
  const [search, setSearch] = useState('');

  const seoHelmet = useSEO({
    title: 'Company Wise LeetCode Questions & DSA Problems — DSA Prep',
    description: 'Explore top tech companies like Amazon, Google, Meta, Apple, Microsoft, and TikTok sorted by frequency and problem count.',
    keywords: 'company wise DSA, LeetCode company questions, Amazon questions, Google questions, Meta questions',
    url: '/companies',
  });

  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return companies;
    const term = search.toLowerCase().trim();
    return companies.filter(c => c.name.toLowerCase().includes(term));
  }, [companies, search]);

  return (
    <>
      {seoHelmet}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[color:var(--primary)] text-[color:var(--text-main)] p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          
          {/* Header section */}
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[color:var(--surface-active)] border border-[color:var(--border-main)] text-[10px] font-black uppercase tracking-widest">
                Directory
              </span>
              <span className="text-xs font-bold opacity-60 uppercase">
                {companies.length} Top Tech Companies
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Target By Company
            </h1>
            <p className="text-xs md:text-sm font-bold opacity-75 uppercase max-w-2xl">
              Solve problems curated specifically by company frequency. Choose your target company to start practicing.
            </p>
          </header>

          {/* Search Bar & Stats Pill */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] p-4 brutalist-no-radius shadow-[4px_4px_0px_0px_var(--border-main)]">
            <div className="relative flex-1 max-w-md">
              <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company (e.g. Amazon, Google, Meta)..."
                className="w-full pl-11 pr-10 py-2.5 bg-[color:var(--primary)] border-2 border-[color:var(--border-main)] text-xs font-extrabold text-[color:var(--text-main)] placeholder:text-[color:var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--border-main)] brutalist-no-radius"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-black uppercase tracking-wider">
              <span className="opacity-60">Showing:</span>
              <span className="px-3 py-1 bg-[color:var(--text-main)] text-[color:var(--surface)] brutalist-no-radius">
                {filteredCompanies.length} Companies
              </span>
            </div>
          </div>

          {/* Content Loading/Error/Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] brutalist-no-radius">
              <svg className="animate-spin h-8 w-8 text-[color:var(--border-main)] mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-black uppercase tracking-widest">Loading company directory...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] brutalist-no-radius">
              <p className="text-sm font-black text-rose-500 uppercase">Error Loading Companies</p>
              <p className="text-xs mt-2 opacity-75 font-bold uppercase">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[color:var(--text-main)] text-[color:var(--surface)] font-bold text-xs uppercase brutalist-no-radius"
              >
                Retry
              </button>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="p-12 text-center bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] brutalist-no-radius">
              <p className="text-lg font-black uppercase tracking-widest">No Companies Found</p>
              <p className="text-xs mt-2 opacity-60 font-bold uppercase">No company matches "{search}".</p>
              <button
                onClick={() => setSearch('')}
                className="mt-4 px-4 py-2 border-2 border-[color:var(--border-main)] text-xs font-extrabold uppercase hover:bg-[color:var(--surface-hover)]"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => {
                const total = company.total_questions || 0;
                const solved = company.solved_questions || 0;
                const pct = total > 0 ? ((solved / total) * 100).toFixed(0) : '0';

                return (
                  <div
                    key={company.id}
                    onClick={() => navigate(`/companies/${encodeURIComponent(company.name)}`)}
                    className="group bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_0px_var(--border-main)] hover:shadow-[8px_8px_0px_0px_var(--border-main)] active:translate-x-0 active:translate-y-0 active:shadow-none brutalist-no-radius"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Real Logo / SVG Avatar */}
                      <CompanyLogo companyName={company.name} size={50} />

                      {/* Info */}
                      <div className="flex flex-col min-w-0">
                        <h3 className="text-lg font-black uppercase tracking-tight text-[color:var(--text-main)] group-hover:underline truncate">
                          {company.name}
                        </h3>
                        <p className="text-[11px] font-bold opacity-60 font-mono tracking-tight mt-0.5">
                          LeetCode · {total.toLocaleString()} Questions
                        </p>
                        
                        {/* Solved Status */}
                        {userId && (
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold">
                            <div className="w-16 bg-[color:var(--surface-active)] h-1.5 border border-[color:var(--border-main)] overflow-hidden">
                              <div 
                                className="bg-[color:var(--text-main)] h-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-mono text-[9px] opacity-80">
                              {solved}/{total} ({pct}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chevron Arrow */}
                    <div className="w-8 h-8 rounded-lg border border-[color:var(--border-main)] flex items-center justify-center bg-[color:var(--surface-active)] group-hover:bg-[color:var(--text-main)] group-hover:text-[color:var(--surface)] transition-colors shrink-0 ml-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
