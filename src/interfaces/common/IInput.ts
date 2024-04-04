export type InputValue = string | number | readonly string[] | undefined;
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: InputValue;
  label?: string;
  isRequired?: boolean;
  minLength?: number;
  maxLength?: number;
  isVertical?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isModal?: boolean;
  onKeyDown?: (value: any) => void;
  requiredMark?: boolean;
}
