import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useStats, useProgress } from '../hooks/useProfileData';
import StatsCards from '../components/StatsCards';
import DifficultyChart from '../components/DifficultyChart';
import RecentActivity from '../components/RecentActivity';
import CompanyBreakdown from '../components/CompanyBreakdown';
import useSEO from '../hooks/useSEO';

export default function ProfilePage() {
  const { state: { currentUser, isGuest } } = useUserStore();

  const { data: stats, isLoading: statsLoading } = useStats(currentUser?.id);
  const { data: progress, isLoading: progressLoading } = useProgress(currentUser?.id);

  const activity = progress?.recent_solved ?? [];
  const loading = statsLoading || progressLoading;

  const seoHelmet = useSEO({
    title: 'My Progress — DSA Tracker',
    description: 'Track your LeetCode solving progress across companies. See how many Easy, Medium, and Hard problems you have solved.',
    keywords: 'DSA tracker progress, LeetCode progress, coding interview tracker',
  });

  if (isGuest) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[color:var(--primary)] text-center h-full">
        <div className="max-w-md w-full bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] border-b-8 p-8 sm:p-12 brutalist-no-radius shadow-[8px_8px_0px_0px_var(--border-main)]">
          <div className="w-16 h-16 mx-auto mb-6 bg-[color:var(--surface-active)] border-2 border-[color:var(--border-main)] flex items-center justify-center transform -rotate-6">
            <svg className="w-8 h-8 text-[color:var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-none">Unlock Analytics</h2>
          <p className="text-[color:var(--text-muted)] font-bold text-xs uppercase tracking-widest leading-relaxed mb-8">
            Create a record to access detailed company breakdowns, difficulty distributions, and persistent progress tracking.
          </p>
          <Link 
            to="/auth" 
            className="block w-full bg-[color:var(--text-main)] text-[color:var(--surface)] font-black py-4 px-4 brutalist-no-radius transition-all border-2 border-[color:var(--border-main)] hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_0px_var(--border-main)] active:shadow-none active:translate-x-0 active:translate-y-0 uppercase tracking-widest text-xs"
          >
            Sign In to Start
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 h-full text-[color:var(--text-muted)] uppercase font-black text-xs tracking-[0.3em]">
        Access Denied.
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="flex-1 p-8 flex flex-col justify-center items-center h-[80vh] text-[color:var(--text-main)] border border-[color:var(--border-main)] brutalist-no-radius w-full">
        <svg className="animate-spin h-10 w-10 text-[color:var(--text-main)] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span className="font-bold tracking-widest uppercase">Aggregating Metrics...</span>
      </div>
    );
  }

  return (
    <>
      {seoHelmet}
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
          <div className="mb-6 sm:mb-10 text-center md:text-left">
            <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-widest text-[color:var(--text-main)] mb-2">My Progress</h1>
            <p className="text-[color:var(--text-muted)] text-sm sm:text-lg uppercase font-bold tracking-wider">Engineer <span className="font-extrabold text-[color:var(--text-main)] underline decoration-[color:var(--border-main)] underline-offset-4">@{currentUser.username}</span>.</p>
          </div>

          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6 h-full">
              <div className="flex-none h-80">
                <DifficultyChart stats={stats} />
              </div>
              <div className="flex-1 min-h-[300px]">
                <RecentActivity activity={activity} />
              </div>
            </div>
            
            <div className="lg:col-span-2 h-full min-h-[600px]">
              <CompanyBreakdown companies={stats.companies} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
