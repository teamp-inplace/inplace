import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import AuthProvider from '@/provider/Auth';
import MainLayout from '@/components/common/layouts/MainLayout';
import PrivatedRoute from '@/routes/component/PrivatedRoute';

import GlobalStyle from './global';
import MainPage from './pages/Main';

const AuthPage = lazy(() => import('@/pages/Auth'));
const DetailPage = lazy(() => import('@/pages/Detail'));
const InfluencerPage = lazy(() => import('@/pages/Influencer'));
const MapPage = lazy(() => import('@/pages/Map'));
const MyPage = lazy(() => import('@/pages/My'));
const ChoicePage = lazy(() => import('@/pages/Choice'));
const SearchPage = lazy(() => import('@/pages/Search'));
const ReviewPage = lazy(() => import('@/pages/Review'));
const InfluencerInfoPage = lazy(() => import('@/pages/InfluencerInfo'));

function App() {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index path="/" element={<MainPage />} />
            <Route path="/influencer" element={<InfluencerPage />} />
            <Route path="/influencer/:id" element={<InfluencerInfoPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/my"
              element={
                <PrivatedRoute>
                  <MyPage />
                </PrivatedRoute>
              }
            />
            <Route
              path="/choice"
              element={
                <PrivatedRoute>
                  <ChoicePage />
                </PrivatedRoute>
              }
            />
          </Route>
          <Route
            path="/auth"
            element={
              <PrivatedRoute>
                <AuthPage />
              </PrivatedRoute>
            }
          />
          <Route path="/review/:uuid" element={<ReviewPage />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
