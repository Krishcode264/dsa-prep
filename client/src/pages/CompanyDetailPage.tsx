import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import CompanyLogo from '../components/CompanyLogo';
import CompanyProgressBar from '../components/CompanyProgressBar';
import QuestionTable from '../components/QuestionTable';
import { useUserStore } from '../store/userStore';
import { useCompanyDetail } from '../hooks/useReferenceData';
import { useQuestions } from '../hooks/useQuestions';
import type { QuestionFilters } from '../types';
import useSEO from '../hooks/useSEO';

export default function CompanyDetailPage() {
  const { companyName = '' } = useParams<{ companyName: string }>();
  const decodedCompanyName = decodeURIComponent(companyName);

  const { state: { currentUser } } = useUserStore();
  const userId = currentUser?.id;

  const { data: company, isLoading: companyLoading } = useCompanyDetail(decodedCompanyName, userId);

  // Questions & Pagination
  const [page, setPage] = useState(1);
  const limit = 50;

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [status, setStatus] = useState<'all' | 'solved' | 'unsolved'>('all');

  const activeCompanies = useMemo(() => [decodedCompanyName], [decodedCompanyName]);

  const queryFilters: QuestionFilters = useMemo(() => ({
    companies: [decodedCompanyName],
    topics: [],
    search: search.trim() || undefined,
    difficulty: difficulty !== 'ALL' ? difficulty : undefined,
    status: status !== 'all' ? status : undefined,
    userId: userId,
  }), [decodedCompanyName, search, difficulty, status, userId]);

  const { questions, pagination, loading: questionsLoading, error: queryQuestionsError } = useQuestions(page, limit, queryFilters);
  const totalQuestions = pagination.total;
  const questionsError = queryQuestionsError ? queryQuestionsError.message : null;

  const seoHelmet = useSEO({
    title: `${decodedCompanyName} LeetCode Questions & Interview Prep (${totalQuestions} Problems)`,
    description: `Practice ${totalQuestions}+ LeetCode DSA questions asked in ${decodedCompanyName} coding interviews sorted by real interview frequency. Filter by difficulty (Easy, Medium, Hard) and status.`,
    keywords: `${decodedCompanyName} DSA questions, ${decodedCompanyName} LeetCode frequency, ${decodedCompanyName} coding interview problems, ${decodedCompanyName} software engineer interview`,
    url: `/companies/${encodeURIComponent(decodedCompanyName)}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://company-wise-dsa-prep.vercel.app/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Companies',
            'item': 'https://company-wise-dsa-prep.vercel.app/companies'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': decodedCompanyName,
            'item': `https://company-wise-dsa-prep.vercel.app/companies/${encodeURIComponent(decodedCompanyName)}`
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': `${decodedCompanyName} Frequently Asked LeetCode Questions`,
        'description': `Top Data Structures & Algorithms questions asked in ${decodedCompanyName} technical interviews.`,
        'numberOfItems': totalQuestions,
        'itemListElement': questions.slice(0, 15).map((q, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': q.title,
          'url': q.link
        }))
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': `How many DSA questions are in the ${decodedCompanyName} problem bank?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `There are ${totalQuestions} curated LeetCode questions for ${decodedCompanyName} sorted by frequency of appearance in technical interviews.`
            }
          },
          {
            '@type': 'Question',
            'name': `What difficulty levels are asked in ${decodedCompanyName} interviews?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `${decodedCompanyName} coding interviews cover Easy, Medium, and Hard LeetCode problems, with a heavy emphasis on Medium and Hard data structures and algorithm challenges.`
            }
          }
        ]
      }
    ]
  });

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleDifficultyChange = (diff: 'ALL' | 'EASY' | 'MEDIUM' | 'HARD') => {
    setDifficulty(diff);
    setPage(1);
  };

  const handleStatusChange = (s: 'all' | 'solved' | 'unsolved') => {
    setStatus(s);
    setPage(1);
  };

  const totalPages = Math.ceil(totalQuestions / limit);

  return (
    <>
      {seoHelmet}
      <div className="flex-1 flex flex-col h-full bg-[color:var(--primary)] overflow-hidden">
        
        {/* Main Scrollable View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 flex flex-col gap-6">
          <div className="max-w-6xl w-full mx-auto flex flex-col gap-6">
            
            {/* Back link */}
            <div>
              <Link 
                to="/companies" 
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] text-xs font-black uppercase tracking-wider hover:bg-[color:var(--surface-hover)] brutalist-no-radius transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Companies
              </Link>
            </div>

            {/* Header with Company Logo & Name */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] p-5 sm:p-6 brutalist-no-radius shadow-[6px_6px_0px_0px_var(--border-main)]">
              <div className="flex items-center gap-5">
                <CompanyLogo companyName={decodedCompanyName} size={64} />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[color:var(--surface-active)] border border-[color:var(--border-main)] text-[10px] font-black uppercase">
                      Company Focus
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[color:var(--text-main)]">
                    {decodedCompanyName}
                  </h1>
                  <p className="text-xs font-mono font-bold opacity-60 mt-1">
                    LeetCode Problem Bank · {totalQuestions} Problems Available
                  </p>
                </div>
              </div>
            </header>

            {/* Horizontal Difficulty Breakdown Progress Bar */}
            {!companyLoading && company && (
              <CompanyProgressBar 
                easySolved={company.easy_solved || 0}
                easyTotal={company.easy_total || 0}
                mediumSolved={company.medium_solved || 0}
                mediumTotal={company.medium_total || 0}
                hardSolved={company.hard_solved || 0}
                hardTotal={company.hard_total || 0}
              />
            )}

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] p-4 brutalist-no-radius shadow-[4px_4px_0px_0px_var(--border-main)]">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={`Search ${decodedCompanyName} questions...`}
                  className="w-full pl-4 pr-9 py-2 bg-[color:var(--primary)] border-2 border-[color:var(--border-main)] text-xs font-extrabold text-[color:var(--text-main)] placeholder:text-[color:var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--border-main)] brutalist-no-radius"
                />
                {search && (
                  <button 
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Difficulty filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider mr-1 opacity-60">Diff:</span>
                {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDifficultyChange(d)}
                    className={`px-3 py-1 text-[10px] font-black uppercase border border-[color:var(--border-main)] transition-all brutalist-no-radius ${
                      difficulty === d
                        ? 'bg-[color:var(--text-main)] text-[color:var(--surface)]'
                        : 'bg-[color:var(--surface)] text-[color:var(--text-main)] hover:bg-[color:var(--surface-hover)]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Status filter — only for logged-in users */}
              {userId && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider mr-1 opacity-60">Status:</span>
                  {(['all', 'unsolved', 'solved'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`px-3 py-1 text-[10px] font-black uppercase border border-[color:var(--border-main)] transition-all brutalist-no-radius ${
                        status === s
                          ? 'bg-[color:var(--text-main)] text-[color:var(--surface)]'
                          : 'bg-[color:var(--surface)] text-[color:var(--text-main)] hover:bg-[color:var(--surface-hover)]'
                      }`}
                    >
                      {s === 'all' ? 'All' : s === 'solved' ? '✓ Solved' : '○ Unsolved'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Table Area */}
            <div className="bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] brutalist-no-radius overflow-hidden shadow-[4px_4px_0px_0px_var(--border-main)]">
              {questionsLoading ? (
                <div className="flex flex-col items-center justify-center p-16">
                  <svg className="animate-spin h-8 w-8 text-[color:var(--border-main)] mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-xs font-black uppercase tracking-widest">Fetching {decodedCompanyName} questions...</span>
                </div>
              ) : questionsError ? (
                <div className="p-10 text-center">
                  <p className="text-sm font-black text-rose-500 uppercase">Error Loading Problems</p>
                  <p className="text-xs mt-2 opacity-75 font-bold uppercase">{questionsError}</p>
                </div>
              ) : (
                <QuestionTable 
                  questions={questions} 
                  activeCompanies={activeCompanies} 
                  page={page} 
                  limit={limit} 
                />
              )}

              {/* Sticky / Footer Pagination */}
              {totalQuestions > 0 && (
                <div className="p-4 border-t-2 border-[color:var(--border-main)] flex flex-col sm:flex-row items-center justify-between bg-[color:var(--surface-active)] gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-main)]">
                    Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalQuestions)} of {totalQuestions} Questions
                  </p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      disabled={page <= 1 || questionsLoading} 
                      className="px-4 py-1.5 border-2 border-[color:var(--border-main)] font-black text-[10px] uppercase disabled:opacity-30 tracking-tighter hover:bg-[color:var(--surface)] bg-[color:var(--surface)] text-[color:var(--text-main)] transition-all shadow-[2px_2px_0px_0px_var(--border-main)] disabled:shadow-none"
                    >
                      PREV PAGE
                    </button>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                      disabled={page >= totalPages || questionsLoading} 
                      className="px-4 py-1.5 border-2 border-[color:var(--border-main)] font-black text-[10px] uppercase disabled:opacity-30 tracking-tighter hover:bg-[color:var(--surface)] bg-[color:var(--surface)] text-[color:var(--text-main)] transition-all shadow-[2px_2px_0px_0px_var(--border-main)] disabled:shadow-none"
                    >
                      NEXT PAGE
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
