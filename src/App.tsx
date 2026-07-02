import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ErrorBoundary } from '@components/molecules/ErrorBoundary';
import { router } from './routes/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ 
        token: { colorPrimary: '#1d39c4' },
        components: {
          Typography: {
            titleMarginBottom: 0
          },
        },
        }}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
