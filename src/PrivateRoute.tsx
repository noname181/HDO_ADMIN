import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from 'recoil/authState';

export const PrivateRoute: React.FC = () => {
  const isLoggedIn: boolean = useRecoilValue(isLoggedInState);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
