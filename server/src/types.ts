export interface Company {
  id: number;
  name: string;
  created_at: Date;
}

export interface Question {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  acceptance_rate: number;
  link: string;
  topics: string[];
  created_at: Date;
}

export interface QuestionCompany {
  id: number;
  question_id: number;
  company_id: number;
  frequency: number;
}

export interface User {
  id: number;
  username: string;
  created_at: Date;
}

export interface UserProgress {
  id: number;
  user_id: number;
  question_id: number;
  solved: boolean;
  solved_at: Date | null;
}

export interface QuestionWithCompanies extends Question {
  companies: { name: string; frequency: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
