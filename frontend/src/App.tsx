import { Route, Routes } from 'react-router-dom';
import AuthProvider from '@/provider/Auth';
import MainLayout from '@/components/common/layouts/MainLayout';
import AuthPage from '@/pages/Auth';
import DetailPage from '@/pages/Detail';
import InfluencerPage from '@/pages/Influencer';
import MainPage from '@/pages/Main';
import MapPage from '@/pages/Map';
import MyPage from '@/pages/My';
import ChoicePage from '@/pages/Choice';
import PrivatedRoute from '@/routes/component/PrivatedRoute';

import GlobalStyle from './global';
import SearchPage from './pages/Search';
import ReviewPage from './pages/Review';
import InfluencerInfoPage from './pages/InfluencerInfo';

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
          <Route path="/places/:id/reviews" element={<ReviewPage />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
