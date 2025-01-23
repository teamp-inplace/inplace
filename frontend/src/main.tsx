import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import * as Sentry from '@sentry/react';
import { queryClient } from './api/instance/index.js';

import App from './App';

async function startApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.js');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: true,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    /^https:\/\/a7b2c3d4-dev\.inplace\.my/, // 개발 서버 도메인
    /^https:\/\/api\.inplace\.my/, // 배포 서버 도메인
    '!http://localhost', // localhost는 제외
    '!https://localhost',
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
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
