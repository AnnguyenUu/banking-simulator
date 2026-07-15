import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it } from 'vitest';
import { installMockBackend } from '@api/mock/mockBackend';
import { InsightsPage } from './index';

describe('InsightsPage', () => {
  beforeEach(() => {
    installMockBackend();
  });

  it('renders each insights chart once data loads', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <InsightsPage />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Spending by Category')).toBeInTheDocument();
    expect(screen.getByText('Spending Trend')).toBeInTheDocument();
    expect(screen.getByText('Top Merchants')).toBeInTheDocument();
    expect(screen.getByText('Income vs Expenses by Month')).toBeInTheDocument();
  });
});
