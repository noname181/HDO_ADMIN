import React from 'react';
import styled, { css } from 'styled-components';
import { LabelWrap } from 'components/common/Form/Form';

interface defaultRadio {
  label: string;
  options: Array<{ id: string; label: string }>;
  selectedOption: string;
  onChange: (value: string) => void;
  isVertical?: boolean;
  isRequired?: boolean;
  discount?: boolean;
  requiredMark?: boolean;
}

const DefaultRadio: React.FC<defaultRadio> = ({
  label,
  options,
  selectedOption,
  onChange,
  isVertical,
  isRequired,
  discount,
  requiredMark = true,
}) => {
  return (
    <LabelWrap
      label={label}
      isVertical={isVertical}
      isRequired={isRequired}
      requiredMark={requiredMark}
      width={'70px'}
    >
      <RadioWrap discount={discount}>
        {options.map((option) => (
          <React.Fragment key={option.id}>
            <RadioInput
              type="radio"
              id={option.id}
              checked={selectedOption === option.id}
              onChange={() => {
                if (onChange) {
                  onChange(option.id);
                }
              }}
            />
            <RadioLabel
              checked={selectedOption === option.id}
              htmlFor={option.id}
            >
              {option.label}
            </RadioLabel>
          </React.Fragment>
        ))}
      </RadioWrap>
    </LabelWrap>
  );
};

export default DefaultRadio;

const RadioWrap = styled.div<{ discount?: boolean }>`
  background-color: transparent;
  gap: 20px;
  border-radius: 0;
  height: auto;
  padding-top: 0.75rem;
  display: flex;
  ${(props) =>
    props.discount &&
    css`
      display: grid;
      grid-template-columns: 14px 2fr;
    `}
`;

const RadioInput = styled.input`
  display: block;
  position: relative;
  cursor: pointer;
`;

const RadioLabel = styled.label<{
  checked: boolean;
}>`
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  ${(props) =>
    props.checked &&
    css`
      color: var(--blue-200);
    `}
`;
