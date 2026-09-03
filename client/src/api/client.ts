import type {
  User,
  Company,
  QuestionFilters,
  QuestionsResponse,
  ProgressSummary,
  StatsPayload,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Failed to fetch ${url}`);
  }
  return response.json();
}

/**
 * Fetches paginated questions based on various filters.
 */
export async function fetchQuestions(page: number, limit: number, filters: QuestionFilters): Promise<QuestionsResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (filters.difficulty && filters.difficulty !== 'ALL') params.append('difficulty', filters.difficulty);
  if (filters.search) params.append('search', filters.search);
  if (filters.topicMatch) params.append('topicMatch', filters.topicMatch);
  
  if (filters.companies) {
    filters.companies.forEach(c => params.append('company', c));
  }
  if (filters.topics) {
    filters.topics.forEach(t => params.append('topic', t));
  }
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.userId) params.append('userId', filters.userId.toString());

  return request<QuestionsResponse>(`/api/questions?${params.toString()}`);
}

export async function fetchCompanies(userId?: number): Promise<Company[]> {
  const url = userId ? `/api/companies?userId=${userId}` : '/api/companies';
  const res = await request<{ data: Company[] }>(url);
  return res.data;
}

export async function fetchCompanyByName(companyName: string, userId?: number): Promise<Company> {
  const url = userId ? `/api/companies/${encodeURIComponent(companyName)}?userId=${userId}` : `/api/companies/${encodeURIComponent(companyName)}`;
  const res = await request<{ data: Company }>(url);
  return res.data;
}

export async function fetchTopics(): Promise<string[]> {
  const res = await request<{ data: string[] }>('/api/topics');
  return res.data;
}

export async function fetchProgress(userId: number): Promise<ProgressSummary> {
  return request<ProgressSummary>(`/api/progress/${userId}`);
}

export async function fetchSolvedIds(userId: number): Promise<number[]> {
  const res = await request<{ solved_ids: number[] }>(`/api/progress/${userId}/all`);
  return res.solved_ids;
}

export async function toggleSolved(userId: number, questionId: number, solved: boolean): Promise<void> {
  await request<{ success: boolean }>(`/api/progress/${userId}/${questionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ solved }),
  });
}

export async function createOrGetUser(username: string): Promise<User> {
  return request<User>('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
}

export async function fetchStats(userId: number): Promise<StatsPayload> {
  return request<StatsPayload>(`/api/stats/${userId}`);
}

export async function authLogin(data: any): Promise<User> {
  return request<User>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function authSignup(data: any): Promise<User> {
  return request<User>('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function syncProgress(userId: number, questionIds: number[]): Promise<{ synced: number }> {
  return request<{ synced: number }>(`/api/progress/${userId}/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionIds }),
  });
}
