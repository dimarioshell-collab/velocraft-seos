import { createRoot, hydrateRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

const container = document.getElementById('root')!;
const app = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

const options = {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error: unknown, errorInfo: { componentStack?: string }) => {
    console.error(error, errorInfo.componentStack);
  },
};

// Предрендеренный HTML есть только для главной. На остальных путях (404)
// отдаётся тот же index.html, поэтому гидрируем только "/".
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const path = window.location.pathname.slice(base.length).replace(/\/+$/, '') || '/';

if (!__STANDALONE__ && container.hasChildNodes() && path === '/') {
  hydrateRoot(container, app, options);
} else {
  container.textContent = '';
  createRoot(container, options).render(app);
}
