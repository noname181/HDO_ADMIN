import { type ReactNode } from 'react';
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?:
    | 'primary'
    | 'secondary'
    | 'reset'
    | 'sub'
    | 'error'
    | 'warning'
    | 'success'
    | 'disable';
  margin?: string;
  minWidth?: string;
  w100?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: string;
  iconSize?: string;
  alt?: string;
  isSearch?: boolean;
  isLoading?: boolean;
}

export interface TableButtonProps {
  label?: string;
  excel?: () => void;
  excelText?: string;
  inactive?: () => void;
  inactiveText?: string;
  register?: () => void;
  registerText?: string;
  isExcel?: boolean;
  isRegiter?: boolean;
  isInactive?: boolean;
  children?: ReactNode;
  isModalOpen?: boolean;
  setIsModalOpen?: (x: any) => any;
}
