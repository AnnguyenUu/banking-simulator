import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { installMockBackend } from '@api/mock/mockBackend';
import { LoginPage } from './index';

describe('LoginPage', () => {
  beforeEach(() => {
    installMockBackend();
  });

  const renderPage = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>HOME</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('navigates home after a successful login', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('you@example.com'), 'jordan.lee@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('HOME')).toBeInTheDocument();
  });

  it('shows an error message on invalid credentials', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('you@example.com'), 'jordan.lee@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
    expect(screen.queryByText('HOME')).not.toBeInTheDocument();
  });
});
