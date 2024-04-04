import { Form, Input, InputNumber, Radio, Select } from 'antd';
import styled from 'styled-components';

export const StyledSelect = styled(Select)`
  width: calc(100% - 150px);
  & .ant-select-selector .ant-select-selection-search-input {
    /* height: 40px !important; */
  }
  & .ant-select-selector {
    height: 40px !important;
  }
  & .ant-select-selection-item {
    line-height: 40px !important;
  }
`;

export const StyledRadio = styled(Radio.Group)`
  & .ant-radio-button-wrapper {
    height: 40px !important;
    line-height: 40px !important;
  }
`;

export const StyledInput = styled(Input)<{ readonly?: boolean }>`
  /* width: calc(100% - 150px); */
  height: 40px;
`;

export const StyledInputNumber = styled(InputNumber)<{ readonly?: boolean }>`
  height: 40px;
  & .ant-input-number-input {
    height: 40px;
  }
`;

export const StyledForm = styled(Form)`
  & .ant-form-item {
    margin-bottom: 20px;
  }
  & .ant-form-item-label {
    & > label {
      height: 40px;
    }
  }
  & .ant-form-item-no-colon {
    width: 150px;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--btn-gray-300);
`;

export const FormItemWrap = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
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

export const FormMapsWrap = styled.div`
  position: relative;
  width: 367px;
  height: 340px;
  & > img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
