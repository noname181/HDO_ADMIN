import { useEffect, useState } from 'react';
import axios, { type AxiosInstance } from 'axios';

import { defaultUrl } from 'apis/api.helpers';
import { type DataState, type RequestOptions } from 'interfaces/IUseGetData';
import { hdoInstance } from 'apis/hdoInstance';

export const useGetDataWt = <T>(
  opts: RequestOptions,
  axiosInstance: AxiosInstance = hdoInstance(),
) => {
  const [state, setState] = useState<DataState<T>>({
    loading: false,
    error: null,
    data: null,
  });

  const [trigger, setTrigger] = useState<boolean>(false);

  const refetch = () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    setTrigger(true);
  };

  const getData = async () => {
    if (!opts.url) {
      return;
    }
    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (accessToken) {
      const apiUrl = `${opts.url}`;
      const apiProps: RequestOptions = {
        ...opts,
        url: apiUrl,
        headers: { ...opts.headers, Authorization: accessToken },
      };
      axiosInstance(apiProps)
        .then((response) => {
          setState({
            loading: false,
            error: null,
            data: response.data.results,
          });
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            setState({
              loading: false,
              error,
              data: null,
            });
          }
        });
    }
    setTrigger(false);
  };

  useEffect(() => {
    if (trigger) {
      void getData();
    }
  }, [trigger]);

  useEffect(() => {
    void getData();
  }, []);

  return { ...state, refetch };
};

export const useGetDataWtTrigger = <T>(
  axiosInstance: AxiosInstance = hdoInstance(),
) => {
  const [state, setState] = useState<DataState<T>>({
    loading: false,
    error: null,
    data: null,
  });

  const getData = async (opts: RequestOptions) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    if (!opts?.url) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: new Error('Missing URL'),
      }));
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken') ?? '';
      const apiUrl = `${opts.url}`;
      const apiProps: RequestOptions = {
        ...opts,
        url: apiUrl,
        headers: { ...opts.headers, Authorization: accessToken },
      };

      const response = await axiosInstance(apiProps);
      setState({
        loading: false,
        error: null,
        data: response.data.result,
      });
    } catch (error) {
      if (!axios.isCancel(error)) {
        setState({
          loading: false,
          error,
          data: null,
        });
      }
    }
  };
  const getDetail = async (opts: RequestOptions) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    if (!opts?.url) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: new Error('Missing URL'),
      }));
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken') ?? '';
      const apiUrl = `${opts.url}`;
      const apiProps: RequestOptions = {
        ...opts,
        url: apiUrl,
        headers: { ...opts.headers, Authorization: accessToken },
      };

      const response = await axiosInstance(apiProps);
      setState({
        loading: false,
        error: null,
        data: response.data,
      });
    } catch (error) {
      if (!axios.isCancel(error)) {
        setState({
          loading: false,
          error,
          data: null,
        });
      }
    }
  };

  const clearError = () => {
    setState((prevState) => ({
      ...prevState,
      error: null,
    }));
  };

  return { ...state, getData, getDetail, clearError };
};

export const useGetDataWtSkip = <T>(
  opts: RequestOptions,
  axiosInstance: AxiosInstance = axios.create(),
) => {
  const [state, setState] = useState<DataState<T>>({
    loading: false,
    error: null,
    data: null,
  });

  const [trigger, setTrigger] = useState<boolean>(false);

  const refetch = () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    setTrigger(true);
  };

  const clearError = () => {
    setState((prevState) => ({
      ...prevState,
      error: null,
    }));
  };

  const getData = async () => {
    if (!opts.url) {
      return;
    }
    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (accessToken) {
      const apiUrl = `${opts.url}`;
      const apiProps: RequestOptions = {
        ...opts,
        url: apiUrl,
        headers: { ...opts.headers, Authorization: accessToken },
      };
      axiosInstance(apiProps)
        .then((response) => {
          setState({
            loading: false,
            error: null,
            data: response.data.result,
          });
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            setState({
              loading: false,
              error,
              data: null,
            });
          }
        });
    }
    setTrigger(false);
  };

  useEffect(() => {
    if (trigger) {
      void getData();
    }
  }, [trigger]);

  return { ...state, refetch, clearError };
};
