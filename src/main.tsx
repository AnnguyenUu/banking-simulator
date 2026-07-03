import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { installMockBackend } from './api/mock/mockBackend';
import 'antd/dist/reset.css';
import './index.css';

if (!import.meta.env.VITE_API_BASE_URL) {
  installMockBackend();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
