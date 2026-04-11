import { Link } from 'react-router-dom';
import type { ProgressSummary } from '../types';
import { timeAgo } from '../utils/timeAgo';

interface RecentActivityProps {
  activity: ProgressSummary['recent_solved'];
}

export default function RecentActivity({ activity }: RecentActivityProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY': return 'text-[color:var(--text-main)] bg-[color:var(--surface-active)] border-[color:var(--border-main)]';
      case 'MEDIUM': return 'text-[color:var(--text-main)] bg-[color:var(--surface-active)] border-[color:var(--border-main)]';
      case 'HARD': return 'text-[color:var(--text-main)] bg-[color:var(--surface-active)] border-[color:var(--border-main)]';
      default: return 'text-[color:var(--text-muted)] border-transparent';
    }
  };

  return (
    <div className="bg-[color:var(--surface)] border border-[color:var(--border-main)]  brutalist-no-radius flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-[color:var(--border-main)]">
        <h3 className="text-[color:var(--text-muted)] text-[10px] font-extrabold uppercase tracking-widest">Recent Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0 h-0 custom-scrollbar p-2">
        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[color:var(--text-muted)] p-6">
            <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm font-bold uppercase tracking-widest">No activity yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--border-main)]">
            {activity.map((item, idx) => (
              <li key={`${item.link}-${idx}`} className="p-4 bg-[color:var(--surface)] hover:bg-[color:var(--surface-hover)] transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className={`px-2 py-1 text-[10px] font-bold border tracking-wider flex-shrink-0 brutalist-no-radius ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty[0]}
                    </span>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm font-bold text-[color:var(--text-main)] hover:underline decoration-[color:var(--border-main)] underline-offset-4 transition-all text-left truncate"
                    >
                      {item.title}
                    </a>
                  </div>
                  <span className="text-xs text-[color:var(--text-muted)] whitespace-nowrap ml-4 font-mono group-hover:text-[color:var(--text-main)] font-bold transition-colors">
                    {timeAgo(item.solved_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="p-4 border-t border-[color:var(--border-main)] bg-[color:var(--surface-active)] text-center">
        <Link to="/questions" className="text-[10px] uppercase font-bold text-[color:var(--text-main)] hover:underline tracking-widest">
          Browse more questions →
        </Link>
      </div>
    </div>
  );
}
