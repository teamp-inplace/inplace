import * as Sentry from '@sentry/react';
import { getSentryInitialized } from './sentry';

export const captureErrorWithRetry = async (
  error: unknown,
  options?: {
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
  },
  retryCount = 0,
  maxRetries = 3,
): Promise<boolean> => {
  if (!getSentryInitialized()) {
    return false;
  }

  try {
    if (options?.tags || options?.level) {
      Sentry.withScope((scope) => {
        if (options.tags) {
          Object.entries(options.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        if (options.level) {
          scope.setLevel(options.level);
        }
        if (error instanceof Error) {
          Sentry.captureException(error);
        } else {
          Sentry.captureMessage(String(error));
        }
      });
    } else if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(String(error));
    }
    return true;
  } catch (captureError) {
    if (retryCount < maxRetries) {
      console.warn(`Error capture failed, retrying... (${retryCount + 1}/${maxRetries})`);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      return captureErrorWithRetry(error, options, retryCount + 1, maxRetries);
    }

    console.error('Failed to capture error after maximum retries', {
      originalError: error,
      captureError,
    });
    return false;
  }
};

export default captureErrorWithRetry;
