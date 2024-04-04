import { type Dispatch, type SetStateAction } from 'react';
import { type AuthoredBy, type OrganizationInterface } from './ICommon';

export interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
}

export interface FaqInterface {
    title: string;
    category: string;
    content: string;
}
