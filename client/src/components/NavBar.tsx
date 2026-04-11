import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export default function NavBar() {
  const { state: { currentUser }, dispatch } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('dsa_user');
    dispatch({ type: 'CLEAR_USER' });
    navigate('/');
  };

  const activeClass = "bg-[color:var(--text-main)] text-[color:var(--surface)]";
  const inactiveClass = "hover:bg-[color:var(--surface-hover)] p-2 transition-colors";

  return (
    <nav className="h-16 md:h-20 border-b-4 md:border-b-8 border-[color:var(--border-main)] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-[color:var(--surface)] shrink-0 z-50">
      <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 border-2 md:border-4 border-[color:var(--border-main)] flex items-center justify-center bg-[color:var(--surface-active)] transition-transform group-hover:rotate-6">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-[color:var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          </div>
          <span className="text-sm md:text-xl font-black uppercase tracking-tighter text-[color:var(--text-main)]">DSA PREP.</span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-4 md:gap-6 ml-2 md:ml-4">
          <Link 
            to="/questions" 
            className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 border-2 border-[color:var(--border-main)] brutalist-no-radius transition-all ${location.pathname === '/questions' ? activeClass : inactiveClass}`}
          >
            Explore
          </Link>
          
          {currentUser && (
            <Link 
              to="/profile" 
              className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 border-2 border-[color:var(--border-main)] brutalist-no-radius transition-all ${location.pathname === '/profile' ? activeClass : inactiveClass}`}
            >
              Progress
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        {!currentUser ? (
          <Link 
            to="/auth" 
            className="text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-1.5 md:py-2 bg-[color:var(--text-main)] text-[color:var(--surface)] brutalist-no-radius border-2 border-[color:var(--border-main)] hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_var(--border-main)] active:shadow-none active:translate-x-0 active:translate-y-0"
          >
            Access
          </Link>
        ) : (
          <div className="flex items-center gap-2 md:gap-6">
            <span className="hidden sm:inline bg-[color:var(--surface-active)] border-2 border-[color:var(--border-main)] px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              @{currentUser.username}
            </span>
            <button 
              onClick={handleLogout}
              className="text-[10px] md:text-xs font-black uppercase tracking-widest border-2 border-[color:var(--border-main)] px-3 py-1.5 md:py-2 hover:bg-black hover:text-white transition-colors brutalist-no-radius"
            >
              Exit
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
