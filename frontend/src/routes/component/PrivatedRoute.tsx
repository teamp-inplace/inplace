import { ReactElement, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import LoginModal from '@/components/common/modals/LoginModal';
import { useGetUserInfo } from '@/api/hooks/useGetUserInfo';

type PrivateRouteProps = {
  children: ReactElement;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const { isAuthenticated, handleLoginSuccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const directRedirectPaths = ['/choice', '/auth'];
  const isProtectedPath = directRedirectPaths.includes(location.pathname);

  const { data: userInfo, isLoading, isError } = useGetUserInfo();

  useEffect(() => {
    const referer = document.referrer;
    const isDirectAccess = !referer || referer.includes(window.location.origin) === false;

    if (location.pathname === '/choice') {
      if (isDirectAccess) {
        navigate('/', { replace: true });
        return;
      }
    }

    if (isError) {
      console.error('[PrivateRoute] Failed to fetch user info.');
      navigate('/', { replace: true });
      return;
    }

    if (isProtectedPath && !isAuthenticated && !isLoading && !userInfo?.nickname) {
      navigate('/', { replace: true });
    }

    if (!isLoading) {
      setIsAccessChecked(true);
    }
  }, [isProtectedPath, isAuthenticated, userInfo, isLoading, isError, navigate]);

  const handleCloseModal = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleModalSuccess = async () => {
    setShouldShowModal(false);
    if (userInfo?.nickname) {
      await handleLoginSuccess(userInfo.nickname);
    }
  };

  useEffect(() => {
    if (userInfo?.nickname && !isAuthenticated) {
      handleLoginSuccess(userInfo.nickname);
    }
  }, [userInfo, isAuthenticated, handleLoginSuccess]);

  if (isLoading || !isAccessChecked) return null;

  if (shouldShowModal && !isAuthenticated) {
    return (
      <LoginModal
        currentPath={location.pathname}
        immediateOpen
        onClose={handleCloseModal}
        onLoginSuccess={handleModalSuccess}
      />
    );
  }
  if (userInfo?.nickname || isAuthenticated) {
    return children;
  }

  return null;
}
