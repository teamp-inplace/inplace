import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import { browserTracingIntegration } from '@sentry/react';
import { queryClient } from './api/instance/index.js';

import App from './App';

async function startApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.js');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  if (import.meta.env.PROD) {
    import('@sentry/react').then(async (Sentry) => {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [browserTracingIntegration()],
        // Tracing 설정
        tracesSampleRate: 1.0,
        tracePropagationTargets: [/^https:\/\/api\.inplace\.my/, '!http://localhost', '!https://localhost'],
      });
    });
  }
}
startApp().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
});
