import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  HealthResponse,
  StatsResponse,
  ResearchResults,
  ResearchStatus,
  CommandsResponse,
  BestPracticesResponse,
  OperationsResponse,
  CommandFilters,
  BestPracticeFilters,
  ResearchFilters,
  Repository,
  Command,
  BestPractice,
  Operation,
} from '@/types/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('Response Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  }

  // Health Check
  async getHealth(): Promise<HealthResponse> {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Statistics
  async getStats(): Promise<StatsResponse> {
    const response = await this.client.get('/stats');
    return response.data;
  }

  // Research Operations
  async getResearchResults(filters?: ResearchFilters): Promise<ResearchResults> {
    const params = new URLSearchParams();
    if (filters?.min_score !== undefined) params.append('min_score', filters.min_score.toString());
    if (filters?.max_score !== undefined) params.append('max_score', filters.max_score.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.technology) params.append('technology', filters.technology);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await this.client.get(`/research/results?${params.toString()}`);
    return response.data;
  }

  async getResearchStatus(): Promise<ResearchStatus> {
    const response = await this.client.get('/research/status');
    return response.data;
  }

  async startResearch(): Promise<{ message: string }> {
    const response = await this.client.post('/research/start');
    return response.data;
  }

  async stopResearch(): Promise<{ message: string }> {
    const response = await this.client.post('/research/stop');
    return response.data;
  }

  // Command Management
  async getCommands(filters?: CommandFilters): Promise<CommandsResponse> {
    const params = new URLSearchParams();
    if (filters?.repo) params.append('repo', filters.repo);
    if (filters?.author) params.append('author', filters.author);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await this.client.get(`/colby/commands?${params.toString()}`);
    return response.data;
  }

  async getCommand(id: string): Promise<Command> {
    const response = await this.client.get(`/colby/commands/${id}`);
    return response.data;
  }

  async executeCommand(command: string, repository: string): Promise<{ message: string; command_id: string }> {
    const response = await this.client.post('/colby/execute', {
      command,
      repository,
    });
    return response.data;
  }

  // Best Practices
  async getBestPractices(filters?: BestPracticeFilters): Promise<BestPracticesResponse> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.technology) params.append('technology', filters.technology);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await this.client.get(`/colby/best-practices?${params.toString()}`);
    return response.data;
  }

  async getBestPractice(id: string): Promise<BestPractice> {
    const response = await this.client.get(`/colby/best-practices/${id}`);
    return response.data;
  }

  async updateBestPracticeStatus(id: string, status: 'approved' | 'rejected'): Promise<{ message: string }> {
    const response = await this.client.patch(`/colby/best-practices/${id}/status`, { status });
    return response.data;
  }

  // Operations Monitoring
  async getOperations(): Promise<OperationsResponse> {
    const response = await this.client.get('/operations');
    return response.data;
  }

  async getOperation(id: string): Promise<Operation> {
    const response = await this.client.get(`/operations/${id}`);
    return response.data;
  }

  async cancelOperation(id: string): Promise<{ message: string }> {
    const response = await this.client.post(`/operations/${id}/cancel`);
    return response.data;
  }

  // Repository Details
  async getRepository(id: string): Promise<Repository> {
    const response = await this.client.get(`/repositories/${id}`);
    return response.data;
  }

  async getRepositoryAnalysis(id: string): Promise<{ analysis: string; details: any }> {
    const response = await this.client.get(`/repositories/${id}/analysis`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
