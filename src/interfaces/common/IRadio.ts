import { type ReactNode } from 'react';

export interface RadioProps {
  label?: string;
  options?: Array<{
    value: string | number | readonly string[] | undefined;
    label: string;
  }>;
  selectedOption: string;
  onChange?: (value: any) => void;
  isVertical?: boolean;
  isRequired?: boolean;
  requiredMark?: boolean;
}

export interface NewRadioProps {
  children?: ReactNode;
  value?: string | number | readonly string[] | undefined;
  name?: string | undefined;
  defaultChecked?: string | number | readonly string[] | undefined;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface RadioGroupProps extends NewRadioProps {
  label?: string;
  children?: ReactNode;
  isVertical?: boolean;
  isRequired?: boolean;
  requiredMark?: boolean;
}
