import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/react';
import { getSentryInitialized, setSentryInitialized } from './sentry';

export const initSentryWithRetry = async (retryCount = 0, maxRetries = 3): Promise<boolean> => {
  try {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [browserTracingIntegration()],
      tracesSampleRate: 1.0,
      tracePropagationTargets: [/^https:\/\/api\.inplace\.my/, '!http://localhost/', '!https://localhost/'],
      beforeSend: (event) => {
        if (getSentryInitialized()) {
          return event;
        }
        return null;
      },
    });

    setSentryInitialized(true);
    return true;
  } catch (error) {
    if (retryCount < maxRetries) {
      console.warn(`Sentry initialization failed, retrying... (${retryCount + 1}/${maxRetries})`);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      return initSentryWithRetry(retryCount + 1, maxRetries);
    }
    console.error('Failed to initialize Sentry after maximum retries', error);
    return false;
  }
};
export default initSentryWithRetry;
