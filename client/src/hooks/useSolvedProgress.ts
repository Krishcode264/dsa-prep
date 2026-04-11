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
  const { state: { currentUser } } = useUserStore();

  const { data } = useQuery({
    queryKey: ['solved-ids', currentUser?.id],
    queryFn: () => fetchSolvedIds(currentUser!.id),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return useMemo(() => new Set(data ?? []), [data]);
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
  const { state: { currentUser } } = useUserStore();
  const queryClient = useQueryClient();
  const inflightRef = useRef(new Set<number>());

  const mutation = useMutation({
    mutationFn: async ({ questionId, solved }: { questionId: number; solved: boolean }) => {
      if (!currentUser) throw new Error('No user');
      await toggleSolved(currentUser.id, questionId, solved);
    },
    onMutate: async ({ questionId, solved }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['solved-ids', currentUser?.id] });

      // Snapshot the previous cache for rollback
      const previousIds = queryClient.getQueryData<number[]>(['solved-ids', currentUser?.id]);

      // Optimistically update the query cache
      queryClient.setQueryData<number[]>(['solved-ids', currentUser?.id], (old) => {
        if (!old) return solved ? [questionId] : [];
        if (solved) return [...old, questionId];
        return old.filter(id => id !== questionId);
      });

      inflightRef.current.add(questionId);
      return { previousIds };
    },
    onError: (_err, _vars, context) => {
      // Rollback: restore cache to snapshot
      if (context?.previousIds !== undefined) {
        queryClient.setQueryData(['solved-ids', currentUser?.id], context.previousIds);
      }
    },
    onSettled: (_data, _err, vars) => {
      inflightRef.current.delete(vars.questionId);
      // Invalidate stats/progress so profile page refreshes
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  const handleToggle = useCallback((questionId: number, currentSolved: boolean) => {
    // Guard: skip if this question already has an in-flight request
    if (inflightRef.current.has(questionId)) return;
    mutation.mutate({ questionId, solved: !currentSolved });
  }, [mutation]);

  return handleToggle;
}
