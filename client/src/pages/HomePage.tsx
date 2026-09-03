import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import useSEO from '../hooks/useSEO';

export default function HomePage() {
  const { state: { currentUser } } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/questions', { replace: true });
    }
  }, [currentUser, navigate]);
  const seoHelmet = useSEO({
    title: 'Company Wise DSA Questions — Master 17,000+ LeetCode Problems',
    description: 'Track your progress through 17,000+ LeetCode problems sorted by company frequency for Google, Amazon, Meta, Microsoft, Apple, Uber & 400+ tech companies.',
    keywords: 'company wise DSA questions, LeetCode company questions, Google DSA questions, Amazon coding interview questions, Meta interview questions, DSA tracker',
    url: '/',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'EducationalApplication',
        'name': 'DSA Prep — Company Wise Questions',
        'operatingSystem': 'Web',
        'applicationCategory': 'EducationalApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'description': 'Interactive coding interview prep platform with 17,000+ LeetCode questions categorized by company frequency across 428 top tech companies.'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What are company wise DSA questions?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Company wise DSA questions are Data Structures and Algorithms problems curated based on their real frequency of appearing in technical coding interviews at specific companies like Google, Amazon, Meta, and Microsoft.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How can I prepare for company-specific coding interviews?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'You can use DSA Prep to filter 17,000+ LeetCode problems by target company, problem difficulty (Easy, Medium, Hard), and topics (Dynamic Programming, Graphs, Trees, Arrays), and sync your solved status directly from LeetCode.'
            }
          }
        ]
      }
    ]
  });

  return (
    <>
      {seoHelmet}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[color:var(--primary)] text-[color:var(--text-main)]">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center border-b-8 border-[color:var(--border-main)]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--border-main) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          {/* <div className="inline-block px-4 py-1.5 bg-[color:var(--surface-active)] border-2 border-[color:var(--border-main)] mb-8 transform -rotate-1">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">Version 2.0 Alpha</span>
          </div> */}
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] uppercase tracking-tighter">
            Stop Randomly <br />
            <span className="block mt-2 bg-[color:var(--text-main)] text-[color:var(--surface)] px-2">Solving.</span>
          </h1>
          
          <p className="max-w-xl text-lg md:text-xl font-bold mb-12 opacity-80 leading-relaxed uppercase italic">
            Focus on what actually gets asked. 1,700+ problems analyzed and sorted by company frequency.
          </p>

          <Link 
            to="/questions" 
            className="group relative px-10 py-5 bg-[color:var(--text-main)] text-[color:var(--surface)] font-black text-xl uppercase brutalist-no-radius border-2 border-[color:var(--border-main)] transition-all transform hover:translate-x-1 hover:-translate-y-1 shadow-[8px_8px_0px_0px_var(--border-main)] hover:shadow-[12px_12px_0px_0px_var(--border-main)] active:shadow-none active:translate-x-0 active:translate-y-0"
          >
            Start Exploring
          </Link>
        </section>

        {/* Value Props */}
        <section className="grid grid-cols-1 md:grid-cols-3 border-b-8 border-[color:var(--border-main)] lg:h-[400px]">
          <div className="p-10 border-b-8 md:border-b-0 md:border-r-8 border-[color:var(--border-main)] flex flex-col justify-center transition-colors hover:bg-[color:var(--surface-hover)]">
            <div className="w-12 h-12 border-2 border-[color:var(--border-main)] mb-6 flex items-center justify-center bg-[color:var(--surface-active)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Company Intel</h3>
            <p className="font-bold text-sm opacity-70 leading-relaxed uppercase">Exactly which questions FAANG companies are asking right now, updated weekly.</p>
          </div>
          
          <div className="p-10 border-b-8 md:border-b-0 md:border-r-8 border-[color:var(--border-main)] flex flex-col justify-center transition-colors hover:bg-[color:var(--surface-hover)]">
            <div className="w-12 h-12 border-2 border-[color:var(--border-main)] mb-6 flex items-center justify-center bg-[color:var(--surface-active)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Precision Metrics</h3>
            <p className="font-bold text-sm opacity-70 leading-relaxed uppercase">Track your solved percentage across categories. Identify weak spots before the interview.</p>
          </div>
          
          <div className="p-10 flex flex-col justify-center transition-colors hover:bg-[color:var(--surface-hover)]">
            <div className="w-12 h-12 border-2 border-[color:var(--border-main)] mb-6 flex items-center justify-center bg-[color:var(--surface-active)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09a10.116 10.116 0 001.283-3.562V11c0-2.73 1.17-5.183 3.033-6.88m-3.033 6.88c.15-.316.326-.057.493.185m2.54-6.88C14.137 3.507 15.07 3 16 3a4 4 0 014 4c0 1.94-.8 4.418-2.31 6.827"></path></svg>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Focus Logic</h3>
            <p className="font-bold text-sm opacity-70 leading-relaxed uppercase">Advanced multi-select filters including "Match All Topics" for surgical problem finding.</p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 py-20 bg-[color:var(--surface-active)] flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl w-full border-4 border-[color:var(--border-main)] p-10 bg-[color:var(--surface)] brutalist-no-radius shadow-[16px_16px_0px_0px_var(--border-main)]">
            <div className="flex-1">
              <h2 className="text-3xl font-black uppercase mb-4 leading-none tracking-tight">Ready to Master your Next Interview?</h2>
              <p className="text-xs font-bold uppercase opacity-60 tracking-widest">Join developers optimizing their path to elite software roles.</p>
            </div>
            <Link 
              to="/auth" 
              className="px-8 py-4 bg-[color:var(--text-main)] text-[color:var(--surface)] font-black uppercase text-sm brutalist-no-radius border-2 border-[color:var(--border-main)] transform hover:-rotate-1 transition-transform"
            >
              Secure your account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t-8 border-[color:var(--border-main)] bg-[color:var(--primary)] flex flex-col items-center gap-8">
            <a 
              href="https://buymeacoffee.com/krish264" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 bg-[#FFDD00] text-black font-black uppercase text-sm brutalist-no-radius border-2 border-[color:var(--border-main)] shadow-[4px_4px_0px_0px_var(--border-main)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--border-main)] transition-all"
            >
              <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
                <path d="M17 10h-1V9a1 1 0 00-1-1H5a1 1 0 00-1 1v9a2 2 0 002 2h9a2 2 0 002-2v-1h1a3 3 0 003-3v-2a3 3 0 00-3-3zm1 5a1 1 0 01-1 1h-1v-3h1a1 1 0 011 1v2z" fill="#111111"/>
                <path d="M5 10h10v2H5z" fill="#4B3621"/>
                <path d="M7 6c0-1 1-1 1-2S7 3 7 2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 6c0-1 1-1 1-2s-1-1-1-2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13 6c0-1 1-1 1-2s-1-1-1-2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 19h11v1H4z" fill="#111111"/>
              </svg>
              Support the Labs
            </a>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Built for the modern engineer. © 2026 DSA PREP LABS.</p>
        </footer>
      </div>
    </>
  );
}
