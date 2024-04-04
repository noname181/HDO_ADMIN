import React, { useContext } from 'react';
import { type NewRadioProps } from 'interfaces/common/IRadio';
import { RadioInput, RadioLabel } from './Radio.styled';
import { RadioContext } from './RadioContext';

export const Radio: React.FC<NewRadioProps> = ({
  children,
  value,
  name,
  disabled,
}) => {
  const group = useContext(RadioContext) as NewRadioProps;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    group.onChange?.(e);
  };

  const isChecked = group.value !== undefined ? value === group.value : false;
  const isDefaultChecked =
    group.defaultChecked !== undefined ? value === group.defaultChecked : false;

  return (
    <RadioLabel checked={isChecked || isDefaultChecked}>
      <RadioInput
        type="radio"
        name={name}
        value={value}
        disabled={disabled ?? group.disabled}
        checked={isChecked || isDefaultChecked}
        onChange={handleChange}
      />
      {children}
    </RadioLabel>
  );
};
