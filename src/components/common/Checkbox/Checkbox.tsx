import { type ChangeEvent } from 'react';
import { CheckboxWrap, StyledCheckbox } from './Checkbox.styled';
import { type CheckboxProps } from 'interfaces/common/ICheckbox';

export function Checkbox({
  children,
  disabled = false,
  checked,
  onChange,
}: CheckboxProps) {
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (onChange) {
      onChange(checked);
    }
  };
  return (
    <CheckboxWrap>
      <StyledCheckbox
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <label>{children}</label>
    </CheckboxWrap>
  );
}
