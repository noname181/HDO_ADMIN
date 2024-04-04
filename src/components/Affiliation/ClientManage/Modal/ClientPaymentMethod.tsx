import { useState } from 'react';

// 패키지

import { Form, Radio, type RadioChangeEvent } from 'antd';

import {
  StyledFormItem,
  StyledInput,
  StyledForm,
} from 'components/common/test/Styled.ant';
// import { putApi } from 'apis/putApi';
// import { category } from 'utils/stationUtils';
import { Button } from 'components/common/Button/Button';

const ClientPaymentMethod = ({ setShowPaymentManage }: any) => {
  const handlePaymentMange = () => {
    setShowPaymentManage(true);
  };
  const [form] = Form.useForm();

  async function onFinish(values: any) {
    // const editData = {
    //   fullname: values.name,
    //   name: values.name,
    //   contactName: values.contactName,
    //   contactPhoneNo: values.contactPhoneNo,
    //   contactEmail: values.contactEmail,
    //   closed: values.closed,
    //   bizRegNo: values.bizRegNo,
    //   address: values.address,
    // };
    // await putApi(
    //   {
    //     url: `/orgs/${clientData.id as string}`,
    //     data: editData,
    //   },
    //   setState,
    // );
  }
  // function handleOk() {
  //   form
  //     .validateFields()
  //     .then((values: any) => {
  //       void onFinish(values);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  return (
    <>
      <StyledForm
        form={form}
        name="clientPaymentMethod"
        colon={false}
        gridcol="100%"
      >
        <div>
          <p style={{ fontWeight: '500' }}>단가할인</p>
          <div
            style={{
              display: 'flex',
            }}
          >
            <Radio.Group
              // value={usePreset}
              // onChange={handleUsePreset}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '38px',
                paddingTop: '10px',
              }}
            >
              <Radio value=""></Radio>
              <Radio value="정액 할인"></Radio>
              <Radio value="고정 단가"></Radio>
            </Radio.Group>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <StyledFormItem name="없음" label="없음"></StyledFormItem>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '300px auto',
                  gridGap: '20px',
                }}
              >
                <StyledFormItem
                  name="정액 할인"
                  label="정액 할인"
                  rules={[
                    {
                      pattern: /[1-9]\d*/g,
                      message: '0보다 큰 숫자를 입력해야합니다.',
                    },
                  ]}
                  gridcol="auto calc(100% - 80px)"
                >
                  <StyledInput suffix="원/kwh" />
                </StyledFormItem>
                <p style={{ lineHeight: '40px' }}>*기본단가에서 할인</p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '300px auto',
                  gridGap: '20px',
                }}
              >
                <StyledFormItem
                  name="고정 단가"
                  label="고정 단가"
                  rules={[
                    {
                      pattern: /[1-9]\d*/g,
                      message: '0보다 큰 숫자를 입력해야합니다.',
                    },
                  ]}
                  gridcol="auto calc(100% - 80px)"
                >
                  <StyledInput suffix="원/kwh" />
                </StyledFormItem>
                <p style={{ lineHeight: '40px' }}>*모든 충전기 동일 단가</p>
              </div>
            </div>
          </div>

          <p style={{ fontWeight: '500', marginTop: '30px' }}>법인 상품</p>
          <div
            style={{
              display: 'flex',
            }}
          >
            <Radio.Group
              // value={usePreset}
              // onChange={handleUsePreset}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
                paddingTop: '10px',
              }}
            >
              <Radio value="1"></Radio>
              <Radio value="2"></Radio>
            </Radio.Group>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <StyledFormItem name="미가입" label="미가입"></StyledFormItem>
              <StyledFormItem name="가입" label="가입"></StyledFormItem>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto auto auto',
              padding: '20px 24px',
              border: '1px solid var(--gray-200)',
              gridGap: '20px',
            }}
          >
            <StyledFormItem
              label="월 요금"
              name="월 요금"
              rules={[
                {
                  pattern: /[1-9]\d*/g,
                  message: '0보다 큰 숫자를 입력해야합니다.',
                },
              ]}
              gridcol="auto calc(100% - 80px)"
            >
              <StyledInput suffix="원" />
            </StyledFormItem>
            <StyledFormItem
              name="세차 쿠폰"
              label="세차 쿠폰"
              rules={[
                {
                  pattern: /[1-9]\d*/g,
                  message: '0보다 큰 숫자를 입력해야합니다.',
                },
              ]}
            >
              <StyledInput suffix="매" />
            </StyledFormItem>
            <StyledFormItem
              name="무료 사용량"
              label="무료 사용량"
              rules={[
                {
                  pattern: /[1-9]\d*/g,
                  message: '0보다 큰 숫자를 입력해야합니다.',
                },
              ]}
              gridcol="auto calc(100% - 80px)"
            >
              <StyledInput suffix="kwh" />
            </StyledFormItem>
          </div>
          <p style={{ fontWeight: '500', marginTop: '30px' }}>결제 방법</p>
          <div
            style={{
              display: 'flex',
            }}
          >
            <Radio.Group
              // value={usePreset}
              // onChange={handleUsePreset}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
                paddingTop: '10px',
              }}
            >
              <Radio value="건별 결제"></Radio>
              <Radio value="월 합산 정산"></Radio>
            </Radio.Group>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <StyledFormItem
                name="건별 결제"
                label="건별 결제"
              ></StyledFormItem>
              <StyledFormItem
                name="월 합산 정산"
                label="월 합산 정산"
                gridcol="auto calc(100% - 80px)"
              >
                <p style={{ lineHeight: '40px' }}>
                  *매월 말일 일괄 결제 됩니다.
                </p>
              </StyledFormItem>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto auto auto',
              gridGap: '20px',
            }}
          >
            <StyledFormItem
              name="pCardNumber"
              label="결제 수단"
              gridcol="auto calc(100% - 104px)"
            >
              <StyledInput readOnly />
            </StyledFormItem>
            <StyledFormItem
              name="결제수단 관리"
              label="의 2개"
              gridcol="auto calc(100% - 80px)"
            >
              <Button
                size="md"
                color="primary"
                alt="결제수단 관리"
                onClick={handlePaymentMange}
              >
                결제수단 관리
              </Button>
            </StyledFormItem>
          </div>
        </div>
      </StyledForm>
    </>
  );
};

export default ClientPaymentMethod;
