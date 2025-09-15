import { useState } from 'react';
import { useOperations, useCancelOperation } from '@/hooks/useApi';
import { 
  Activity, 
  Play, 
  Square, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { formatDate, formatRelativeTime, formatDuration, getStatusColor } from '@/utils/format';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

export default function Operations() {
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);

  const { data: operationsData, isLoading, error } = useOperations();
  const cancelOperation = useCancelOperation();

  const handleCancelOperation = async (id: string) => {
    try {
      await cancelOperation.mutateAsync(id);
      toast.success('Operation cancelled successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel operation');
    }
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
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getOperationTypeColor = (type: string) => {
    switch (type) {
      case 'research':
        return 'bg-blue-100 text-blue-800';
      case 'analysis':
        return 'bg-purple-100 text-purple-800';
      case 'command':
        return 'bg-green-100 text-green-800';
      case 'cleanup':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Failed to load operations</div>
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
            Operations Monitoring
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage active operations and background tasks
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Operations Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Operations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {operationsData?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
              <Loader className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Running</p>
              <p className="text-2xl font-semibold text-gray-900">
                {operationsData?.operations.filter(op => op.status === 'running').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {operationsData?.operations.filter(op => op.status === 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {operationsData?.operations.filter(op => op.status === 'failed').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Operations List */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Operations</h3>
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
        ) : operationsData?.operations.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No operations found</h3>
            <p className="text-gray-500">Operations will appear here when they are created</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {operationsData?.operations.map((operation) => (
              <div key={operation.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(operation.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)} Operation
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {operation.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className={cn("badge", getOperationTypeColor(operation.type))}>
                        {operation.type}
                      </span>
                      <span>Started: {formatRelativeTime(operation.started_at)}</span>
                      {operation.completed_at && (
                        <span>Completed: {formatRelativeTime(operation.completed_at)}</span>
                      )}
                    </div>

                    {operation.status === 'running' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{operation.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${operation.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {operation.error && (
                      <div className="mb-3">
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-red-700 hover:text-red-900">
                            View Error Details
                          </summary>
                          <div className="mt-2 p-3 bg-red-50 rounded-md">
                            <pre className="text-sm text-red-600 whitespace-pre-wrap">
                              {operation.error}
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}

                    {operation.metadata && Object.keys(operation.metadata).length > 0 && (
                      <div className="mb-3">
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                            View Metadata
                          </summary>
                          <div className="mt-2 p-3 bg-gray-100 rounded-md">
                            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                              {JSON.stringify(operation.metadata, null, 2)}
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "badge",
                        operation.status === 'completed' ? 'badge-success' :
                        operation.status === 'running' ? 'badge-warning' :
                        operation.status === 'failed' ? 'badge-error' : 'badge-gray'
                      )}>
                        {operation.status}
                      </span>
                      
                      {operation.status === 'running' && (
                        <button
                          onClick={() => handleCancelOperation(operation.id)}
                          disabled={cancelOperation.isPending}
                          className="btn btn-outline btn-sm"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      )}
                    </div>
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
