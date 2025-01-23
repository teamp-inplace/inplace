import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import styled from 'styled-components';
import * as Sentry from '@sentry/react';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import Footer from '@/components/common/layouts/Footer';
import Header from '@/components/common/layouts/Header';
import Loading from '@/components/common/layouts/Loading';
import Error from '@/components/common/layouts/Error';
import MainSkeleton from '@/components/Main/MainSkeleton';
import DetailSkeleton from '@/components/Detail/DetailSkeleton';
import useScrollToTop from '@/hooks/useScrollToTop';

export default function MainLayout() {
  const location = useLocation();
  const renderSkeleton = () => {
    if (location.pathname === '/') {
      return <MainSkeleton />;
    }
    if (location.pathname.startsWith('/detail')) {
      return <DetailSkeleton />;
    }
    return <Loading size={50} />;
  };
  useScrollToTop();
  return (
    <Wrapper>
      <Header />
      <InnerWrapper>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <Sentry.ErrorBoundary fallback={<Error resetErrorBoundary={reset} />}>
              <Suspense fallback={renderSkeleton()}>
                <Outlet />
              </Suspense>
            </Sentry.ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </InnerWrapper>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 960px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  width: 100%;
  margin-bottom: 40px;
`;
