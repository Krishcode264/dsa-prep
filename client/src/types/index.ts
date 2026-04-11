export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Company {
  id: number;
  name: string;
}

export interface QuestionCompany {
  name: string;
  frequency: number;
}

export interface Question {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  acceptance_rate: number;
  link: string;
  topics: string[];
  companies: QuestionCompany[];
}

export interface QuestionsResponse {
  data: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface QuestionFilters {
  companies: string[];
  topics: string[];
  difficulty?: string;
  search?: string;
  topicMatch?: 'ANY' | 'ALL';
  page?: number;
  limit?: number;
}

export interface ProgressSummary {
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  recent_solved: {
    title: string;
    difficulty: string;
    link: string;
    solved_at: string;
  }[];
}

export interface CompanyStat {
  name: string;
  total_questions: number;
  solved_questions: number;
}

export interface StatsPayload {
  global: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  user: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  companies: CompanyStat[];
}
