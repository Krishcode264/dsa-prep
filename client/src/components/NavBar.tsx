import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export default function NavBar() {
  const { state: { currentUser, isGuest }, dispatch } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('dsa_user');
    localStorage.removeItem('dsa_is_guest');
    dispatch({ type: 'CLEAR_USER' });
    setMobileMenuOpen(false);
    navigate('/');
  };

  const activeClass = "bg-[color:var(--text-main)] text-[color:var(--surface)]";
  const inactiveClass = "hover:bg-[color:var(--surface-hover)] transition-colors";

  return (
    <nav className="relative z-50 border-b-4 md:border-b-8 border-[color:var(--border-main)] bg-[color:var(--surface)] shrink-0">
      <div className="h-16 md:h-20 flex items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* Left Side: Logo & Desktop Links */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 border-2 md:border-4 border-[color:var(--border-main)] flex items-center justify-center bg-[color:var(--surface-active)] transition-transform duration-200 group-hover:rotate-6 will-change-transform origin-center isolate">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-[color:var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <span className="text-sm md:text-xl font-black uppercase tracking-tighter text-[color:var(--text-main)]">DSA PREP.</span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 ml-4">
            <Link 
              to="/questions" 
              className={`text-xs font-black uppercase tracking-widest px-3.5 py-1.5 border-2 border-[color:var(--border-main)] brutalist-no-radius transition-all ${location.pathname === '/questions' ? activeClass : inactiveClass}`}
            >
              Explore
            </Link>

            <Link 
              to="/companies" 
              className={`text-xs font-black uppercase tracking-widest px-3.5 py-1.5 border-2 border-[color:var(--border-main)] brutalist-no-radius transition-all ${location.pathname.startsWith('/companies') ? activeClass : inactiveClass}`}
            >
              Companies
            </Link>
            
            {(currentUser || isGuest) && (
              <Link 
                to="/profile" 
                className={`text-xs font-black uppercase tracking-widest px-3.5 py-1.5 border-2 border-[color:var(--border-main)] brutalist-no-radius transition-all ${location.pathname === '/profile' ? activeClass : inactiveClass}`}
              >
                Progress
              </Link>
            )}
          </div>
        </div>

        {/* Right Side: Desktop User Actions */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
          <a 
            href="https://buymeacoffee.com/krish264" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-[#FFDD00] border-2 border-[color:var(--border-main)] transition-transform hover:scale-110 active:scale-95 shadow-[3px_3px_0px_0px_var(--border-main)] overflow-hidden shrink-0"
            title="Buy me a coffee"
          >
            <svg className="w-6 h-6 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="none">
              <path d="M17 10h-1V9a1 1 0 00-1-1H5a1 1 0 00-1 1v9a2 2 0 002 2h9a2 2 0 002-2v-1h1a3 3 0 003-3v-2a3 3 0 00-3-3zm1 5a1 1 0 01-1 1h-1v-3h1a1 1 0 011 1v2z" fill="#111111"/>
              <path d="M5 10h10v2H5z" fill="#4B3621"/>
              <path d="M7 6c0-1 1-1 1-2S7 3 7 2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 6c0-1 1-1 1-2s-1-1-1-2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 6c0-1 1-1 1-2s-1-1-1-2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4 19h11v1H4z" fill="#111111"/>
            </svg>
          </a>

          {!currentUser && !isGuest ? (
            <Link 
              to="/auth" 
              className="text-xs font-black uppercase tracking-widest px-4 py-2 bg-[color:var(--text-main)] text-[color:var(--surface)] brutalist-no-radius border-2 border-[color:var(--border-main)] hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_var(--border-main)] active:shadow-none active:translate-x-0 active:translate-y-0"
            >
              Access
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="bg-[color:var(--surface-active)] border-2 border-[color:var(--border-main)] px-3 py-1 text-xs font-black uppercase tracking-widest">
                {currentUser ? `@${currentUser.username}` : 'GUEST'}
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-widest border-2 border-[color:var(--border-main)] px-3.5 py-2 hover:bg-black hover:text-white transition-colors brutalist-no-radius"
              >
                Exit
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden gap-2">
          <a 
            href="https://buymeacoffee.com/krish264" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FFDD00] border-2 border-[color:var(--border-main)] overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_var(--border-main)]"
            title="Buy me a coffee"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M17 10h-1V9a1 1 0 00-1-1H5a1 1 0 00-1 1v9a2 2 0 002 2h9a2 2 0 002-2v-1h1a3 3 0 003-3v-2a3 3 0 00-3-3zm1 5a1 1 0 01-1 1h-1v-3h1a1 1 0 011 1v2z" fill="#111111"/>
              <path d="M5 10h10v2H5z" fill="#4B3621"/>
              <path d="M7 6c0-1 1-1 1-2S7 3 7 2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 6c0-1 1-1 1-2s-1-1-1-2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 6c0-1 1-1 1-2s-1-1-1-2" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4 19h11v1H4z" fill="#111111"/>
            </svg>
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 border-2 border-[color:var(--border-main)] bg-[color:var(--surface-active)] flex items-center justify-center font-black shadow-[3px_3px_0px_0px_var(--border-main)] active:translate-x-0.5 active:translate-y-0.5 transition-all brutalist-no-radius"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-[color:var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-[color:var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-4 border-[color:var(--border-main)] bg-[color:var(--surface)] p-4 flex flex-col gap-3 shadow-[0px_10px_20px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-2 duration-150">
          <Link 
            to="/questions" 
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-center py-3 text-sm font-black uppercase tracking-widest border-2 border-[color:var(--border-main)] brutalist-no-radius shadow-[3px_3px_0px_0px_var(--border-main)] ${location.pathname === '/questions' ? activeClass : inactiveClass}`}
          >
            Explore Questions
          </Link>

          <Link 
            to="/companies" 
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-center py-3 text-sm font-black uppercase tracking-widest border-2 border-[color:var(--border-main)] brutalist-no-radius shadow-[3px_3px_0px_0px_var(--border-main)] ${location.pathname.startsWith('/companies') ? activeClass : inactiveClass}`}
          >
            All Companies
          </Link>
          
          {(currentUser || isGuest) && (
            <Link 
              to="/profile" 
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-center py-3 text-sm font-black uppercase tracking-widest border-2 border-[color:var(--border-main)] brutalist-no-radius shadow-[3px_3px_0px_0px_var(--border-main)] ${location.pathname === '/profile' ? activeClass : inactiveClass}`}
            >
              My Progress
            </Link>
          )}

          <div className="border-t-2 border-[color:var(--border-main)] pt-3 mt-1 flex flex-col gap-3">
            {!currentUser && !isGuest ? (
              <Link 
                to="/auth" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-black uppercase tracking-widest bg-[color:var(--text-main)] text-[color:var(--surface)] brutalist-no-radius border-2 border-[color:var(--border-main)] shadow-[4px_4px_0px_0px_var(--border-main)]"
              >
                Access Account
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="w-full text-center bg-[color:var(--surface-active)] border-2 border-[color:var(--border-main)] py-2 text-xs font-black uppercase tracking-widest">
                  Signed in as {currentUser ? `@${currentUser.username}` : 'GUEST'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 text-xs font-black uppercase tracking-widest border-2 border-[color:var(--border-main)] bg-rose-500 text-white shadow-[3px_3px_0px_0px_var(--border-main)] brutalist-no-radius"
                >
                  Exit Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
