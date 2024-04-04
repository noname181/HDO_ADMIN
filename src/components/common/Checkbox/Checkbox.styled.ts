import styled, { css } from 'styled-components';

export const CheckboxWrap = styled.div`
  display: flex;
  gap: 10px;
`;

export const StyledCheckbox = styled.input<{ disabled: boolean }>`
  transition: background-color 0.15s ease-in-out,
    background-position 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  appearance: none;
  print-color-adjust: exact;
  width: 16px;
  height: 16px;
  border: 1px solid #cdd0d3;
  border-radius: 4px;
  ${({ disabled }) =>
    disabled &&
    css`
      background-color: #f3f3f5;
      border: 1px solid #e4e7eb;
      opacity: 1 !important;
      pointer-events: none;
      filter: none;
    `}
  &:focus {
    outline: none;
    box-shadow: none;
    border: 1px solid var(--blue-200);
  }
  &:checked {
    background-image: url('/assets/img/icon/check.svg');
    background-color: var(--blue-200);
    border: 1px solid var(--blue-200) !important;
  }
  &:active {
    filter: brightness(90%);
  }
`;
