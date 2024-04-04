import { type ReactNode } from 'react';

export interface CheckboxProps {
  children: ReactNode;
  disabled?: boolean;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}
