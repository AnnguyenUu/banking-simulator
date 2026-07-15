import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@components/organisms/AppLayout/AppLayout";
import { RouteErrorFallback } from "@components/molecules/ErrorBoundary/RouteErrorFallback";
import { OverviewPage } from "@modules/overview/presentation";
import { TransactionsPage } from "@modules/transactions/presentation";
import { TransferPage } from "@modules/transfer/presentation";
import { InsightsPage } from "@modules/insights/presentation";
import { LoginPage } from "@modules/auth/presentation";
import ProtectedRoute from "@components/organisms/ProtectedRoute";
import { PERMISSIONS } from "@context/permissions";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    ErrorBoundary: RouteErrorFallback,
  },
  {
    path: "/",
    element: <AppLayout />,
    ErrorBoundary: RouteErrorFallback,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute permission={PERMISSIONS.OVERVIEW_VIEW}>
            <OverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "transactions",
        element: (
          <ProtectedRoute permission={PERMISSIONS.TRANSACTIONS_VIEW}>
            <TransactionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "transfer",
        element: (
          <ProtectedRoute permission={PERMISSIONS.TRANSFER_VIEW}>
            <TransferPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "insights",
        element: (
          <ProtectedRoute permission={PERMISSIONS.INSIGHTS_VIEW}>
            <InsightsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
