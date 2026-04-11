import { useQuery } from '@tanstack/react-query';
import { fetchStats, fetchProgress } from '../api/client';
import type { StatsPayload, ProgressSummary } from '../types';

export function useStats(userId: number | undefined) {
  return useQuery<StatsPayload>({
    queryKey: ['stats', userId],
    queryFn: () => fetchStats(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,  // 2 min — changes when questions are toggled
    gcTime: 10 * 60 * 1000,
  });
}

export function useProgress(userId: number | undefined) {
  return useQuery<ProgressSummary>({
    queryKey: ['progress', userId],
    queryFn: () => fetchProgress(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
