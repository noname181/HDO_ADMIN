import styled, { css } from 'styled-components';

export const RadioWrap = styled.div`
  background-color: var(--gray-100);
  height: 40px;
  display: flex;
  padding: 3px 4px;
  gap: 4px;
  border-radius: 6px;
`;

export const RadioInput = styled.input`
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
`;

export const RadioLabel = styled.label<{ checked?: boolean }>`
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  ${(props) =>
    props.checked &&
    css`
      background-color: var(--white);
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      color: var(--blue-200);
    `}
`;
