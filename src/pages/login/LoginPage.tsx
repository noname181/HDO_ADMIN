import { LoginBox, LoginLogo, StationAnimation } from './LoginPage.styled';
import { Body, Container } from 'styles/style';
import LoginForm from 'pages/login/LoginForm';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from 'recoil/authState';

const LoginPage = () => {
  const isLoggedIn: boolean = useRecoilValue(isLoggedInState);
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <Body login>
      <Container login>
        <LoginBox>
          <LoginLogo />
          <LoginForm />
        </LoginBox>
        <StationAnimation />
      </Container>
    </Body>
  );
};

export default LoginPage;
