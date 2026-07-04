import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { installMockBackend } from '@api/mock/mockBackend';
import { TransactionsPage } from './index';

describe('TransactionsPage', () => {
  beforeEach(() => {
    installMockBackend();
    window.sessionStorage.clear();
  });

  const renderPage = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransactionsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('renders transactions once data loads', async () => {
    renderPage();

    expect(await screen.findByText('Whole Foods Market')).toBeInTheDocument();
    expect(screen.getByText('Salary Payment')).toBeInTheDocument();
    expect(screen.getByText('Amazon Purchase')).toBeInTheDocument();
  });

  it('filters by search term', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Whole Foods Market');

    const search = screen.getByPlaceholderText('Search description or category');
    await user.type(search, 'Whole Foods');

    await waitFor(
      () => {
        expect(screen.getByText('Whole Foods Market')).toBeInTheDocument();
        expect(screen.queryByText('Salary Payment')).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  }, 10000);

  it('filters by selected account', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Whole Foods Market');

    await user.click(screen.getByRole('combobox'));
    const options = await screen.findAllByText('Everyday Checking');
    await user.click(options[options.length - 1]);

    await waitFor(() => {
      expect(screen.getByText('Salary Payment')).toBeInTheDocument();
      expect(screen.getByText('Electric Bill')).toBeInTheDocument();
      expect(screen.queryByText('Interest Payment')).not.toBeInTheDocument();
      expect(screen.queryByText('Amazon Purchase')).not.toBeInTheDocument();
    });
  });
});
