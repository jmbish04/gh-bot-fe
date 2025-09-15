import { useState } from 'react';
import { useBestPractices, useUpdateBestPracticeStatus } from '@/hooks/useApi';
import { 
  BookOpen, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Tag,
  ChevronDown,
  ChevronUp,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { formatDate, getStatusColor } from '@/utils/format';
import { cn } from '@/utils/cn';
import { BestPracticeFilters } from '@/types/api';
import toast from 'react-hot-toast';

export default function BestPractices() {
  const [filters, setFilters] = useState<BestPracticeFilters>({
    limit: 50,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);

  const { data: practicesData, isLoading, error } = useBestPractices(filters);
  const updateStatus = useUpdateBestPracticeStatus();

  const handleFilterChange = (key: keyof BestPracticeFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Practice ${status} successfully`);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${status} practice`);
    }
  };

  const clearFilters = () => {
    setFilters({ limit: 50 });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Failed to load best practices</div>
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
            Best Practices
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and review code best practices discovered by Colby
          </p>
        </div>
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
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
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
            {practicesData && `Showing ${practicesData.practices.length} of ${practicesData.total} practices`}
          </div>
          <button
            onClick={clearFilters}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Practices List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : practicesData?.practices.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No practices found</h3>
            <p className="text-gray-500">Try adjusting your filters or wait for new practices to be discovered</p>
          </div>
        ) : (
          practicesData?.practices.map((practice) => (
            <div key={practice.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(practice.status)}
                    <h3 className="text-lg font-medium text-gray-900">
                      {practice.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {practice.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="badge badge-info">{practice.category}</span>
                    <span className="badge badge-gray">{practice.technology}</span>
                    <span>Created: {formatDate(practice.created_at)}</span>
                    {practice.updated_at !== practice.created_at && (
                      <span>Updated: {formatDate(practice.updated_at)}</span>
                    )}
                  </div>

                  {practice.tags && practice.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {practice.tags.map((tag) => (
                        <span key={tag} className="badge badge-gray text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {practice.examples && practice.examples.length > 0 && (
                    <div className="mb-3">
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                          View Examples
                        </summary>
                        <div className="mt-2 space-y-2">
                          {practice.examples.map((example, index) => (
                            <div key={index} className="p-3 bg-gray-100 rounded-md">
                              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                                {example}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}

                  {practice.implementation_guide && (
                    <div className="mb-3">
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                          Implementation Guide
                        </summary>
                        <div className="mt-2 p-3 bg-gray-100 rounded-md">
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {practice.implementation_guide}
                          </p>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "badge",
                      practice.status === 'approved' ? 'badge-success' :
                      practice.status === 'rejected' ? 'badge-error' : 'badge-warning'
                    )}>
                      {practice.status}
                    </span>
                  </div>
                </div>
              </div>

              {practice.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(practice.id, 'approved')}
                      disabled={updateStatus.isPending}
                      className="btn btn-primary btn-sm"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(practice.id, 'rejected')}
                      disabled={updateStatus.isPending}
                      className="btn btn-outline btn-sm"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
