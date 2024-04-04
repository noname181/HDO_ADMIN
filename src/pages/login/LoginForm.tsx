import { useState } from 'react';
import { Button } from 'components/common/Button/Button';
import { Input } from 'components/common/Input/Input';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import {
  AutoLoginWrap,
  SearchIdPassword,
  TabMenu,
  TabMenuTitle,
  TabPane,
  TabWrap,
  TabContent,
  ErrorMessage,
} from './LoginPage.styled';

import { defaultUrl } from 'apis/api.helpers';
import { useSetRecoilState } from 'recoil';
import { userAuthState } from 'recoil/authState';
import { Navigate, useNavigate } from 'react-router-dom';
import { hdoInstance } from 'apis/hdoInstance';
import { handleSetMainPage } from 'utils/initialPage';

// import md5 from 'md5';

const LoginForm = () => {
  const [isExternalManager, setIsExternalManager] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<null | string>(null);
  const [autoLogin, setAutoLogin] = useState(
    localStorage.getItem('autoLogin') === 'true' ?? false,
  );
  const setAuthState = useSetRecoilState(userAuthState);
  const navigate = useNavigate();
  const [mainPage, setMainPage] = useState<string>('/');

  // function errorValidate(error: string) {
  //   switch (error) {
  //     case 'Incorrect username or password.':
  //       return `${
  //         isExternalManager ? '이메일 주소' : '사번'
  //       } 또는 비밀번호를 확인하세요.`;
  //     // case 'Password attempts exceeded':
  //     //   return '비밀번호 입력 횟수를 초과했습니다. 페이지를 새로고침해주세요.';
  //     case 'Username cannot be empty':
  //       return `${
  //         isExternalManager ? '이메일 주소를' : '사번을'
  //       } 입력해주세요.`;
  //     case 'CUSTOM_AUTH is not enabled for the client.':
  //       return '비밀번호를 입력해주세요.';
  //     case 'ALREADY_RETIRED_USER':
  //       return '퇴사 처리된 사용자입니다. 관리자에게 문의해주세요.';
  //     case 'PASSWORD_NOT_MATCH':
  //       return '비밀번호가 일치하지 않습니다';
  //     case 'INVALID_ACCOUNT_ID':
  //       return '이메일 형식이 아닙니다.';
  //     default:
  //       return '로그인 에러: 관리자에게 문의해주세요.';
  //   }
  // }

  async function login() {
    setIsLoading(true);

    const axios = hdoInstance();
    axios
      .post(`/v1/web/auth/${isExternalManager ? 'external' : 'hdo'}/login`, {
        accountId: username,
        password: password,
      })
      .then((response) => {
        localStorage.setItem('accessToken', response.data?.accessToken);
        localStorage.setItem('refreshToken', response.data?.refreshToken);

        axios
          .get(`/v1/admin/users/me`, {
            headers: {
              Authorization: response.data?.accessToken,
            },
          })
          .then((response1) => {
            setIsLoading(false);
            setAuthState({
              isAuthenticated: true,
              user: response1.data,
            });
            localStorage.setItem('resetTime', '3600000');
            sessionStorage.setItem('loggedIn', 'true');
            if (response1?.data?.role?.mainMenu) {
              const urlMain = handleSetMainPage(
                response1?.data?.role?.mainMenu,
              );
              setMainPage(urlMain as string);
            }
          })
          .catch(() => {
            setAuthState({
              isAuthenticated: false,
              user: null,
            });
            setIsLoading(false);
          });

        setIsLoading(false);
        // console.log(mainPage);
        return <Navigate to={mainPage} />;
      })
      .catch((error) => {
        console.log('axios 에러 : ', error);
        setIsLoading(false);
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
        setError(
          error?.response?.data?.message ??
            '로그인 에러: 관리자에게 문의해주세요.',
        );
      });
  }

  const toggleExternalManager = () => {
    setIsExternalManager((prevValue) => !prevValue);
    setError(null);
    // setUsername('');
    // setPassword('');
  };

  return (
    <TabWrap type="login">
      <TabMenu>
        <TabMenuTitle
          active={!isExternalManager}
          onClick={() => {
            toggleExternalManager();
          }}
        >
          HDO 임직원
        </TabMenuTitle>
        <TabMenuTitle
          active={isExternalManager}
          onClick={() => {
            toggleExternalManager();
          }}
        >
          외부 관리자
        </TabMenuTitle>
      </TabMenu>
      <TabContent>
        <TabPane>
          <Input
            label={isExternalManager ? '이메일주소' : '사번'}
            placeholder={
              isExternalManager
                ? '이메일주소를 입력해주세요.'
                : '사번을 입력해주세요.'
            }
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            isVertical
          />
          <Input
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            isVertical
            onKeyDown={() => {
              void login();
            }}
          />
          <AutoLoginWrap>
            <Checkbox
              checked={autoLogin}
              onChange={(value) => {
                localStorage.setItem('autoLogin', value.toString());
                setAutoLogin(value);
              }}
            >
              자동로그인
            </Checkbox>
            {isExternalManager && (
              <SearchIdPassword>
                <p
                  onClick={() => {
                    navigate('/send_email');
                  }}
                >
                  비밀번호 찾기
                </p>
              </SearchIdPassword>
            )}
          </AutoLoginWrap>
          <Button
            isLoading={isLoading}
            size="md"
            color="primary"
            margin="30px 0 0"
            w100
            onClick={() => {
              void login();
            }}
          >
            로그인
          </Button>
          <ErrorMessage>{error}</ErrorMessage>
        </TabPane>
      </TabContent>
    </TabWrap>
  );
};

export default LoginForm;
