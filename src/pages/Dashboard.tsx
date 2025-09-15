import { useStats, useResearchStatus, useStartResearch, useStopResearch } from '@/hooks/useApi';
import { useAppStore } from '@/store/useAppStore';
import { 
  BarChart3, 
  Search, 
  Terminal, 
  BookOpen, 
  Activity, 
  Play, 
  Square,
  RefreshCw
} from 'lucide-react';
import { formatNumber, getStatusColor } from '@/utils/format';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useStats();
  const { data: researchStatus, isLoading: statusLoading } = useResearchStatus();
  const startResearch = useStartResearch();
  const stopResearch = useStopResearch();
  const { setError } = useAppStore();

  const handleStartResearch = async () => {
    try {
      await startResearch.mutateAsync();
      toast.success('Research started successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to start research');
      setError(error.message);
    }
  };

  const handleStopResearch = async () => {
    try {
      await stopResearch.mutateAsync();
      toast.success('Research stopped successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to stop research');
      setError(error.message);
    }
  };

  const statCards = [
    {
      name: 'Total Projects',
      value: stats?.projects || 0,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Commands Executed',
      value: stats?.commands || 0,
      icon: Terminal,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Best Practices',
      value: stats?.practices || 0,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Repositories',
      value: stats?.repositories || 0,
      icon: Search,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      name: 'Analyses',
      value: stats?.analyses || 0,
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Operations',
      value: stats?.operations || 0,
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  if (statsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Failed to load dashboard data</div>
        <div className="text-gray-500 mt-2">Please try refreshing the page</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your GitHub Bot operations and research activities
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline btn-sm mr-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Research Status */}
      {researchStatus && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Research Status</h3>
              <p className="text-sm text-gray-500">
                Current research operation status and progress
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={cn(
                "badge",
                researchStatus.status === 'running' ? 'badge-warning' : 
                researchStatus.status === 'completed' ? 'badge-success' : 'badge-gray'
              )}>
                {researchStatus.status}
              </span>
              {researchStatus.status === 'running' ? (
                <button
                  onClick={handleStopResearch}
                  disabled={stopResearch.isPending}
                  className="btn btn-outline btn-sm"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={handleStartResearch}
                  disabled={startResearch.isPending}
                  className="btn btn-primary btn-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Research
                </button>
              )}
            </div>
          </div>
          
          {researchStatus.status === 'running' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{researchStatus.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${researchStatus.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {researchStatus.current_operation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.name} className="card p-6">
            <div className="flex items-center">
              <div className={cn("flex-shrink-0 p-3 rounded-md", card.bgColor)}>
                <card.icon className={cn("h-6 w-6", card.color)} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    formatNumber(card.value)
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="btn btn-outline btn-md">
            <Search className="h-5 w-5 mr-2" />
            Browse Repositories
          </button>
          <button className="btn btn-outline btn-md">
            <Terminal className="h-5 w-5 mr-2" />
            View Commands
          </button>
          <button className="btn btn-outline btn-md">
            <BookOpen className="h-5 w-5 mr-2" />
            Manage Practices
          </button>
          <button className="btn btn-outline btn-md">
            <Activity className="h-5 w-5 mr-2" />
            Monitor Operations
          </button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-500">
          <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Recent activity will appear here</p>
          <p className="text-sm">Commands, research results, and operations will be displayed in real-time</p>
        </div>
      </div>
    </div>
  );
}
