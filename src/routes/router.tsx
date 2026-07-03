import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@components/organisms/layout/AppLayout';
import { RouteErrorFallback } from '@components/molecules/ErrorBoundary/RouteErrorFallback';
import { OverviewPage } from '@pages/OverviewPage';
import { TransactionsPage } from '@pages/TransactionsPage';
import { TransferPage } from '@pages/TransferPage';
import { InsightsPage } from '@pages/InsightsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    ErrorBoundary: RouteErrorFallback,
    children: [
      { index: true, element: <OverviewPage />},
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'transfer', element: <TransferPage /> },
      { path: 'insights', element: <InsightsPage /> },
    ],
  },
]);
