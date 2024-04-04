import { useState, useEffect, useCallback } from 'react';
import axios, { type AxiosInstance } from 'axios';

import { defaultUrl } from 'apis/api.helpers';
import {
  type ListState,
  type RequestOptions,
  type RequestOptionsChargingStation,
} from 'interfaces/IUseGetData';
import { hdoInstance } from 'apis/hdoInstance';

export const useGetListWt = <T>(
  opts: RequestOptions,
  axiosInstance: AxiosInstance = hdoInstance(),
) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalClKwh, setTotalClKwh] = useState<number>(0);
  const [totalNotPaid, setTotalNotPaid] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalClCharge, setTotalClCharge] = useState<number>(0);
  const [totalClChargeHDO, setTotalClChargeHDO] = useState<number>(0);
  const [latestVer, setLatestVer] = useState<string>('');
  const [dataAll, setDataAll] = useState<any>('');

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
    setTrigger(true);
  };

  const getData = async () => {
    if (!opts.url) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    const apiLocation = opts.location;

    try {
      const accessToken = localStorage.getItem('accessToken') ?? '';
      const apiUrl = `${opts.url}`;
      if (apiLocation) {
        const response = await axiosInstance.get(apiUrl, {
          headers: {
            ...opts.headers,
            Authorization: accessToken,
            location: apiLocation,
          },
        });

        setTotalCount(response.data.totalCount);
        setTotalClKwh(response.data.totalClKwh);
        setTotalNotPaid(response.data.totalNotPaid);
        setTotalClCharge(response.data?.totalClCharge);
        setTotalClChargeHDO(response.data?.totalClChargeHDO);
        setTotalCost(response.data.totalCost);
        setLatestVer(response.data.latestVer);
        setDataAll(response?.data);
        setState({
          loading: false,
          error: null,
          data: response?.data?.result,
        });
      } else {
        const response = await axiosInstance.get(apiUrl, {
          headers: {
            ...opts.headers,
            Authorization: accessToken,
          },
        });
        setTotalClKwh(response.data.totalClKwh);
        setTotalCount(response.data.totalCount);
        setTotalNotPaid(response.data.totalNotPaid);
        setTotalClCharge(response.data?.totalClCharge);
        setTotalClChargeHDO(response.data?.totalClChargeHDO);
        setTotalCost(response.data.totalCost);
        setLatestVer(response.data.latestVer);
        setDataAll(response?.data);
        setState({
          loading: false,
          error: null,
          data: response?.data?.result,
        });
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        setState({
          loading: false,
          error,
          data: null,
        });
      }
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

  return {
    ...state,
    refetch,
    totalCount,
    latestVer,
    dataAll,
    totalClKwh,
    totalNotPaid,
    totalCost,
    totalClCharge,
    totalClChargeHDO,
  };
};

export const useGetListWtTrigger = <T>(
  axiosInstance: AxiosInstance = hdoInstance(),
) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [state, setState] = useState<ListState<T>>({
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
      const apiLocation = opts.location;
      if (apiLocation) {
        const apiProps: RequestOptions = {
          ...opts,
          url: apiUrl,
          headers: {
            ...opts.headers,
            Authorization: accessToken,
            location: apiLocation,
          },
        };

        const response = await axiosInstance(apiProps);
        setTotalCount(response.data.totalCount);
        setState({
          loading: false,
          error: null,
          data: response.data.result,
        });
      } else {
        const apiProps: RequestOptions = {
          ...opts,
          url: apiUrl,
          headers: {
            ...opts.headers,
            Authorization: accessToken,
          },
        };

        const response = await axiosInstance(apiProps);
        setTotalCount(response.data.totalCount);
        setState({
          loading: false,
          error: null,
          data: response.data.result,
        });
      }
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

  return { ...state, getData, clearError, totalCount };
};

export const useGetListWtTriggerSearchStation = <T>(
  axiosInstance: AxiosInstance = hdoInstance(),
) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [state, setState] = useState<ListState<T>>({
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
        headers: {
          ...opts.headers,
          Authorization: accessToken,
          location: '/charging-station',
        },
      };

      const response = await axiosInstance(apiProps);
      setTotalCount(response.data.totalCount);
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

  const clearError = () => {
    setState((prevState) => ({
      ...prevState,
      error: null,
    }));
  };

  return { ...state, getData, clearError, totalCount };
};

export const useGetListAll = <T>(
  opts: RequestOptionsChargingStation,
  axiosInstance: AxiosInstance = hdoInstance(),
) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [latestVer, setLatestVer] = useState<string>('');
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
    setTrigger(true);
  };

  const getData = async () => {
    if (!opts.url) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const accessToken = localStorage.getItem('accessToken') ?? '';
      const apiUrl = opts.url;
      const apiLocation = opts.location;
      const apiProps: RequestOptionsChargingStation = {
        ...opts,
        url: apiUrl,
        headers: {
          ...opts.headers,
          Authorization: accessToken,
          location: apiLocation,
        },
      };
      const response = await axiosInstance(apiProps);
      setTotalCount(response.data.totalCount);
      setLatestVer(response.data.latestVer);
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
    setTrigger(false);
  };

  useEffect(() => {
    if (trigger) {
      void getData();
    }
  }, [trigger]);

  useEffect(() => {
    // console.log(opts);
    if (!opts?.location?.location?.state) void getData();
  }, []);

  return { ...state, refetch, totalCount, latestVer };
};
