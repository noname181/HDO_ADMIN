import React from 'react';
import { LabelWrap } from 'components/common/Form/Form';
import { type RadioGroupProps } from 'interfaces/common/IRadio';
import { RadioWrap } from './Radio.styled';
import { RadioContext } from './RadioContext';

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  children,
  isVertical,
  isRequired,
  requiredMark = true,
  ...rest
}) => {
  return label ? (
    <LabelWrap
      label={label}
      isVertical={isVertical}
      isRequired={isRequired}
      requiredMark={requiredMark}
    >
      <RadioWrap>
        <RadioContext.Provider value={rest}>{children}</RadioContext.Provider>
      </RadioWrap>
    </LabelWrap>
  ) : (
    <RadioWrap>
      <RadioContext.Provider value={rest}>{children}</RadioContext.Provider>
    </RadioWrap>
  );
};
