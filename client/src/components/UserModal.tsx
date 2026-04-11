import { useState } from 'react';
import { authLogin, authSignup } from '../api/client';
import { useUserStore } from '../store/userStore';

export default function UserModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { dispatch } = useUserStore();

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
      
      localStorage.setItem('dsa_user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[color:var(--surface)] z-[100] flex items-center justify-center p-3 sm:p-4 antialiased overflow-y-auto">
      <div className="bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] border-b-8 brutalist-no-radius w-full max-w-md overflow-hidden text-[color:var(--text-main)] relative">
        


        <div className="px-5 sm:px-8 py-8 sm:py-10 relative">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 border-2 border-[color:var(--border-main)] flex items-center justify-center bg-[color:var(--surface-active)] transform -rotate-3">
              <svg className="w-6 h-6 text-[color:var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight leading-none">DSA Prep.</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-[color:var(--text-muted)] mb-2 uppercase tracking-widest">
                  Developer Handle
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. hackerman"
                  className="w-full px-4 py-3 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] focus:bg-[color:var(--surface-hover)] outline-none transition-all text-[color:var(--text-main)] placeholder-[color:var(--text-muted)] font-bold text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-[color:var(--text-muted)] mb-2 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] focus:bg-[color:var(--surface-hover)] outline-none transition-all text-[color:var(--text-main)] placeholder-[color:var(--text-muted)] font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-[color:var(--text-muted)] mb-2 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] focus:bg-[color:var(--surface-hover)] outline-none transition-all text-[color:var(--text-main)] placeholder-[color:var(--text-muted)] font-bold text-sm"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-[color:var(--surface-active)] border-2 border-[color:var(--border-main)] flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <p className="text-[10px] font-bold uppercase text-red-600 leading-tight">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[color:var(--text-main)] text-[color:var(--surface)] font-black py-4 px-4 brutalist-no-radius transition-all flex justify-center items-center gap-2 border-2 border-[color:var(--border-main)] hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_0px_var(--border-main)] active:shadow-none active:translate-x-0 active:translate-y-0 disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  {isLogin ? 'Grant Access' : 'Create Record'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </>
              )}
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="mt-8 w-full text-center text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] transition-colors underline underline-offset-4 decoration-2"
          >
            {isLogin ? "Don't have a record? Create one" : 'Already have a record? Access here'}
          </button>
        </div>
      </div>
    </div>
  );
}
