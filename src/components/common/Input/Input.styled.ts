import styled, { css } from 'styled-components';

export const InputWrap = styled.div<{ label: string; isVertical: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: ${(props) =>
    props.isVertical
      ? '100%'
      : props.label !== null
      ? 'calc(100% - 150px);'
      : '100%'};
`;

export const StyledInput = styled.input<{
  hasError: boolean;
  readOnly: boolean;
  disabled: boolean;
  isModal: boolean;
}>`
  background-color: var(--white);
  border: 1px solid var(--btn-gray-300);
  color: var(--dark-default);
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  padding: 0px 10px;
  border-radius: 6px;
  height: 40px;
  width: ${(props) => (props.isModal ? 'calc( 100% - 150px)' : '100%')};
  position: relative;
  ${({ hasError }) => hasError && 'border: 1px solid #E92C2C !important;'}
  ${({ readOnly }) =>
    readOnly &&
    css`
      background-color: var(--btn-gray-100) !important;
      color: #8f9295 !important;
      border: none !important;
      box-shadow: none !important;
    `}
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      background-color: #f3f3f5 !important;
      border: none !important;
    `}
  &:hover {
    border: 1px solid #0d6efd;
  }
  &:focus {
    border: 1px solid #0d6efd;
    outline: none;
    box-shadow: 0px 0px 2px 2px rgba(180, 246, 255, 0.5);
  }
  &::placeholder {
    font-weight: 500;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 12px;
  line-height: 12px;
  color: #e92c2c;
  font-weight: 500;
`;

export const ShowPasswordIcon = styled.span<{
  showPassword: boolean;
  disabled: boolean;
}>`
  background-image: ${(props) =>
    `url(${
      !props.showPassword
        ? '/assets/img/icon/icon-input-view-d.png'
        : '/assets/img/icon/icon-input-view-a.png'
    })`};
  position: absolute;
  top: 24px;
  right: 0;
  margin-bottom: 0;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-size: 18px;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
  cursor: pointer;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
  ${({ disabled }) =>
    disabled &&
    css`
      background-image: url('/assets/img/icon/icon-input-view-d.png');
      cursor: default;
      &:hover {
        opacity: 0.3;
      }
    `}
`;
