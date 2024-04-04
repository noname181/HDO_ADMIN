import styled, { css } from 'styled-components';
import { type AlertModalType } from 'interfaces/common/IModal';

export const ModalContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  visibility: hidden;
  overflow: hidden;
  outline: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.15s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.open &&
    css`
      visibility: visible;
      overflow-x: hidden;
      overflow-y: auto;
      opacity: 1;
    `};
  & > div {
    transition: transform 0.3s ease-out;
    transform: ${(props) => (props.open ? 'none' : 'translate(0, -50px)')};
    width: 1200px;
    margin: 1.75rem auto;
    position: relative;
    pointer-events: none;
  }
`;

export const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 30px 0;
  gap: 20px;
  border-radius: 0;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: 0;
`;

export const ModalHeaderWrap = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
  width: 100%;
  padding: 14px 0px;
  border-bottom: 1px solid #cdd0d3;
`;

export const ModalTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  margin-right: 10px;
  font-size: 18px;
  line-height: 20px;
  color: var(--dark-default);
  margin-top: 0;
  margin-bottom: 0;
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #2d8eff;
    display: inline-block;
    border-radius: 2px;
    box-sizing: border-box;
  }
`;

export const ModalBody = styled.div`
  padding: 0;
  width: 100%;
  height: 100%;
  position: relative;
  flex: 1 1 auto;
  max-height: calc(100vh - 160px);
  overflow-y: scroll;

  /* scroll */
  /* IE and Edge */
  -ms-overflow-style: none;
  /* Firefox */
  scrollbar-width: none;
  &::before,
  &::after {
    /* scroll */
    /* IE and Edge */
    -ms-overflow-style: none;
    /* Firefox */
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    /* Chrome, Safari, Opera */
    display: none;
  }
`;

export const ModalFooterWrap = styled.div`
  border-top: none;
  justify-content: center;
  gap: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
  & > button {
    margin: 0;
    min-width: 65px;
  }
`;

export const ModalFooterChargerWrap = styled.div`
  border-top: none;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
  button {
    margin: 0;
    min-width: 65px;
  }
`;

export const AlertModalContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: 0.15s linear;
  z-index: 10000;
  ${(props) =>
    props.open &&
    css`
      visibility: visible;
      opacity: 1;
    `};
`;

export const AlertModalWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 500px;
  min-height: 232px;
  background-color: #fff;
  padding: 30px;
`;

export const AlertModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const AlertModalHeaderTitle = styled.p`
  color: #484848;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  width: max-content;
`;

export const AlertModalIcon = styled.div<{ type: AlertModalType }>`
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  ${(props) => {
    switch (props.type) {
      case 'alert':
        return css`
          background-image: url('assets/img/icon/alert.png');
        `;
      case 'error':
        return css`
          background-image: url('assets/img/icon/error.png');
        `;
      case 'warning':
        return css`
          background-image: url('assets/img/icon/warning.png');
        `;
      case 'success':
        return css`
          background-image: url('assets/img/icon/success.png');
        `;
      case 'info':
        return css`
          background-image: url('assets/img/icon/info.png');
        `;
      default:
        return css`
          background-image: url('assets/img/icon/info.png');
        `;
    }
  }}
`;

export const AlertModalContent = styled.div`
  inline-size: 440px;
  white-space: normal;
  overflow-wrap: break-word;
`;

export const AlertModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  height: 40px;
  & > button {
    padding: 13px 20px;
  }
`;
