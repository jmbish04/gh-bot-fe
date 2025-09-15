import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { StatsResponse, ResearchStatus } from '@/types/api';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;

  // Data State
  stats: StatsResponse | null;
  researchStatus: ResearchStatus | null;
  lastUpdated: string | null;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStats: (stats: StatsResponse) => void;
  setResearchStatus: (status: ResearchStatus) => void;
  setLastUpdated: (timestamp: string) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sidebarOpen: false,
      theme: 'light',
      loading: false,
      error: null,
      stats: null,
      researchStatus: null,
      lastUpdated: null,

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setStats: (stats) => set({ stats, lastUpdated: new Date().toISOString() }),
      setResearchStatus: (status) => set({ researchStatus: status }),
      setLastUpdated: (timestamp) => set({ lastUpdated: timestamp }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-store',
    }
  )
);
