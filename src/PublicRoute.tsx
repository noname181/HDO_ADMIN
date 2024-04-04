import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoggedInState, userAuthState } from 'recoil/authState';
import { handleSetMainPage } from 'utils/initialPage';

export const PublicRoute: React.FC = () => {
  const isLoggedIn: boolean = useRecoilValue(isLoggedInState);
  const location = useLocation();
  const url = location.pathname;
  const [{ user }] = useRecoilState(userAuthState);

  // console.log(location.pathname);
  const publicUrl = [
    '/password_reset',
    '/send_email',
    '/event',
    '/event-detail',
  ];
  const defaultPage = handleSetMainPage(user?.role?.mainMenu);
  if (isLoggedIn && !publicUrl.includes(url)) {
    return <Navigate to={defaultPage ?? '/'} />;
  }
  return <Outlet />;
};
