import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005';

interface SyncResult {
  synced: number;
  total_fetched: number;
  total_solved_on_lc: number;
  username: string;
  message: string;
}

interface LeetCodeSyncProps {
  userId: number;
}

export default function LeetCodeSync({ userId }: LeetCodeSyncProps) {
  const queryClient = useQueryClient();
  const [cookie, setCookie] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSync = async () => {
    const cleanCookie = cookie.trim();
    if (!cleanCookie) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/sync/leetcode-cookie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionCookie: cleanCookie, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed. Please try again.');
      }

      setResult(data);
      setCookie(''); // clear for security after successful sync

      // Invalidate profile stats so UI updates live
      queryClient.invalidateQueries({ queryKey: ['stats', userId] });
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['solvedIds', userId] });

    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[color:var(--surface)] border-2 border-[color:var(--border-main)] border-b-8 brutalist-no-radius shadow-[4px_4px_0px_0px_var(--border-main)] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[color:var(--border-main)] bg-[color:var(--surface-active)]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#FFA116] flex items-center justify-center shrink-0 border border-[color:var(--border-main)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
              <path d="M16.102 17.93l-2.697 2.607c-.466.466-1.057.699-1.648.699s-1.182-.233-1.648-.699l-5.48-5.488c-.91-.912-.912-2.369 0-3.282l5.48-5.488c.466-.466 1.057-.699 1.648-.699s1.182.233 1.648.699l2.697 2.607 1.502-1.529-2.697-2.607c-.895-.895-2.073-1.337-3.152-1.337s-2.257.443-3.15 1.337L5.02 9.835c-1.734 1.729-1.734 4.539 0 6.269l5.481 5.486c.894.894 2.072 1.337 3.151 1.337s2.257-.443 3.15-1.337l2.697-2.607-1.397-1.053z"/>
              <path d="M17.59 7.502l-5.48 5.488 1.396 1.052 5.48-5.487c.912-.912.912-2.37 0-3.282L13.5 0l-1.396 1.052 5.486 5.167c.465.467.465 1.217 0 1.283z"/>
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[color:var(--text-main)]">Sync from LeetCode</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--text-muted)]">Full history — all solved questions</p>
          </div>
        </div>
        <button
          onClick={() => setShowInstructions(v => !v)}
          className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-[color:var(--border-main)] hover:bg-[color:var(--surface-hover)] transition-colors brutalist-no-radius"
        >
          {showInstructions ? 'Hide' : 'How?'}
        </button>
      </div>

      {/* Step-by-step instructions (collapsible) */}
      {showInstructions && (
        <div className="px-5 py-4 bg-[color:var(--primary)] border-b-2 border-[color:var(--border-main)]">
          <p className="text-[11px] font-black uppercase tracking-widest mb-3 text-[color:var(--text-main)]">How to get your session cookie:</p>
          <ol className="space-y-2">
            {[
              'Go to leetcode.com and log in',
              'Press F12 to open DevTools',
              'Click the "Application" tab',
              'In the left sidebar → Cookies → https://leetcode.com',
              'Find "LEETCODE_SESSION" and copy its Value',
              'Paste it below and click Sync',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 bg-[color:var(--text-main)] text-[color:var(--surface)] text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[11px] font-bold text-[color:var(--text-muted)] normal-case tracking-normal">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 border border-[color:var(--border-main)] p-2 bg-[color:var(--surface)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)] mb-1">🔒 Privacy note</p>
            <p className="text-[10px] font-bold text-[color:var(--text-muted)] normal-case tracking-normal">
              Your cookie is sent directly to LeetCode via our local server and is never stored. It's cleared from this field after syncing.
            </p>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-5 py-4">
        <textarea
          value={cookie}
          onChange={e => setCookie(e.target.value)}
          placeholder="Paste your LEETCODE_SESSION cookie value here..."
          disabled={loading}
          rows={3}
          className="w-full bg-[color:var(--primary)] border-2 border-[color:var(--border-main)] px-3 py-2.5 text-[11px] font-mono text-[color:var(--text-main)] placeholder:text-[color:var(--text-muted)] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-[color:var(--text-main)] brutalist-no-radius transition-colors disabled:opacity-50 resize-none"
        />

        <div className="flex items-center justify-between mt-3 gap-3">
          <p className="text-[10px] font-bold text-[color:var(--text-muted)] uppercase tracking-wider">
            ⚡ Syncs all your LC accepted submissions at once
          </p>
          <button
            onClick={handleSync}
            disabled={loading || !cookie.trim()}
            className="px-5 py-2 bg-[color:var(--text-main)] text-[color:var(--surface)] border-2 border-[color:var(--border-main)] font-black text-[10px] uppercase tracking-widest brutalist-no-radius transition-all hover:translate-x-0.5 hover:-translate-y-0.5 shadow-[3px_3px_0px_0px_var(--border-main)] active:shadow-none active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Syncing all...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Full Sync
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success result */}
      {result && (
        <div className={`mx-5 mb-4 border-2 p-3 brutalist-no-radius ${
          result.synced > 0
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
        }`}>
          <div className="flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">{result.synced > 0 ? '✅' : '⚠️'}</span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[color:var(--text-main)]">
                {result.synced > 0
                  ? `${result.synced} Question${result.synced !== 1 ? 's' : ''} Synced!`
                  : 'No New Questions'}
              </p>
              <p className="text-[10px] font-bold text-[color:var(--text-muted)] mt-0.5 normal-case tracking-normal">
                {result.message}
              </p>
              {result.username && result.total_solved_on_lc > 0 && (
                <p className="text-[10px] font-bold text-[color:var(--text-muted)] mt-1 normal-case tracking-normal">
                  @{result.username} has solved{' '}
                  <span className="font-black text-[color:var(--text-main)]">{result.total_solved_on_lc}</span>{' '}
                  total problems on LeetCode.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mx-5 mb-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 p-3 brutalist-no-radius">
          <div className="flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">❌</span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-red-700 dark:text-red-400">Sync Failed</p>
              <p className="text-[10px] font-bold text-red-600 dark:text-red-300 mt-0.5 normal-case tracking-normal">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
