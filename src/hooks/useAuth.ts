import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { userAuthState } from 'recoil/authState';
import { hdoInstance } from 'apis/hdoInstance';

export function ProvideAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const setAuthState = useSetRecoilState(userAuthState);

  const accessToken = localStorage.getItem('accessToken') ?? '';
  const refreshToken = localStorage.getItem('refreshToken') ?? '';
  const axios = hdoInstance();
  let ignore = false;
  const fetchAccessToken = () => {
    axios
      .post(`/v1/mobile/auth/token/refresh`, undefined, {
        headers: {
          Authorization: refreshToken,
        },
      })
      .then((res) => {
        localStorage.setItem('accessToken', res.data.accessToken);
        axios
          .get(`/v1/admin/users/me`, {
            headers: {
              Authorization: res.data.accessToken,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setAuthState({
              isAuthenticated: true,
              user: response.data,
            });
          })
          .catch(() => {
            setAuthState({
              isAuthenticated: false,
              user: null,
            });
            setIsLoading(false);
          });
      })
      .catch((e) => {
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
      setIsLoading(false);
      return;
    }
    if (!ignore) {
      axios
        .get(`/v1/admin/users/me`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setAuthState({
            isAuthenticated: true,
            user: response.data,
          });
        })
        .catch(() => {
          fetchAccessToken();
        });
    }
    return () => {
      ignore = true;
    };
  }, []);

  return [isLoading];
}

// NotAuthorizedException: Incorrect username or password. 아이디 패스워드 확인
// InvalidParameterException: CUSTOM_AUTH is not enabled for the client.?
// AuthError: Username cannot be empty 아이디를 입력해주세요
// NotAuthorizedException: Password attempts exceeded 비밀번호
