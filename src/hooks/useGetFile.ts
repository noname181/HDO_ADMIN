import { useState, useEffect } from 'react';
import axios, { type AxiosInstance } from 'axios';
import { defaultUrl } from 'apis/api.helpers';
import { type ListState, type RequestOptions } from 'interfaces/IUseGetData';
import { hdoInstance } from 'apis/hdoInstance';

export const useGetFile = <T>(
  opts: RequestOptions,
  axiosInstance: AxiosInstance = hdoInstance(),
) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [state, setState] = useState<ListState<T>>({
    loading: true,
    error: null,
    data: null,
  });

  const [trigger, setTrigger] = useState<boolean>(false);

  const refetch = () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    setTrigger((prevTrigger) => !prevTrigger);
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
    const apiUrl = `${opts.url}`;
    const apiProps: RequestOptions = {
      ...opts,
      url: apiUrl,
      headers: opts?.headers,
    };
    axiosInstance(apiProps)
      .then((response) => {
        setTotalCount(response.data.totalCountfile);
        setState({
          loading: false,
          error: null,
          data: response.data.file,
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
  };

  useEffect(() => {
    void getData();
  }, [trigger]); // Add trigger to the dependency array

  return { ...state, refetch, clearError, totalCount };
};
