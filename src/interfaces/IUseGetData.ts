import { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export interface AxiosError<T = any> extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse<T>;
  isAxiosError: boolean;
  toJSON: () => object;
}

export interface RequestOptions {
  url: string;
  headers?: Record<string, string>;
  location?: any;
}

export interface RequestOptionsChargingStation {
  url: string;
  headers?: Record<string, string>;
  location?: any;
}

export interface DataState<T> {
  loading: boolean;
  error: any;
  data: T | null;
}
export interface UseGetDataResponse<T> extends DataState<T> {
  refetch: (url?: string) => void;
}

export interface ListState<T> {
  loading: boolean;
  error: any;
  data: T[] | null;
  totalCount?: number;
  totalClKwh?: number;
  totalNotPaid?: number;
  totalCost?: number;
  dataAll?: any;
  totalClCharge?: number;
  totalClChargeHDO?: number;
}

export interface UseGetListResponse<T> extends ListState<T> {
  refetch: () => void;
}
