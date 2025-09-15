// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Health Check
export interface HealthResponse {
  ok: boolean;
}

// Statistics
export interface StatsResponse {
  projects: number;
  commands: number;
  practices: number;
  analyses: number;
  operations: number;
  repositories: number;
}

// Repository Types
export interface Repository {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  score: number;
  category: string;
  technology_stack: string[];
  ai_summary?: string;
  last_analyzed: string;
  created_at: string;
  updated_at: string;
}

export interface ResearchResults {
  total_projects: number;
  results: Repository[];
}

export interface ResearchStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  current_operation: string;
  started_at?: string;
  completed_at?: string;
}

// Command Types
export interface Command {
  id: string;
  repository: string;
  author: string;
  command: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  result?: string;
  error?: string;
  execution_time?: number;
}

export interface CommandFilters {
  repo?: string;
  author?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface CommandsResponse {
  commands: Command[];
  total: number;
  page: number;
  limit: number;
}

// Best Practices Types
export interface BestPractice {
  id: string;
  title: string;
  description: string;
  category: string;
  technology: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  examples?: string[];
  implementation_guide?: string;
  tags: string[];
}

export interface BestPracticesResponse {
  practices: BestPractice[];
  total: number;
  page: number;
  limit: number;
}

export interface BestPracticeFilters {
  category?: string;
  status?: string;
  technology?: string;
  limit?: number;
  offset?: number;
}

// Operations Types
export interface Operation {
  id: string;
  type: 'research' | 'analysis' | 'command' | 'cleanup';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  started_at: string;
  completed_at?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface OperationsResponse {
  operations: Operation[];
  total: number;
}

// Research Filters
export interface ResearchFilters {
  min_score?: number;
  max_score?: number;
  category?: string;
  technology?: string;
  limit?: number;
  offset?: number;
}

// Error Types
export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
}
