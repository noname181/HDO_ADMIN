import React, { type ChangeEvent } from 'react';
import { LabelWrap } from 'components/common/Form/Form';
import { type RadioProps } from 'interfaces/common/IRadio';
import { RadioInput, RadioLabel, RadioWrap } from './Radio.styled';

export const Radio: React.FC<RadioProps> = ({
  label,
  options,
  selectedOption,
  onChange,
  isVertical,
  isRequired,
  requiredMark = true,
}) => {
  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Assuming your radio button values are of type string
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <>
      {label ? (
        <LabelWrap
          label={label}
          isVertical={isVertical}
          isRequired={isRequired}
          requiredMark={requiredMark}
        >
          <RadioWrap>
            {options?.map((option, index) => (
              <React.Fragment key={index}>
                <RadioLabel checked={selectedOption === option.value}>
                  <RadioInput
                    name={label}
                    type="radio"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={handleRadioChange}
                  />
                  {option.label}
                </RadioLabel>
              </React.Fragment>
            ))}
          </RadioWrap>
        </LabelWrap>
      ) : (
        <RadioWrap>
          {options?.map((option, index) => (
            <React.Fragment key={index}>
              <RadioLabel checked={selectedOption === option.value}>
                <RadioInput
                  name={label}
                  type="radio"
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={handleRadioChange}
                />
                {option.label}
              </RadioLabel>
            </React.Fragment>
          ))}
        </RadioWrap>
      )}
    </>
  );
};
