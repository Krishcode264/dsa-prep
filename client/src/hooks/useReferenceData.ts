import { useQuery } from '@tanstack/react-query';
import { fetchCompanies, fetchCompanyByName, fetchTopics } from '../api/client';

export function useCompanies(userId?: number) {
  return useQuery({
    queryKey: ['companies', userId],
    queryFn: () => fetchCompanies(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCompanyDetail(companyName: string, userId?: number) {
  return useQuery({
    queryKey: ['company', companyName, userId],
    queryFn: () => fetchCompanyByName(companyName, userId),
    enabled: !!companyName,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
