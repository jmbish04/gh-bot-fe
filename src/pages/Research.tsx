import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResearchResults, useResearchStatus, useStartResearch, useStopResearch } from '@/hooks/useApi';
import { 
  Search, 
  Play, 
  Square, 
  Filter, 
  Star, 
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDate, formatScore, getScoreColor, getStatusColor } from '@/utils/format';
import { cn } from '@/utils/cn';
import { ResearchFilters } from '@/types/api';
import toast from 'react-hot-toast';

export default function Research() {
  const [filters, setFilters] = useState<ResearchFilters>({
    min_score: 0.6,
    limit: 50,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: researchResults, isLoading, error } = useResearchResults(filters);
  const { data: researchStatus } = useResearchStatus();
  const startResearch = useStartResearch();
  const stopResearch = useStopResearch();

  const handleStartResearch = async () => {
    try {
      await startResearch.mutateAsync();
      toast.success('Research started successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to start research');
    }
  };

  const handleStopResearch = async () => {
    try {
      await stopResearch.mutateAsync();
      toast.success('Research stopped successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to stop research');
    }
  };

  const handleFilterChange = (key: keyof ResearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ min_score: 0.6, limit: 50 });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Failed to load research data</div>
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
            Research & Analysis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Discover and analyze GitHub repositories with AI-powered insights
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          {researchStatus?.status === 'running' ? (
            <button
              onClick={handleStopResearch}
              disabled={stopResearch.isPending}
              className="btn btn-outline btn-sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Research
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

      {/* Research Status */}
      {researchStatus && researchStatus.status === 'running' && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Research in Progress</h3>
              <p className="text-sm text-gray-500">{researchStatus.current_operation}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="badge badge-warning">Running</span>
              <div className="text-sm text-gray-600">{researchStatus.progress}%</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${researchStatus.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

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
                Min Score
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={filters.min_score || 0}
                onChange={(e) => handleFilterChange('min_score', parseFloat(e.target.value))}
                className="input"
                placeholder="0.6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Score
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={filters.max_score || ''}
                onChange={(e) => handleFilterChange('max_score', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="input"
                placeholder="1.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="input"
                placeholder="e.g., security"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technology
              </label>
              <input
                type="text"
                value={filters.technology || ''}
                onChange={(e) => handleFilterChange('technology', e.target.value || undefined)}
                className="input"
                placeholder="e.g., react"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {researchResults && `Showing ${researchResults.results.length} of ${researchResults.total_projects} repositories`}
          </div>
          <button
            onClick={clearFilters}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : researchResults?.results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No repositories found</h3>
            <p className="text-gray-500">Try adjusting your filters or start a new research operation</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {researchResults?.results.map((repo) => (
              <div key={repo.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {repo.full_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className={cn(
                      "text-sm font-medium",
                      getScoreColor(repo.score)
                    )}>
                      {formatScore(repo.score)}
                    </span>
                    <Star className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>

                {repo.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="badge badge-info">{repo.category}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(repo.last_analyzed)}
                    </span>
                  </div>
                  
                  {repo.technology_stack && repo.technology_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {repo.technology_stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="badge badge-gray text-xs">
                          {tech}
                        </span>
                      ))}
                      {repo.technology_stack.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{repo.technology_stack.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {repo.ai_summary && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {repo.ai_summary}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Link
                    to={`/repository/${repo.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
