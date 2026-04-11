import { useQuery } from '@tanstack/react-query';
import { fetchCompanies, fetchTopics } from '../api/client';

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    staleTime: 30 * 60 * 1000,   // Companies rarely change — 30 min
    gcTime: 60 * 60 * 1000,
  });
}

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
