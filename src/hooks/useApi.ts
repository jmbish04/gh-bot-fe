import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import {
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

// Query Keys
export const queryKeys = {
  health: ['health'] as const,
  stats: ['stats'] as const,
  researchResults: (filters?: ResearchFilters) => ['research', 'results', filters] as const,
  researchStatus: ['research', 'status'] as const,
  commands: (filters?: CommandFilters) => ['commands', filters] as const,
  command: (id: string) => ['commands', id] as const,
  bestPractices: (filters?: BestPracticeFilters) => ['best-practices', filters] as const,
  bestPractice: (id: string) => ['best-practices', id] as const,
  operations: ['operations'] as const,
  operation: (id: string) => ['operations', id] as const,
  repository: (id: string) => ['repositories', id] as const,
};

// Health Check
export const useHealth = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiService.getHealth(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
};

// Statistics
export const useStats = () => {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => apiService.getStats(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
};

// Research Operations
export const useResearchResults = (filters?: ResearchFilters) => {
  return useQuery({
    queryKey: queryKeys.researchResults(filters),
    queryFn: () => apiService.getResearchResults(filters),
    staleTime: 60000, // 1 minute
  });
};

export const useResearchStatus = () => {
  return useQuery({
    queryKey: queryKeys.researchStatus,
    queryFn: () => apiService.getResearchStatus(),
    staleTime: 10000, // 10 seconds
    refetchInterval: 5000, // 5 seconds
  });
};

export const useStartResearch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiService.startResearch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.researchStatus });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });
};

export const useStopResearch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiService.stopResearch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.researchStatus });
    },
  });
};

// Command Management
export const useCommands = (filters?: CommandFilters) => {
  return useQuery({
    queryKey: queryKeys.commands(filters),
    queryFn: () => apiService.getCommands(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useCommand = (id: string) => {
  return useQuery({
    queryKey: queryKeys.command(id),
    queryFn: () => apiService.getCommand(id),
    enabled: !!id,
  });
};

export const useExecuteCommand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ command, repository }: { command: string; repository: string }) =>
      apiService.executeCommand(command, repository),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commands'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });
};

// Best Practices
export const useBestPractices = (filters?: BestPracticeFilters) => {
  return useQuery({
    queryKey: queryKeys.bestPractices(filters),
    queryFn: () => apiService.getBestPractices(filters),
    staleTime: 60000, // 1 minute
  });
};

export const useBestPractice = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bestPractice(id),
    queryFn: () => apiService.getBestPractice(id),
    enabled: !!id,
  });
};

export const useUpdateBestPracticeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      apiService.updateBestPracticeStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bestPractice(id) });
      queryClient.invalidateQueries({ queryKey: ['best-practices'] });
    },
  });
};

// Operations Monitoring
export const useOperations = () => {
  return useQuery({
    queryKey: queryKeys.operations,
    queryFn: () => apiService.getOperations(),
    staleTime: 10000, // 10 seconds
    refetchInterval: 5000, // 5 seconds
  });
};

export const useOperation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.operation(id),
    queryFn: () => apiService.getOperation(id),
    enabled: !!id,
  });
};

export const useCancelOperation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.cancelOperation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.operations });
    },
  });
};

// Repository Details
export const useRepository = (id: string) => {
  return useQuery({
    queryKey: queryKeys.repository(id),
    queryFn: () => apiService.getRepository(id),
    enabled: !!id,
  });
};

export const useRepositoryAnalysis = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.repository(id), 'analysis'],
    queryFn: () => apiService.getRepositoryAnalysis(id),
    enabled: !!id,
  });
};
