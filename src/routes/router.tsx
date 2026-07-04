import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@components/organisms/AppLayout/AppLayout";
import { RouteErrorFallback } from "@components/molecules/ErrorBoundary/RouteErrorFallback";
import { OverviewPage } from "@pages/OverviewPage";
import { TransactionsPage } from "@pages/TransactionsPage";
import { TransferPage } from "@pages/TransferPage";
import { InsightsPage } from "@pages/InsightsPage";
import ProtectedRoute from "@components/organisms/ProtectedRoute";
import { PERMISSIONS } from "@context/permissions";

export const router = createBrowserRouter([
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
