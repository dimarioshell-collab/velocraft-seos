import { renderToString } from 'react-dom/server';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

/** Рендер главной страницы в HTML-строку (используется scripts/prerender.mjs при сборке). */
export function render() {
  return renderToString(
    <ErrorBoundary>
      <App ssrPath="/" />
    </ErrorBoundary>,
  );
}
