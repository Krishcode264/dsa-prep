import { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import QuestionTable from '../components/QuestionTable';
import SEOIntroBlock from '../components/SEOIntroBlock';
import { useQuestions } from '../hooks/useQuestions';
import { useFilters } from '../hooks/useFilters';
import useSEO from '../hooks/useSEO';

export default function QuestionsPage() {
  const filtersHook = useFilters();
  const { filters } = filtersHook;
  
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 50;

  const { questions, pagination, loading, error, isPlaceholderData } = useQuestions(page, limit, filters);
  const { total } = pagination;
  const totalPages = Math.ceil(total / limit);

  const activeCompany = filters.companies.length === 1 ? filters.companies[0] : null;
  const hasAnyFilter = filters.companies.length > 0 || filters.topics.length > 0 || !!filters.difficulty || !!filters.search;

  const seoHelmet = useSEO({
    title: activeCompany ? `${activeCompany} DSA Questions — LeetCode Interview Problems` : 'Company Wise DSA Questions — LeetCode Problem Tracker',
    description: activeCompany ? `LeetCode questions frequently asked in ${activeCompany} interviews.` : 'Browse LeetCode questions asked by top companies.',
    keywords: 'company wise DSA questions, LeetCode company questions, interview problems',
    url: `/questions${activeCompany ? `?company=${encodeURIComponent(activeCompany)}` : ''}`,
  });

  useEffect(() => {
    setPage(1);
  }, [filters.companies, filters.topics, filters.difficulty, filters.search, filters.topicMatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowFilters(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeFiltersStr = [
    ...(filters.companies?.map(c => ({k: 'companies', v: c})) || []),
    ...(filters.topics?.map(t => ({k: 'topics', v: t})) || []),
    ...(filters.difficulty ? [{k: 'difficulty', v: filters.difficulty}] : []),
    ...(filters.search ? [{k: 'search', v: `"${filters.search}"`}] : [])
  ];

  const removeFilter = (key: string, val: string) => {
    if (key === 'difficulty') filtersHook.updateFilters({ difficulty: '' });
    if (key === 'search') filtersHook.updateFilters({ search: '' });
    if (key === 'companies') filtersHook.toggleCompany(val);
    if (key === 'topics') filtersHook.toggleTopic(val);
  };

  const activeCount = filters.companies.length + filters.topics.length + (filters.difficulty ? 1 : 0);

  return (
    <>
      {seoHelmet}
      {/* Rigid Viewport Container: 100vh h-screen is provided by index.css on #root */}
      <div className="md:grid md:grid-cols-[330px_1fr] flex flex-col h-full bg-[color:var(--primary)] relative overflow-hidden">
        
        {/* Sidebar: Fixed scroll area via FilterPanel internal scroll */}
        <div className="hidden md:block h-full border-r border-[color:var(--border-main)] overflow-hidden">
          <FilterPanel filtersHook={filtersHook} />
        </div>

        {/* Mobile filter overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="relative z-10 w-[85vw] max-w-sm h-full animate-slide-in">
              <FilterPanel filtersHook={filtersHook} />
              <button 
                onClick={() => setShowFilters(false)} 
                className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center border border-[color:var(--border-main)] bg-[color:var(--surface)] text-[color:var(--text-main)] font-bold text-xl brutalist-no-radius"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Main Content Area: Use flex-1 min-h-0 to avoid growing past viewport */}
        <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-[color:var(--primary)] overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1 min-h-0">
            <header className="mb-4 shrink-0">
              <SEOIntroBlock activeCompany={activeCompany} hasAnyFilter={hasAnyFilter} />
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => setShowFilters(true)} className="md:hidden px-3 py-1.5 border border-[color:var(--border-main)] text-[10px] font-bold uppercase transition-colors hover:bg-[color:var(--surface-hover)] bg-[color:var(--surface)]">Filters</button>
                <h2 className="text-xl md:text-3xl font-extrabold uppercase tracking-widest text-[color:var(--text-main)] border-b-4 border-[color:var(--border-main)] inline-block pb-1">
                  {activeCompany ? `${activeCompany} Questions` : 'Problem Bank'}
                </h2>
              </div>
            </header>

            {/* Filter Summary Header: Stable positioning */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[color:var(--text-muted)] bg-[color:var(--surface)] p-3 border border-[color:var(--border-main)] relative shrink-0">
              <span className="font-bold text-[color:var(--text-main)] uppercase">{total} matches <span className="text-[10px] font-normal opacity-50 ml-1">(Page {page})</span></span>
              {isPlaceholderData && <span className="absolute right-3 text-[10px] uppercase font-bold text-[color:var(--text-muted)] animate-pulse">Syncing...</span>}
              <div className="flex flex-wrap gap-1.5 ml-2">
                {activeFiltersStr.map(({k, v}) => (
                  <span key={`${k}-${v}`} className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[color:var(--surface-active)] border border-[color:var(--border-main)] text-[color:var(--text-main)] text-[10px] font-bold uppercase">
                    {v}
                    <button onClick={() => removeFilter(k, v)} className="hover:text-red-500 transition-colors">×</button>
                  </span>
                ))}
              </div>
              {activeCount > 0 && <button onClick={filtersHook.clearAll} className="ml-auto text-[10px] uppercase font-bold hover:underline transition-all">Clear all</button>}
            </div>
            
            {/* Scrollable Container: flex-1 for rigid fill */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 bg-[color:var(--surface)] border border-[color:var(--border-main)] relative shadow-inner">
              {loading && !isPlaceholderData ? (
                <div className="flex flex-col gap-4 justify-center items-center h-full text-[color:var(--text-main)]">
                  <svg className="animate-spin h-8 w-8 text-[color:var(--border-main)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span className="font-bold uppercase tracking-widest text-sm">Fetching problems...</span>
                </div>
              ) : error ? (
                <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="border-2 border-[color:var(--border-main)] bg-[color:var(--surface-active)] p-6 max-w-sm">
                    <p className="font-extrabold uppercase text-[color:var(--text-error)]">Sync Failed</p>
                    <p className="text-xs mt-3 opacity-75 font-bold uppercase break-words">{error.message}</p>
                    <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-[color:var(--text-main)] text-[color:var(--text-inverse)] font-bold uppercase text-[10px] hover:opacity-80 transition-opacity">Retry Connection</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col min-h-full">
                  <div className="flex-1">
                    <QuestionTable questions={questions} activeCompanies={filters.companies} />
                  </div>
                  
                  {total > 0 && (
                    <div className="sticky bottom-0 p-3 sm:p-4 border-t-2 border-[color:var(--border-main)] flex flex-col sm:flex-row items-center justify-between bg-[color:var(--surface-active)] z-10 gap-2">
                      <div className="flex items-center gap-2">
                        {/* <span className="w-2 h-2 rounded-full bg-green-500"></span> */}
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-main)]">
                          {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} Questions
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setPage(p => Math.max(1, p - 1))} 
                          disabled={page <= 1 || loading} 
                          className="px-3 sm:px-4 py-1.5 border-2 border-[color:var(--border-main)] font-black text-[10px] uppercase disabled:opacity-30 tracking-tighter hover:bg-[color:var(--surface)] bg-[color:var(--surface)] text-[color:var(--text-main)] transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none"
                        >
                          PREV PAGE
                        </button>
                        <button 
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                          disabled={page >= totalPages || loading} 
                          className="px-3 sm:px-4 py-1.5 border-2 border-[color:var(--border-main)] font-black text-[10px] uppercase disabled:opacity-30 tracking-tighter hover:bg-[color:var(--surface)] bg-[color:var(--surface)] text-[color:var(--text-main)] transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none"
                        >
                          NEXT PAGE
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
