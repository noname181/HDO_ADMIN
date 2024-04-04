import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import 'styles/font.css';

import { GlobalStyle } from './styles/GlobalStyle';
import PageRouter from './pages/PageRouter';

import LoginContainer from 'pages/login/LoginPage';
import { ResetPassword } from 'pages/password/ResetPassword';
import { SendMail } from 'pages/password/SendMail';
import { PrivateRoute } from 'PrivateRoute';
import { ProvideAuth } from 'hooks/useAuth';
import { PublicRoute } from 'PublicRoute';
import EventPage from 'pages/event/EventPage';
import EventDetailPage from 'pages/event/EventDetailPage';

const App = () => {
  const [isLoading] = ProvideAuth();

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/password_reset/*" element={<ResetPassword />} />
          <Route path="/send_email/*" element={<SendMail />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/event-detail" element={<EventDetailPage />} />
        </Route>
        {isLoading ? (
          <></>
        ) : (
          <Route element={<PrivateRoute />}>
            <Route path="/*" element={<PageRouter />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};
export default App;
