import { type Dispatch, type SetStateAction } from 'react';

export interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
}

export interface ConfigInterface {
  id: number | string;
  divCode: string;
  divComment: string;
  cfgVal: string | number;
}
