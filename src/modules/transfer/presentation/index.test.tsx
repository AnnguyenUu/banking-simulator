import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it } from 'vitest';
import { installMockBackend } from '@api/mock/mockBackend';
import { TransferPage } from './index';

describe('TransferPage', () => {
  beforeEach(() => {
    installMockBackend();
  });

  it('transfers funds between accounts and reports the new balances', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TransferPage />
      </QueryClientProvider>,
    );

    await user.click(await screen.findByLabelText('From account'));
    await user.click(await screen.findByText(/Everyday Checking/));

    await user.click(screen.getByLabelText('To account'));
    const toOptions = await screen.findAllByText(/High-Yield Savings/);
    await user.click(toOptions[toOptions.length - 1]);

    await user.type(screen.getByRole('spinbutton'), '100');
    await user.click(screen.getByRole('button', { name: 'Transfer' }));

    expect(await screen.findByText('Transfer complete')).toBeInTheDocument();
    expect(screen.getByText(/new balance: \$4,131\.55/)).toBeInTheDocument();
    expect(screen.getByText(/new balance: \$18,442\.10/)).toBeInTheDocument();
  });
});
