import { useParams, Link } from 'react-router-dom';
import { useRepository, useRepositoryAnalysis } from '@/hooks/useApi';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  GitBranch, 
  Calendar, 
  Code, 
  Shield,
  Zap,
  Tag,
  Activity
} from 'lucide-react';
import { formatDate, formatScore, getScoreColor } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function RepositoryDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: repository, isLoading, error } = useRepository(id || '');
  const { data: analysis, isLoading: analysisLoading } = useRepositoryAnalysis(id || '');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        </div>
        <div className="card p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">Repository not found</div>
        <div className="text-gray-500 mt-2">The requested repository could not be loaded</div>
        <Link to="/research" className="btn btn-primary btn-md mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Research
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <Link to="/research" className="btn btn-outline btn-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {repository.name}
          </h1>
          
          <p className="text-lg text-gray-600 mb-4">
            {repository.full_name}
          </p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className={cn(
                "text-lg font-semibold",
                getScoreColor(repository.score)
              )}>
                {formatScore(repository.score)}
              </span>
            </div>
            
            <span className="badge badge-info text-sm">
              {repository.category}
            </span>
            
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Repository Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {repository.description && (
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600">{repository.description}</p>
            </div>
          )}

          {/* AI Summary */}
          {repository.ai_summary && (
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                AI Analysis Summary
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {repository.ai_summary}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Analysis */}
          {analysis && (
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-500" />
                Detailed Analysis
              </h2>
              {analysisLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {analysis.analysis}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Technology Stack */}
          {repository.technology_stack && repository.technology_stack.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-green-500" />
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {repository.technology_stack.map((tech) => (
                  <span key={tech} className="badge badge-gray">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Repository Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Repository Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Score</dt>
                <dd className={cn(
                  "text-lg font-semibold",
                  getScoreColor(repository.score)
                )}>
                  {formatScore(repository.score)}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="text-sm text-gray-900">{repository.category}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Analyzed</dt>
                <dd className="text-sm text-gray-900">{formatDate(repository.last_analyzed)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDate(repository.created_at)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated</dt>
                <dd className="text-sm text-gray-900">{formatDate(repository.updated_at)}</dd>
              </div>
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn btn-primary btn-md w-full">
                <Code className="h-4 w-4 mr-2" />
                Analyze Repository
              </button>
              
              <button className="btn btn-outline btn-md w-full">
                <Shield className="h-4 w-4 mr-2" />
                Security Scan
              </button>
              
              <button className="btn btn-outline btn-md w-full">
                <Activity className="h-4 w-4 mr-2" />
                View Commands
              </button>
            </div>
          </div>

          {/* Analysis Details */}
          {analysis?.details && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Details</h3>
              <div className="space-y-3">
                {Object.entries(analysis.details).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
