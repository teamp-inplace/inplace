import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import * as Sentry from '@sentry/react';

import { QueryCache, QueryClient } from '@tanstack/react-query';
import getCurrentConfig from '../config';

const initInstance = (config: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    timeout: 20000,
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });
  axios.defaults.withCredentials = true;
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.response) {
        const requestUrl = error.config?.url || 'URL 정보 없음';
        Sentry.withScope((scope) => {
          scope.setLevel('error');
          scope.setTag('error type', 'Network Error');
          Sentry.captureMessage(`[Network Error] ${requestUrl} \n${error.message ?? `네트워크 오류`}`);
        });
        return Promise.reject(error);
      }

      // 예기치 못한 4~500번대 오류 로깅
      if (error.response.status >= 400 && ![401, 403, 409].includes(error.response.status)) {
        const isServerError = error.response.status >= 500;
        const errorType = isServerError ? 'Server Error' : 'Api Error';
        Sentry.withScope((scope) => {
          scope.setLevel('error');
          scope.setTag('error type', errorType);
          Sentry.captureMessage(`[${errorType}] ${error.config.url} \n${error.message}`);
        });
      }

      return Promise.reject(error);
    },
  );
  return instance;
};

export const BASE_URL = getCurrentConfig().baseURL;
export const fetchInstance = initInstance({
  baseURL: BASE_URL,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      throwOnError: true,
    },
    mutations: {
      onError: (error) => {
        Sentry.captureException(error, {
          tags: {
            type: 'mutation_error',
          },
        });
      },
      throwOnError: true,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      Sentry.captureException(error);
    },
  }),
});
