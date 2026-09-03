import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSolvedIds, toggleSolved } from '../api/client';
import { useUserStore } from '../store/userStore';
import { useCallback, useMemo, useRef } from 'react';

/**
 * Read solved question IDs from the React Query cache.
 * Only components calling this hook re-render when solved IDs change.
 * This is the ONLY source of truth for solved state.
 */
export function useSolvedIds(): Set<number> {
  const { state: { currentUser, isGuest } } = useUserStore();

  const { data: serverData } = useQuery({
    queryKey: ['solved-ids', currentUser?.id],
    queryFn: () => fetchSolvedIds(currentUser!.id),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // For Guest mode, we always read from localStorage
  const { data: guestData } = useQuery({
    queryKey: ['guest-solved-ids'],
    queryFn: () => {
      const saved = localStorage.getItem('dsa_guest_progress');
      return saved ? JSON.parse(saved) as number[] : [];
    },
    enabled: isGuest,
  });

  return useMemo(() => {
    if (currentUser) return new Set(serverData ?? []);
    if (isGuest) return new Set(guestData ?? []);
    return new Set<number>();
  }, [currentUser, isGuest, serverData, guestData]);
}

/**
 * Toggle solved state with:
 * - Optimistic query cache updates (instant UI)
 * - Automatic rollback on failure
 * - Rapid-click guard (skips if same question is in-flight)
 * - Invalidates stats/progress after settle
 * 
 * IMPORTANT: This updates the React Query cache, NOT the UserStore context.
 * This means only components subscribed to useSolvedIds() re-render.
 */
export function useToggleSolved() {
  const { state: { currentUser, isGuest } } = useUserStore();
  const queryClient = useQueryClient();
  const inflightRef = useRef(new Set<number>());

  const mutation = useMutation({
    mutationFn: async ({ questionId, solved }: { questionId: number; solved: boolean }) => {
      if (currentUser) {
        await toggleSolved(currentUser.id, questionId, solved);
      } else if (isGuest) {
        // Handle guest mode locally
        const saved = localStorage.getItem('dsa_guest_progress');
        let ids: number[] = saved ? JSON.parse(saved) : [];
        if (solved) {
          if (!ids.includes(questionId)) ids.push(questionId);
        } else {
          ids = ids.filter(id => id !== questionId);
        }
        localStorage.setItem('dsa_guest_progress', JSON.stringify(ids));
      } else {
        throw new Error('No user or guest mode');
      }
    },
    onMutate: async ({ questionId, solved }) => {
      const queryKey = currentUser ? ['solved-ids', currentUser.id] : ['guest-solved-ids'];
      
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous cache for rollback
      const previousIds = queryClient.getQueryData<number[]>(queryKey);

      // Optimistically update the query cache
      queryClient.setQueryData<number[]>(queryKey, (old) => {
        if (!old) return solved ? [questionId] : [];
        if (solved) return [...old, questionId];
        return old.filter(id => id !== questionId);
      });

      inflightRef.current.add(questionId);
      return { previousIds, queryKey };
    },
    onError: (_err, _vars, context) => {
      // Rollback: restore cache to snapshot
      if (context?.previousIds !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousIds);
      }
    },
    onSettled: (_data, _err, vars) => {
      inflightRef.current.delete(vars.questionId);
      // Invalidate stats/progress/companies so profile and company pages refresh automatically
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });

  const handleToggle = useCallback((questionId: number, currentSolved: boolean) => {
    // Guard: skip if this question already has an in-flight request
    if (inflightRef.current.has(questionId)) return;
    mutation.mutate({ questionId, solved: !currentSolved });
  }, [mutation]);

  return handleToggle;
}
