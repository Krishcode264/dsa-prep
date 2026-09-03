import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FilterState {
  companies: string[];
  topics: string[];
  topicMatch: 'ALL' | 'ANY';
  difficulty?: string;
  search?: string;
  status: 'all' | 'solved' | 'unsolved';
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      companies: searchParams.getAll('company'),
      topics: searchParams.getAll('topic'),
      topicMatch: (searchParams.get('topicMatch') as 'ALL' | 'ANY') || 'ANY',
      difficulty: searchParams.get('difficulty') || undefined,
      search: searchParams.get('search') || undefined,
      status: (searchParams.get('status') as 'all' | 'solved' | 'unsolved') || 'all',
    };
  });

  useEffect(() => {
    const params = new URLSearchParams();
    filters.companies.forEach(c => params.append('company', c));
    filters.topics.forEach(t => params.append('topic', t));
    if (filters.topicMatch !== 'ANY') params.set('topicMatch', filters.topicMatch);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.search) params.set('search', filters.search);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const toggleCompany = (company: string) => {
    setFilters(prev => ({
      ...prev,
      companies: prev.companies.includes(company) 
        ? prev.companies.filter(c => c !== company)
        : [...prev.companies, company]
    }));
  };

  const toggleTopic = (topic: string) => {
    setFilters(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const clearAll = () => {
    setFilters({
      companies: [],
      topics: [],
      topicMatch: 'ANY',
      difficulty: undefined,
      search: undefined,
      status: 'all',
    });
  };

  const memoFilters = useMemo(() => filters, [
    filters.companies, 
    filters.topics, 
    filters.difficulty, 
    filters.search, 
    filters.topicMatch,
    filters.status,
  ]);

  return { filters: memoFilters, updateFilters, toggleCompany, toggleTopic, clearAll };
}
