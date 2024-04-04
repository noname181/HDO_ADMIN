import styled, { css } from 'styled-components';
import { Input, Form, Select, Radio, Button } from 'antd';
import { hdoInstance } from 'apis/hdoInstance';

const { Search } = Input;
const { TextArea } = Input;
interface UIprops {
  readOnly?: boolean;
  disabled?: boolean;
  hiddenIcon?: boolean;
  rows?: number;
}

export const StyledSearch = styled(Search)<UIprops>`
  display: flex;
  width: 220px;
  font-size: 14px;
  line-height: 1;
  border-right: 0;
  position: relative;
  & .ant-input-affix-wrapper {
    border-radius: 6px !important;
  }
  & button {
    // background: var(--blue-200);
    border: 0;
    position: absolute;
    right: 1px;
    top: 1px;
    bottom: 1px;
    z-index: 9;
    border-radius: 6px;
    height: 38px !important;
  }
  ${(props) =>
    props.hiddenIcon &&
    css`
      & .ant-input-search-button {
        display: none;
      }
    `}
`;

export const StyledInput = styled(Input)<UIprops>`
  height: 40px;
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  padding: 0px 10px;
  border-radius: 6px;
  border: 1px solid var(--btn-gray-300);
  color: var(--dark-default);
  & .antitem-row {
    justify-content: unset;
  }
  ${(props) =>
    props.readOnly &&
    css`
      background-color: var(--btn-gray-100);
      color: #8f9295;
      border: none;
      box-shadow: none;
      &:focus {
        border-color: none;
        box-shadow: none;
        border-inline-end-width: none;
        outline: 0;
      }
    `}
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      background-color: #f3f3f5 !important;
      border: none !important;
    `}
`;
export const StyledTextArea = styled(TextArea)<UIprops>`
  font-weight: 500;
  font-size: 14px;
  padding: 10px 10px;
  border-radius: 6px;
  border: 1px solid var(--btn-gray-300);
  color: var(--dark-default);
  & .antitem-row {
    justify-content: unset;
  }
  ${(props) =>
    props.readOnly &&
    css`
      background-color: var(--btn-gray-100);
      color: #8f9295;
      border: none;
      box-shadow: none;
      &:focus {
        border-color: none;
        box-shadow: none;
        border-inline-end-width: none;
        outline: 0;
      }
    `}
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      background-color: #f3f3f5 !important;
      border: none !important;
    `}
`;
interface FormProps {
  type?: 'footer' | 'modal';
  chgs?: boolean;
  gridcol?: string;
}
export const StyledForm = styled(Form)<FormProps>`
  width: 100%;
  background: #fff;
  display: grid;
  align-items: center;
  gap: 20px;
  grid-template-columns: ${(props) => props.gridcol ?? '1fr 1fr 1fr'};
  padding-bottom: 20px;
  border-bottom: 1px solid var(--btn-gray-300);
  ${(props) =>
    props.type === 'footer' &&
    css`
      padding: 0;
      margin: 0;
      margin-top: 20px;
    `}
  & .ant-form-item {
    margin: 0;
  }
  & .ant-form-item-label {
    & > label {
      height: 40px;
    }
  }
  & .ant-form-item-no-colon {
    width: 150px;
  }
  & .ant-row {
    justify-content: space-around;
  }
`;
export const StyledFormCharger = styled(Form)<FormProps>`
  & .ant-form-item {
    margin: 0;
  }
  & .ant-form-item-label {
    & > label {
      height: 40px;
    }
  }
  & .ant-form-item-no-colon {
    width: 150px;
  }
  & .ant-row {
    justify-content: space-around;
  }
`;
export const StyledDivForm = styled.div<FormProps>`
  width: 100%;
  background: #fff;
  display: grid;
  align-items: center;
  gap: 20px;
  grid-template-columns: ${(props) => props.gridcol ?? '1fr 1fr 1fr'};
  padding-bottom: 20px;
  // border-bottom: 1px solid var(--btn-gray-300);
  ${(props) =>
    props.type === 'footer' &&
    css`
      padding: 0;
      margin: 0;
      margin-top: 20px;
    `}
  & .ant-form-item {
    margin: 0;
  }
  & .ant-form-item-label {
    & > label {
      height: 40px;
    }
  }
  & .ant-form-item-no-colon {
    width: 150px;
  }
  & .ant-row {
    justify-content: space-around;
  }
`;

interface FormItemProps {
  type?: 'phone' | 'date' | 'footer' | 'upload' | 'column';
  gridcol?: string;
  paddingBottom?: string;
  paddingTop?: string;
  customfile?: string;
}
export const StyledFormItem = styled(Form.Item)<FormItemProps>`
  & .ant-row.ant-form-item-row {
    display: grid;
    grid-template-columns: ${(props) =>
      props.gridcol ?? 'auto calc(100% - 150px)'};
    justify-content: space-between;
    padding-bottom: ${(props) => props.paddingBottom ?? 'unset'};
    padding-top: ${(props) => props.paddingTop ?? '0'};
    ${(props) =>
      props.type === 'date' &&
      css`
        display: flex;
        & .ant-form-item {
          width: 100%;
        }
        & .ant-form-item-control-input-content {
          display: flex;
          justify-content: space-between;
          & div:nth-child(2) > div {
            margin-left: auto;
          }
        }
        & .ant-row.ant-form-item-row {
          width: calc(100% - 9px);
        }
      `}
    ${(props) =>
      props.type === 'footer' &&
      css`
        gap: 10px;
        & .ant-form-item-control-input {
          width: 10%;
        }
        &.ant-row.ant-form-item-row {
          justify-content: start;
        }
      `}
    ${(props) =>
      props.type === 'upload' &&
      css`
        .ant-upload-list.ant-upload-list-text {
          display: inline-block;
          margin-left: 10px;
        }
      `}
      ${(props) =>
        props.customfile === 'Y' &&
        css`
          .ant-form-item-label > label::after {
            display: inline-block;
            margin-inline: 4px 0 !important;
            color: var(--red);
            font-size: 14px;
            font-weight: 500;
            font-family: 'Pretendard';
            line-height: 1;
            content: '*' !important;
          }
        `}
  & .ant-form-item-required::before {
    display: none !important;
  }
  & .ant-form-item-required::after {
    display: inline-block;
    margin-inline: 4px 0 !important;
    color: var(--red);
    font-size: 14px;
    font-weight: 500;
    font-family: 'Pretendard';
    line-height: 1;
    content: '*' !important;
  }
  & .ant-picker {
    width: 100%;
    height: 40px;
  }
  ${(props) =>
    props.type === 'phone' &&
    css`
      & .ant-form-item-control-input-content {
        display: flex;
        gap: 10px;
      }
      & .ant-select {
        width: 150px;
      }
      & .ant-select-selection-item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & .ant-select-selection-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & .ant-input-search {
        margin-left: 0;
      }
    `}
  & .ant-form-item-explain-error {
    position: absolute;
    white-space: initial;
  }
  ${(props) =>
    props.type === 'column' &&
    css`
      &.ant-row.ant-form-item-row .ant-form-item-label {
        text-align: left !important;
      }
    `}
`;
export const StyledFormItemDB = styled(Form.Item)<FormItemProps>`
  & .ant-row.ant-form-item-row {
    grid-template-columns: ${(props) =>
      props.gridcol ?? 'auto calc(100% - 150px)'};
    justify-content: space-between;
    padding-bottom: ${(props) => props.paddingBottom ?? 'unset'};
    padding-top: ${(props) => props.paddingTop ?? '0'};
    ${(props) =>
      props.type === 'date' &&
      css`
        display: flex;
        & .ant-form-item {
          width: 100%;
        }
        & .ant-form-item-control-input-content {
          display: flex;
          justify-content: space-between;
          & div:nth-child(2) > div {
            margin-left: auto;
          }
        }
        & .ant-row.ant-form-item-row {
          width: calc(100% - 9px);
        }
      `}
    ${(props) =>
      props.type === 'footer' &&
      css`
        gap: 10px;
        & .ant-form-item-control-input {
          width: 10%;
        }
        &.ant-row.ant-form-item-row {
          justify-content: start;
        }
      `}
    ${(props) =>
      props.type === 'upload' &&
      css`
        .ant-upload-list.ant-upload-list-text {
          display: inline-block;
          margin-left: 10px;
        }
      `}
      ${(props) =>
        props.customfile === 'Y' &&
        css`
          .ant-form-item-label > label::after {
            display: inline-block;
            margin-inline: 4px 0 !important;
            color: var(--red);
            font-size: 14px;
            font-weight: 500;
            font-family: 'Pretendard';
            line-height: 1;
            content: '*' !important;
          }
        `}
  & .ant-form-item-required::before {
    display: none !important;
  }
  & .ant-form-item-required::after {
    display: inline-block;
    margin-inline: 4px 0 !important;
    color: var(--red);
    font-size: 14px;
    font-weight: 500;
    font-family: 'Pretendard';
    line-height: 1;
    content: '*' !important;
  }
  & .ant-picker {
    width: 100%;
    height: 40px;
  }
  ${(props) =>
    props.type === 'phone' &&
    css`
      & .ant-form-item-control-input-content {
        display: flex;
        gap: 10px;
      }
      & .ant-select {
        width: 150px;
      }
      & .ant-select-selection-item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & .ant-select-selection-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & .ant-input-search {
        margin-left: 0;
      }
    `}
  & .ant-form-item-explain-error {
    position: absolute;
  }
  ${(props) =>
    props.type === 'column' &&
    css`
      &.ant-row.ant-form-item-row .ant-form-item-label {
        text-align: left !important;
      }
    `}
`;

export const Disabled = styled(Form.Item)`
  & .ant-select-disabled {
    background: var(--gray-100);
    text-align: center;
    & span {
      color: var(--gray-500);
    }
  }
`;

export const StyledSelect = styled(Select)`
  width: calc(100% - 150px);
  & .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
  }
  & .ant-select-selector {
    border: 1px solid var(--btn-gray-300);
    color: var(--dark-default);
    border-radius: 4px;
  }
  & .ant-select-selector {
    height: 40px !important;
    background-color: #fff;
    box-shadow: none !important;
  }
  & .ant-select-selection-item {
    line-height: 40px !important;
  }
  .ant-select-selection-search-input {
    height: 40px !important;
  }
  & .ant-select-arrow {
    top: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    &:after {
      position: absolute;
      content: '';
      top: 0;
      right: 0;
      width: 40px;
      height: 40px;
      background-image: url(/assets/img/icon/icon-arrow-up-rounded-d.png);
      background-size: 20px;
      background-position: center;
      background-repeat: no-repeat;
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
      pointer-events: none;
    }
    & svg {
      display: none;
    }
  }
`;

export const StyledSelectDB = styled(Select)`
  width: calc(100% - 150px);
  & .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
  }
  & .ant-select-selector {
    border: 1px solid var(--btn-gray-300);
    color: var(--dark-default);
    border-radius: 4px;
  }
  & .ant-select-selector {
    height: 40px !important;
    background-color: #fff;
    box-shadow: none !important;
  }
  & .ant-select-selection-item {
    line-height: 40px !important;
  }
  .ant-select-selection-search-input {
    height: 40px !important;
  }
  & .ant-select-arrow {
    top: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    &:after {
      position: absolute;
      content: '';
      top: 0;
      right: 0;
      width: 40px;
      height: 40px;
      background-image: url(/assets/img/icon/icon-arrow-up-rounded-d.png);
      background-size: 20px;
      background-position: center;
      background-repeat: no-repeat;
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
      pointer-events: none;
    }
    & svg {
      display: none;
    }
  }
`;

export const ChargingStationRegister = styled.ul<{ row?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  ${(props) =>
    props.row &&
    css`
      height: 11.7vh;
      padding-top: 10px;
    `}
  & > li {
    width: 100%;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    & > div {
      width: 100%;
    }
  }
`;

export const StyledRadio = styled(Radio.Group)<UIprops>`
  background-color: var(--gray-100);
  width: fit-content;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 4px;
  border-radius: 6px;
  & Label::before {
    display: none !important;
  }
  ${(props) =>
    props.disabled &&
    css`
      & .ant-radio-button-wrapper.ant-radio-button-wrapper-checked {
        background-color: #dcdedf !important;
        color: var(--dark-default) !important;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15) !important;
      }
    `}
`;

export const StyledRadioBtn = styled(Radio.Button)<UIprops>`
  color: var(--dark-default);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: none;
  border-color: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  padding: 0 10px;
  &:first-child {
    border-inline-start: inherit;
    border-start-start-radius: inherit;
    border-end-start-radius: inherit;
  }
  &:last-child {
    border-start-end-radius: inherit;
    border-end-end-radius: inherit;
  }
  &.ant-radio-button-wrapper:hover {
    color: var(--dark-default);
  }
  &.ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item::before {
    display: none;
  }
  &.ant-radio-button-wrapper.ant-radio-button-wrapper-checked {
    background-color: var(--white);
    height: 34px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    color: var(--blue-200);
    border-radius: 6px;
  }
  &.ant-radio-button-wrapper.ant-radio-button-wrapper-checked:hover {
    background-color: var(--white);
    color: var(--blue-200);
  }
`;

interface btnProps {
  btnType?: 'ftActive' | 'footer' | 'prev' | 'next';
}
export const StyledBtn = styled(Button)<btnProps>`
  color: var(--white);
  border-radius: 6px;
  border: none;
  box-shadow: none;
  padding: 0px 10px;
  height: 40px;
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  ${(props) =>
    props.btnType === 'footer' &&
    css`
      color: #191919;
      border-radius: 40px !important;
      padding: 0;
      width: 40px;
      text-align: center;
      background: none;
      &:hover {
        background-color: #f0faff;
        color: var(--blue-200);
      }
      &:focus-visible {
        outline: none;
        outline-offset: 0;
        transition: none;
      }
    `}
  ${(props) =>
    props.btnType === 'ftActive' &&
    css`
      border: none;
      padding: 0;
      width: 40px;
      height: 40px;
      border-radius: 40px !important;
      text-align: center;
      font-weight: 500;
      font-size: 14px;
      line-height: 40px;
      box-shadow: none;
      background-color: #f0faff;
      color: var(--blue-200);
      &:focus-visible {
        outline: none;
        outline-offset: 0;
        transition: none;
      }
    `}    
  ${(props) =>
    props.btnType === 'prev' &&
    css`
      padding: 0;
      width: 40px;
      border-radius: 40px !important;
      text-align: center;
      font-size: 0;
      background-repeat: no-repeat;
      background-size: 18px;
      background-position: center;
      background-image: url('/assets/img/icon/icon-page-prev-d.png');
      &:hover {
        background-color: #f0faff;
        color: var(--blue-200);
      }
    `}
  ${(props) =>
    props.btnType === 'next' &&
    css`
      border: none;
      padding: 0;
      width: 40px;
      height: 40px;
      border-radius: 40px !important;
      text-align: center;
      font-weight: 500;
      font-size: 14px;
      line-height: 40px;
      box-shadow: none;
      font-size: 0;
      background-repeat: no-repeat;
      background-size: 18px;
      background-position: center;
      background-image: url('/assets/img/icon/icon-page-next-d.png');
      &:hover {
        background-color: #f0faff;
        color: var(--blue-200);
      }
    `}
`;

export const PageBar = styled.ul`
  display: flex;
  justify-content: end;
  & li:first-child button,
  li:last-child button {
    font-size: 0;
    background-repeat: no-repeat;
    background-size: 18px;
    background-position: center;
  }
  & li:first-child button {
    background-image: url('/assets/img/icon/icon-page-first-d.png');
  }
  & li:last-child button {
    background-image: url('/assets/img/icon/icon-page-last-d.png');
  }
`;

export const FileUPloadBtn = styled(Button)`
  background: transparent;
  border: 0;
  box-shadow: none;
  padding: 0;
  & span {
    text-decoration: underline;
  }
  & span:hover {
    color: #222;
  }
`;
export const StyledInputDate = styled.div<{ iNumber?: number }>`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: flex-start;
  -webkit-box-align: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  gap: 10px;
  position: relative;

  & label {
    font-weight: 500;
    font-size: 14px;
    line-height: 40px;
    margin-bottom: 0;
    width: 140px;
    min-width: 140px;
  }
  & > div {
    width: calc(100% - 150px);
    position: relative;
    height: auto;
    padding: 0px;
  }
  & .ant-picker {
    height: 40px;
    border: 1px solid var(--btn-gray-300);
    border-radius: 4px;
    width: 100%;
    &:hover,
    &:focus {
      border-color: var(--blue-200);
      box-shadow: none;
    }
  }
  & .anticon-calendar {
    display: inline-block;
    background-image: url(./assets/img/icon/icon-calendar-month.png);
    width: 15px;
    height: 15px;
    background-size: 15px 15px;

    & svg {
      display: none;
    }
  }
  input::placeholder {
    font-size: 13px;
    letter-spacing: -1px;
  }
  ${(props) =>
    props.iNumber &&
    css`
    label {
      font-weight: 500;
      font-size: 14px;
      line-height: 40px;
      margin-bottom: 0;
      width: 140px;
    }
      & > div {
        width: calc(
          (100% - 150px) / ${props.iNumber} - (5px * (${props.iNumber} - 1)))
        );
      }
    `}
  .ant-picker {
    padding: 0px 10px;
  }
  .ant-picker .ant-picker-suffix {
    margin-left: 0;
  }
`;
export const StyledSelectInput = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: flex-start;
  -webkit-box-align: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  gap: 10px;
  position: relative;
  & > div {
    width: 140px;
    position: relative;
    height: auto;
    padding: 0px;
  }
  & > input {
    width: calc(100% - 150px);
    height: 40px;
  }
`;
export const RemoveIMGButton = styled.div`
  position: absolute;
  right: -4px;
  top: -5px;
  button {
    margin: 0;
  }
`;
export const StyltedIMG = styled.label<{ fileUrl: any; name?: string }>`
  display: inline-block;
  input {
    display: none !important;
  }
  img {
    width: auto;
    height: 150px;
    display: block;
    border: 1px solid var(--btn-gray-300);
    border-radius: 6px;
  }
  ${(props) => {
    if (props.name === 'qrcode') {
      return css`
        img {
          height: 100px;
        }
      `;
    }
  }}
`;
export const StyltedIMGMany = styled.label`
  cursor: pointer;
  position: relative;
  display: inline-block;
  input {
    display: none !important;
  }
  img {
    width: auto;
    height: 150px;
    display: block;
    border: 1px solid var(--btn-gray-300);
    border-radius: 6px;
  }
`;

export const AddressNotFound = styled.div<FormProps>`
  background-color: #f5f5f5;
  height: 340px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const StyleDivAdress = styled.div<FormProps>`
  width: calc(100% - 150px);
  position: absolute;
  z-indes: 10000;
  background-color: #fff;
  top: 0;
  margin-top: 43px;
  left: 150px;
  padding: 10px 10px;
  border: 1px solid var(--btn-gray-300);
  border-radius: 6px;
  max-height: 210px;
  overflow: scroll;
`;
export const IconDownload = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 24px;
  height: 24px;
  background-image: url(assets/img/icon/icon-download-white.png);
  background-repeat: no-repeat;
  background-size: 16px;
  background-position: center;
  border-radius: 5px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.75);
  opacity: 0;
  transition: 300ms;
  &:hover {
    opacity: 1;
  }
`;
