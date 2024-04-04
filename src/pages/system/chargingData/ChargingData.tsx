import React from 'react';
import { Form, Select, DatePicker } from 'antd';
import { Button } from 'components/common/Button/Button';

import {
  FormContainer,
  FormItemWrap,
} from 'components/Charger/ChargingStation/Station.styled';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { ItemBody, ItemContainer, ItemSide } from '../item/styled';
import { FormFooterWrap } from 'components/common/Form/Form';

const ChargingData = () => {
  const [form] = Form.useForm();
  const dateFormat = 'YYYY-MM-DD';
  return (
    <>
      <ItemContainer>
        <StyledForm
          form={form}
          name="charge-register"
          colon={false}
          type="modal"
          initialValues={{
            status: true,
            reserve: true,
            pnc: true,
          }}
        >
          <ItemBody>
            <ItemSide right="20px">
              <StyledFormItem
                label="제조사"
                name="category"
                paddingBottom="20px"
              >
                <StyledSelect placeholder="협력사를 선택해주세요">
                  <Select.Option value="선택">선택</Select.Option>
                </StyledSelect>
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem
                name="status"
                label="충전기예약"
                paddingBottom="20px"
              >
                <StyledRadio buttonStyle="solid">
                  <StyledRadioBtn value={false}>가능</StyledRadioBtn>
                  <StyledRadioBtn value={true}>불가능</StyledRadioBtn>
                </StyledRadio>
              </StyledFormItem>
              <StyledFormItem
                label="최근등록일"
                name="최근등록일"
                paddingBottom="20px"
              >
                <DatePicker
                  format={dateFormat}
                  picker="date"
                  placeholder={dateFormat}
                />
              </StyledFormItem>
            </ItemSide>
            <ItemSide right="20px">
              <StyledFormItem label="모델" name="category" paddingBottom="20px">
                <StyledSelect placeholder="협력사를 선택해주세요">
                  <Select.Option value="선택">선택</Select.Option>
                </StyledSelect>
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem name="pnc" label="PnC" paddingBottom="20px">
                <StyledRadio buttonStyle="solid">
                  <StyledRadioBtn value={false}>가능</StyledRadioBtn>
                  <StyledRadioBtn value={true}>불가능</StyledRadioBtn>
                </StyledRadio>
              </StyledFormItem>
              <StyledFormItem
                label="등록담당자"
                name="시작일"
                paddingBottom="20px"
              >
                <StyledInput placeholder="EV사업팀 김지은" disabled={true} />
              </StyledFormItem>
            </ItemSide>
            <ItemSide right="20px">
              <StyledFormItem label="속도" name="category" paddingBottom="20px">
                <StyledSelect placeholder="협력사를 선택해주세요">
                  <Select.Option value="선택">선택</Select.Option>
                </StyledSelect>
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem name="reserve" label="광고" paddingBottom="20px">
                <StyledRadio buttonStyle="solid">
                  <StyledRadioBtn value={false}>가능</StyledRadioBtn>
                  <StyledRadioBtn value={true}>불가능</StyledRadioBtn>
                </StyledRadio>
              </StyledFormItem>
            </ItemSide>
            <ItemSide>
              <StyledFormItem
                label="펌웨어"
                name="category"
                paddingBottom="20px"
              >
                <StyledSelect placeholder="협력사를 선택해주세요">
                  <Select.Option value="선택">선택</Select.Option>
                </StyledSelect>
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
              <StyledFormItem label="스팩" name="스팩" paddingBottom="20px">
                <StyledInput placeholder="입력" />
              </StyledFormItem>
            </ItemSide>
          </ItemBody>
        </StyledForm>
        <FormFooterWrap>
          <Button size="md" color="reset">
            취소
          </Button>
          <Button size="md" color="primary">
            저장
          </Button>
        </FormFooterWrap>
      </ItemContainer>
    </>
  );
};

export default ChargingData;
