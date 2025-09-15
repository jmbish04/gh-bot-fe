import { useState } from 'react';
import { useCommands, useExecuteCommand } from '@/hooks/useApi';
import { 
  Terminal, 
  Play, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDate, formatRelativeTime, formatDuration, getStatusColor } from '@/utils/format';
import { cn } from '@/utils/cn';
import { CommandFilters } from '@/types/api';
import toast from 'react-hot-toast';

export default function Commands() {
  const [filters, setFilters] = useState<CommandFilters>({
    limit: 50,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [repositoryInput, setRepositoryInput] = useState('');

  const { data: commandsData, isLoading, error } = useCommands(filters);
  const executeCommand = useExecuteCommand();

  const handleFilterChange = (key: keyof CommandFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExecuteCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || !repositoryInput.trim()) {
      toast.error('Please enter both command and repository');
      return;
    }

    try {
      await executeCommand.mutateAsync({
        command: commandInput.trim(),
        repository: repositoryInput.trim(),
      });
      toast.success('Command executed successfully');
      setCommandInput('');
      setRepositoryInput('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to execute command');
    }
  };

  const clearFilters = () => {
    setFilters({ limit: 50 });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running':
        return <Loader className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Failed to load commands</div>
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
            Command Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Execute and monitor Colby commands across your repositories
          </p>
        </div>
      </div>

      {/* Execute Command Form */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Execute New Command</h3>
        <form onSubmit={handleExecuteCommand} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repository
              </label>
              <input
                type="text"
                value={repositoryInput}
                onChange={(e) => setRepositoryInput(e.target.value)}
                className="input"
                placeholder="owner/repository"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Command
              </label>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="input"
                placeholder="colby analyze security"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={executeCommand.isPending}
              className="btn btn-primary btn-md"
            >
              {executeCommand.isPending ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Execute Command
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline btn-sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
            {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repository
              </label>
              <input
                type="text"
                value={filters.repo || ''}
                onChange={(e) => handleFilterChange('repo', e.target.value || undefined)}
                className="input"
                placeholder="owner/repository"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                value={filters.author || ''}
                onChange={(e) => handleFilterChange('author', e.target.value || undefined)}
                className="input"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limit
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={filters.limit || 50}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="input"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {commandsData && `Showing ${commandsData.commands.length} of ${commandsData.total} commands`}
          </div>
          <button
            onClick={clearFilters}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Commands List */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Command History</h3>
        </div>
        
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : commandsData?.commands.length === 0 ? (
          <div className="text-center py-12">
            <Terminal className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No commands found</h3>
            <p className="text-gray-500">Execute a command above to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {commandsData?.commands.map((command) => (
              <div key={command.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(command.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {command.command}
                        </p>
                        <p className="text-sm text-gray-500">
                          {command.repository} • {command.author}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {formatRelativeTime(command.created_at)}</span>
                      {command.started_at && (
                        <span>Started: {formatRelativeTime(command.started_at)}</span>
                      )}
                      {command.completed_at && (
                        <span>Completed: {formatRelativeTime(command.completed_at)}</span>
                      )}
                      {command.execution_time && (
                        <span>Duration: {formatDuration(command.execution_time)}</span>
                      )}
                    </div>

                    {command.result && (
                      <div className="mt-3">
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                            View Result
                          </summary>
                          <div className="mt-2 p-3 bg-gray-100 rounded-md">
                            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                              {command.result}
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}

                    {command.error && (
                      <div className="mt-3">
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-red-700 hover:text-red-900">
                            View Error
                          </summary>
                          <div className="mt-2 p-3 bg-red-50 rounded-md">
                            <pre className="text-sm text-red-600 whitespace-pre-wrap">
                              {command.error}
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <span className={cn(
                      "badge",
                      command.status === 'completed' ? 'badge-success' :
                      command.status === 'running' ? 'badge-warning' :
                      command.status === 'failed' ? 'badge-error' : 'badge-gray'
                    )}>
                      {command.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
