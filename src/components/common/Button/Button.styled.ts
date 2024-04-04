import styled, { css } from 'styled-components';
import { type ButtonProps } from 'interfaces/common/IButton';

export const StyledButton = styled.button<ButtonProps>`
  /* Base styles */
  font-family: 'Pretendard';
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  margin: ${(props) => props.margin ?? '0'};
  min-width: ${(props) => props.minWidth ?? '40px'};
  cursor: pointer;

  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  ${(props) =>
    (props.w100 ?? false) &&
    css`
      width: 100%;
      min-width: 110px;
    `}

  /* Styles based on size prop */
  ${(props) =>
    props.size === 'sm' &&
    css`
      /* Small size styles */
      padding: 0px 8px;
      height: 32px;
      font-weight: 500;
      font-size: 12px;
      line-height: 32px;
    `}

  ${(props) =>
    props.size === 'md' &&
    css`
      /* Medium size styles (default) */
      padding: 0px 10px;
      height: 40px;
      font-weight: 500;
      font-size: 14px;
      line-height: 40px;
    `}

  ${(props) =>
    props.size === 'lg' &&
    css`
      /* Large size styles */
      padding: 0px 12px;
      height: 48px;
      font-weight: 500;
      font-size: 16px;
      line-height: 48px;
    `}

  /* Styles based on color prop */
  ${(props) =>
    props.color === 'primary' &&
    css`
      /* Primary color styles */
      color: var(--white) !important;
      background-color: var(--blue-500) !important;
      border: none !important;
      &:hover {
        color: var(--white);
        background-color: var(--blue-400) !important;
      }
      &:active,
      &.active {
        color: var(--white);
        background-color: var(--blue-600) !important;
      }
    `}
   
  ${(props) =>
    props.color === 'secondary' &&
    css`
      /* Secondary color styles */
      color: var(--white) !important;
      background-color: var(--blue-200) !important;
      border: none !important;
      &:hover {
        color: var(--white) !important;
        background-color: var(--blue-100) !important;
      }
      &:active,
      &.active {
        color: var(--white) !important;
        background-color: var(--blue-300) !important;
      }
    `}

  ${(props) =>
    props.color === 'reset' &&
    css`
      /* Reset color styles */
      color: var(--dark-default) !important;
      background-color: var(--white) !important;
      border: 1px solid var(--btn-gray-300) !important;
      &:hover {
        color: var(--dark-default) !important;
        background-color: var(--white) !important;
        border: 1px solid var(--dark-default) !important;
      }
      &:active,
      &.active {
        color: var(--dark-default) !important;
        background-color: var(--btn-gray-100) !important;
        border: 1px solid var(--btn-gray-100) !important;
      }
    `}
    
  ${(props) =>
    props.color === 'warning' &&
    css`
      /* Sub color styles */
      color: var(--white) !important;
      background-color: #f8a911 !important;
      border: 1px solid #f8a911 !important;
      &:hover {
        color: var(--white) !important;
        background-color: #feb933 !important;
        border: 1px solid #feb933 !important;
      }
      &:active,
      &.active {
        color: var(--white) !important;
        background-color: #e99d0c !important;
        border: 1px solid #e99d0c !important;
      }
    `}

  ${(props) =>
    props.color === 'error' &&
    css`
      /* Sub color styles */
      color: var(--white) !important;
      background-color: #e92c2c !important;
      border: 1px solid #e92c2c !important;
      &:hover {
        color: var(--white) !important;
        background-color: #fd4545 !important;
        border: 1px solid #fd4545 !important;
      }
      &:active,
      &.active {
        color: var(--white) !important;
        background-color: #ce2121 !important;
        border: 1px solid #ce2121 !important;
      }
    `}
  
  ${(props) =>
    props.color === 'success' &&
    css`
      /* Sub color styles */
      color: var(--white) !important;
      background-color: #00ae42 !important;
      border: 1px solid #00ae42 !important;
      &:hover {
        color: var(--white) !important;
        background-color: #10cf58 !important;
        border: 1px solid #10cf58 !important;
      }
      &:active,
      &.active {
        color: var(--white) !important;
        background-color: #068b39 !important;
        border: 1px solid #068b39 !important;
      }
    `}

  ${(props) =>
    props.color === 'sub' &&
    css`
      background-color: var(--white) !important;
      border: 1px solid var(--btn-gray-300) !important;
      color: var(--blue-200) !important;
      &:hover {
        color: var(--blue-200) !important;
        background-color: var(--white) !important;
        border: 1px solid var(--blue-200) !important;
      }
      &:active,
      &.active {
        color: var(--blue-200) !important;
        background-color: var(--btn-gray-100) !important;
        border: 1px solid var(--btn-gray-100) !important;
      }
    `} 
    ${(props) =>
    props.color === 'disable' &&
    css`
      color: #484848 !important;
      border: 1px solid var(--btn-disabled-gray-bg) !important;
      background-color: var(--btn-disabled-gray-bg) !important;

      &:hover {
        color: #484848 !important;
        border: 1px solid var(--btn-disabled-gray-bg) !important;
        background-color: var(--btn-disabled-gray-bg) !important;
      }
      &:active,
      &.active {
        color: #484848 !important;
        border: 1px solid var(--btn-disabled-gray-bg) !important;
        background-color: var(--btn-disabled-gray-bg) !important;
      }
    `}   


  ${(props) =>
    (props.disabled ?? false) &&
    css`
      /* Disabled styles */
      color: var(--btn-gray-400) !important;
      border: 1px solid var(--btn-disabled-gray-bg) !important;
      background-color: var(--btn-disabled-gray-bg) !important;
      pointer-events: none;
    `}
    ${(props) =>
    (props.isSearch ?? false) &&
    css`
      width: 5rem;
      margin-left: auto;
    `}
`;

export const ButtonIcon = styled.img<{ iconSize?: string }>`
  width: ${(props) => props.iconSize ?? '18px'};
  height: ${(props) => props.iconSize ?? '18px'};
`;

export const TableButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const ButtonSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-bottom-color: #fff;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 0.8s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
export const StyledButtonUpload = styled.div<ButtonProps>`
  /* Base styles */
  font-family: 'Pretendard';
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  cursor: pointer;

  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  ${(props) =>
    (props.w100 ?? false) &&
    css`
      width: 100%;
    `}

  /* Styles based on size prop */
  ${(props) =>
    props.size === 'sm' &&
    css`
      /* Small size styles */
      padding: 0px 8px;
      height: 32px;
      font-weight: 500;
      font-size: 12px;
      line-height: 32px;
    `}

  ${(props) =>
    props.size === 'md' &&
    css`
      /* Medium size styles (default) */
      padding: 0px 10px;
      height: 40px;
      font-weight: 500;
      font-size: 14px;
      line-height: 40px;
    `}

  ${(props) =>
    props.size === 'lg' &&
    css`
      /* Large size styles */
      padding: 0px 12px;
      height: 48px;
      font-weight: 500;
      font-size: 16px;
      line-height: 48px;
    `}

  ${(props) =>
    props.color === 'reset' &&
    css`
      /* Reset color styles */
      color: var(--dark-default) !important;
      background-color: var(--white) !important;
      border: 1px solid var(--btn-gray-300) !important;
      &:hover {
        color: var(--dark-default) !important;
        background-color: var(--white) !important;
        border: 1px solid var(--dark-default) !important;
      }
      &:active,
      &.active {
        color: var(--dark-default) !important;
        background-color: var(--btn-gray-100) !important;
        border: 1px solid var(--btn-gray-100) !important;
      }
    `}
    ${(props) =>
    (props.disabled ?? false) &&
    css`
      /* Disabled styles */
      color: var(--btn-gray-400) !important;
      border: 1px solid var(--btn-disabled-gray-bg) !important;
      background-color: var(--btn-disabled-gray-bg) !important;
      pointer-events: none;
    `}
`;
