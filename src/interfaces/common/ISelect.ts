import { type ReactNode } from 'react';
export interface OptionProps {
  value: string | number;
  label: string;
}

export interface SelectProps {
  label?: string;
  isVertical?: boolean;
  isRequired?: boolean;
  options: OptionProps[] | undefined;
  onChange?: (value: any) => void;
  loading?: boolean;
  placeholder?: string;
  search?: boolean;
  requiredMark?: boolean;
  w100?: boolean;
}

export interface NewSelectProps {
  label?: string;
  isVertical?: boolean;
  isRequired?: boolean;
  onChange?: (value: any) => void;
  loading?: boolean;
  children?: ReactNode;
}

export interface ReactSelectProps {
  label?: string;
  options?: OptionProps[];
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: any) => void;
  loading?: boolean;
  isSearchable?: boolean;
  isVertical?: boolean;
  isRequired?: boolean;
  requiredMark?: boolean;
}
