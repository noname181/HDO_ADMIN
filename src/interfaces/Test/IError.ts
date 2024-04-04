import { type Dispatch, type SetStateAction } from 'react';

export interface ErrorCodeFilterInterface {
  errorCode: string;
}
export interface ErrorCodeInterface {
  errorCode: string;
  errorMsg: string;
  solution: string;
}

export interface ErrorCodeFilterProps {
  queryState: ErrorCodeFilterInterface;
  setQueryState: Dispatch<SetStateAction<ErrorCodeFilterInterface>>;
  refetch: () => void;
}
