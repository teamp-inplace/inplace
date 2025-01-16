import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getRefreshToken } from '@/api/hooks/useGetRefreshToken';
import { useDeleteToken } from '@/api/hooks/useDeleteToken';

type AuthInfo = {
  isAuthenticated: boolean;
  handleLoginSuccess: (userNickname: string) => Promise<void>;
  handleLogout: () => void;
};

export const AuthContext = createContext<AuthInfo | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const ACCESS_TOKEN_REFRESH_INTERVAL = 3 * 60 * 1000;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('isAuthenticated') === 'true',
  );
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { mutate: logout } = useDeleteToken();

  const handleLogout = useCallback(() => {
    logout();
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('nickname');
  }, [logout]);

  const refreshTokenRegularly = useCallback(async () => {
    try {
      await getRefreshToken();
      setTimeout(refreshTokenRegularly, ACCESS_TOKEN_REFRESH_INTERVAL);
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleLogout();
    }
  }, [handleLogout]);

  const handleLoginSuccess = useCallback(
    async (userNickname: string) => {
      if (!isAuthenticated) {
        console.log('[AuthProvider] Setting login success for:', userNickname);
        localStorage.setItem('nickname', userNickname);
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        setTimeout(() => refreshTokenRegularly(), ACCESS_TOKEN_REFRESH_INTERVAL);
      }
    },
    [isAuthenticated, refreshTokenRegularly],
  );

  useEffect(() => {
    const initialize = async () => {
      const savedAuthStatus = localStorage.getItem('isAuthenticated') === 'true';
      if (savedAuthStatus) {
        try {
          await refreshTokenRegularly();
        } catch (error) {
          console.error('Failed to refresh token during initialization:', error);
          handleLogout();
        }
      }
      setIsInitialized(true);
    };

    initialize();
  }, [refreshTokenRegularly, handleLogout]);

  const value = useMemo(
    () => (isInitialized ? { isAuthenticated, handleLoginSuccess, handleLogout } : undefined),
    [isInitialized, isAuthenticated, handleLoginSuccess, handleLogout],
  );

  return <AuthContext.Provider value={value}>{isInitialized && children}</AuthContext.Provider>;
}
