import { useUserStore } from '../store/userStore';
import { useStats, useProgress } from '../hooks/useProfileData';
import StatsCards from '../components/StatsCards';
import DifficultyChart from '../components/DifficultyChart';
import RecentActivity from '../components/RecentActivity';
import CompanyBreakdown from '../components/CompanyBreakdown';
import useSEO from '../hooks/useSEO';

export default function ProfilePage() {
  const { state: { currentUser } } = useUserStore();

  const { data: stats, isLoading: statsLoading } = useStats(currentUser?.id);
  const { data: progress, isLoading: progressLoading } = useProgress(currentUser?.id);

  const activity = progress?.recent_solved ?? [];
  const loading = statsLoading || progressLoading;

  const seoHelmet = useSEO({
    title: 'My Progress — DSA Tracker',
    description: 'Track your LeetCode solving progress across companies. See how many Easy, Medium, and Hard problems you have solved.',
    keywords: 'DSA tracker progress, LeetCode progress, coding interview tracker',
  });

  if (!currentUser) {
    return <div className="p-8 text-center text-slate-400 h-screen flex justify-center items-center">Authentication required.</div>;
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
