import { type ReactNode } from 'react';

export interface ModalWrapProps {
  open: boolean;
  children: ReactNode;
}

export interface ModalProps extends ModalWrapProps {
  title: string;
  button?: string;
  close: () => void;
  buttonClick?: () => void;
  // onSave?: (data: any) => void; // 수정된 타입 적용
  style?: React.CSSProperties;
}

export interface ModalHeaderProps {
  title: string;
  buttonText?: string;
  close?: React.MouseEventHandler<HTMLButtonElement>;
  buttonClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface ModalFooterProps {
  close?: React.MouseEventHandler<HTMLButtonElement>;
  closeText?: string;
  onOk?: React.MouseEventHandler<HTMLButtonElement>;
  okText?: string;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
  isOk?: boolean;
}

export interface ModalFooterStationProps {
  close?: React.MouseEventHandler<HTMLButtonElement>;
  closeText?: string;
  onOk?: React.MouseEventHandler<HTMLButtonElement>;
  okText?: string;
  data: string;
  updateChgUseYn?: any;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
  isOk?: boolean;
}

export interface ModalFooterChargerProps {
  close?: React.MouseEventHandler<HTMLButtonElement>;
  closeText?: string;
  onOk?: React.MouseEventHandler<HTMLButtonElement>;
  okText?: string;
  data: string;
  updateChgUseYn?: any;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
  updateTypeSoft?: React.MouseEventHandler<HTMLButtonElement>;
  updateTypeHard?: React.MouseEventHandler<HTMLButtonElement>;
}

export type AlertModalType = 'error' | 'alert' | 'warning' | 'success' | 'info';

export interface AlertModalStateInterface {
  open: boolean;
  type: AlertModalType;
  title: string | null;
  content: ReactNode | null;
  onCancel: (() => void) | null;
  onOk: (() => void) | null;
  cancelText: string;
  okText: string;
  isOk: boolean;
}
