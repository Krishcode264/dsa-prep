import { useQuery } from '@tanstack/react-query';
import { fetchQuestions } from '../api/client';
import type { QuestionFilters } from '../types';

export function useQuestions(page: number, limit: number, filters: QuestionFilters) {
  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ['questions', page, limit, filters],
    queryFn: () => fetchQuestions(page, limit, filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    questions: data?.data ?? [],
    pagination: data?.pagination ?? { total: 0, page, limit },
    loading: isLoading,
    isPlaceholderData,
    error: error as Error | null,
  };
}
