import axios from 'axios';
import { configuration } from 'config/config';

export const hdoInstance = () => {
  const baseHdoUrl = configuration().baseHdoUrl;
  const currentPathName = window?.location?.pathname;
  // console.log(window.location.pathname);
  const instance = axios.create({
    baseURL: baseHdoUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Location:
        currentPathName === '/cs-consultation' ? '/cs-home' : currentPathName,
    },
  });

  let isRefreshing = false;

  let refreshSubscribers: Array<(token: string) => void | Promise<void>> = [];

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (
        (error.response &&
          error.response.status === 401 &&
          error.response?.data?.errorCode === 'TOKEN_IS_EXPIRED' &&
          !originalRequest._retry) ||
        (error.response &&
          error.response?.data?.errorCode === 'UNAUTHORIZE_TOKEN_IS_REQUIRED')
      ) {
        if (isRefreshing) {
          return await new Promise((resolve) => {
            refreshSubscribers.push(async (token) => {
              if (originalRequest.headers) {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `${token}`;
                }
              }
              resolve(await instance(originalRequest));
            });
          });
        }

        originalRequest._retry = true;

        try {
          const { newAccessToken, newRefreshToken } =
            await requestRefreshToken();
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          if (originalRequest.headers) {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `${newAccessToken}`;
            }
          }
          return await instance(originalRequest);
        } catch (error) {
          console.error('Error refreshing token:', error);
          return await Promise.reject(error);
        }
      }

      return await Promise.reject(error);
    },
  );

  async function requestRefreshToken(): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
  }> {
    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken') ?? '';

    try {
      const response = await axios.post<{
        accessToken: string;
        refreshToken: string;
      }>(
        `${baseHdoUrl}/v1/mobile/auth/token/refresh`,
        {},
        {
          headers: {
            Authorization: refreshToken,
          },
        },
      );

      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;
      if (instance.defaults.headers.common) {
        instance.defaults.headers.common.Authorization = `${newAccessToken}`;
      }

      for (const subscriber of refreshSubscribers) {
        await subscriber(newAccessToken);
      }

      refreshSubscribers = [];
      isRefreshing = false;

      return { newAccessToken, newRefreshToken };
    } catch (error: any) {
      if (
        (error.response &&
          error.response.status === 401 &&
          error.response?.data?.errorCode === 'REFRESH_TOKEN_IS_EXPIRED') ||
        (error.response &&
          error.response?.data?.errorCode === 'UNAUTHORIZE_TOKEN_IS_REQUIRED')
      ) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      return await Promise.reject(error);
    }
  }

  return instance;
};
