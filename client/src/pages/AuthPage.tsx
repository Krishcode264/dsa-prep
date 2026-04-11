import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authLogin, authSignup, syncProgress } from '../api/client';
import { useUserStore } from '../store/userStore';
import { useQueryClient } from '@tanstack/react-query';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state: { currentUser }, dispatch } = useUserStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, go to home or redirect
  useEffect(() => {
    if (currentUser) {
      const redirect = searchParams.get('redirect') || '/questions';
      navigate(redirect, { replace: true });
    }
  }, [currentUser, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let user;
      if (isLogin) {
        user = await authLogin({ email: formData.email, password: formData.password });
      } else {
        user = await authSignup(formData);
      }
      
      // SYNC LOGIC: If guest data exists, sync it to the new user account
      const guestData = localStorage.getItem('dsa_guest_progress');
      if (guestData) {
        try {
          const questionIds = JSON.parse(guestData);
          if (questionIds.length > 0) {
            await syncProgress(user.id, questionIds);
          }
          localStorage.removeItem('dsa_guest_progress');
          localStorage.removeItem('dsa_is_guest');
        } catch (syncErr) {
          console.error('Failed to sync guest data:', syncErr);
        }
      }

      localStorage.setItem('dsa_user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      
      // Invalidate queries to fetch fresh synced data
      queryClient.invalidateQueries({ queryKey: ['solved-ids', user.id] });
      queryClient.invalidateQueries({ queryKey: ['stats', user.id] });
      queryClient.invalidateQueries({ queryKey: ['progress', user.id] });
      
      const redirect = searchParams.get('redirect') || '/questions';
      navigate(redirect, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    localStorage.setItem('dsa_is_guest', 'true');
    dispatch({ type: 'SET_GUEST' });
    const redirect = searchParams.get('redirect') || '/questions';
    navigate(redirect, { replace: true });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-[color:var(--primary)] min-h-0 overflow-y-auto custom-scrollbar">
      <div className="bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] border-b-8 brutalist-no-radius w-full max-w-md overflow-hidden text-[color:var(--text-main)] relative shadow-[8px_8px_0px_0px_var(--border-main)]">
        <div className="px-6 py-10 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 border-2 border-[color:var(--border-main)] flex items-center justify-center bg-[color:var(--surface-active)] transform -rotate-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">DSA PREP.</h2>
          </div>

          <h3 className="text-lg font-bold uppercase mb-6 tracking-widest border-b-2 border-dashed border-[color:var(--border-subtle)] pb-2 inline-block">
            {isLogin ? 'Access Record' : 'Create Record'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-[color:var(--text-muted)] mb-2 uppercase tracking-widest">Handle</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. dev_ninja"
                  className="w-full px-4 py-3 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] focus:bg-[color:var(--surface-hover)] outline-none transition-all text-[color:var(--text-main)] font-bold text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-[color:var(--text-muted)] mb-2 uppercase tracking-widest">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="developer@domain.com"
                className="w-full px-4 py-3 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] focus:bg-[color:var(--surface-hover)] outline-none transition-all text-[color:var(--text-main)] font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-[color:var(--text-muted)] mb-2 uppercase tracking-widest">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] focus:bg-[color:var(--surface-hover)] outline-none transition-all text-[color:var(--text-main)] font-bold text-sm"
              />
            </div>
            
            {error && <div className="p-3 bg-red-50 border-2 border-red-600 font-bold uppercase text-[10px] text-red-600">{error}</div>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[color:var(--text-main)] text-[color:var(--surface)] font-black py-4 px-4 brutalist-no-radius transition-all flex justify-center items-center gap-2 border-2 border-[color:var(--border-main)] hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_0px_var(--border-main)] active:shadow-none active:translate-x-0 active:translate-y-0 disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? 'Processing...' : (isLogin ? 'Grant Access' : 'Create Record')}
              {!loading && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="mt-8 w-full text-center text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] transition-colors underline underline-offset-4 decoration-2"
          >
            {isLogin ? "Need a record? Sign up" : 'Have a record? Log in'}
          </button>

          <div className="mt-10 pt-8 border-t-2 border-dashed border-[color:var(--border-subtle)]">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-muted)] mb-4">Or stay off-grid</p>
            <button
              onClick={handleGuestMode}
              className="w-full bg-[color:var(--surface)] text-[color:var(--text-main)] font-black py-4 px-4 brutalist-no-radius transition-all flex justify-center items-center gap-2 border-2 border-[color:var(--border-main)] hover:bg-[color:var(--surface-hover)] border-b-4 active:border-b-2 active:translate-y-0.5 uppercase tracking-widest text-xs"
            >
              Continue as Guest
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
            <p className="mt-4 text-center text-[9px] font-medium text-[color:var(--text-muted)] leading-relaxed">
              Progress will be stored in your browser's local storage.<br/>
              Syncing is available when you create a record later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
