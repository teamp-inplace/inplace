import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/instance/index.js';

import App from './App';
import { setSentryInitialized } from './libs/Sentry/sentry.js';
import initSentryWithRetry from './libs/Sentry/initSentryWithRetry.js';

async function startApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.js');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  if (import.meta.env.PROD) {
    const initialized = await initSentryWithRetry();
    setSentryInitialized(initialized);
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
}
startApp();
