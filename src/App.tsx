import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Conditionally import ReactQueryDevtools only in development
const ReactQueryDevtools = process.env.NODE_ENV === 'development' 
  ? require('@tanstack/react-query-devtools').ReactQueryDevtools 
  : null;

import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Research from '@/pages/Research';
import Commands from '@/pages/Commands';
import BestPractices from '@/pages/BestPractices';
import Operations from '@/pages/Operations';
import RepositoryDetail from '@/pages/RepositoryDetail';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/research" element={<Research />} />
              <Route path="/commands" element={<Commands />} />
              <Route path="/best-practices" element={<BestPractices />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/repository/:id" element={<RepositoryDetail />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
