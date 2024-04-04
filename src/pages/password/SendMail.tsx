import { Form } from 'antd';
import { Button } from 'components/common/Button/Button';
import { StyledInput } from 'components/common/test/Styled.ant';
// import { Input } from 'components/common/Input/Input';
import {
  LoginBox,
  LoginLogo,
  StationAnimation,
} from 'pages/login/LoginPage.styled';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Body, Container } from 'styles/style';
import { type StateInterface } from 'interfaces/ICommon';
// import { useRecoilState, useSetRecoilState } from 'recoil';
// import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';

export const SendMail = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [form] = Form.useForm();

  // console.log(searchParams);
  async function onFinish(values: any) {
    // console.log(values);
    const confirmData = {
      email: values.email,
    };
    const url = `/v1/web/auth/accounts/external/password/requests`;
    const axios = hdoInstance();
    axios
      .post(url, confirmData, { headers: { ContentType: 'application/json' } })
      .then(() => {
        setState({ isLoading: false, error: null, isSuccess: true });
      })
      .catch((err) => {
        setState({
          isLoading: false,
          isSuccess: false,
          error: err.response.data,
        });
      });
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error: any) => {
        alert(error?.errorFields[0].errors);
        console.log(error.errorFields);
      });
  };

  useEffect(() => {
    if (state.error) {
      // console.log(state.error);
      alert(state.error.message);
    }
    if (state.isSuccess) {
      alert('입력한 이메일로 비밀번호 초기화 메일을 전달했습니다.');
    }
  }, [state]);

  return (
    <>
      <Body login>
        <Container login>
          <LoginBox style={{ height: 570 }}>
            <LoginLogo />
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                borderBottom: '1px solid #DBE0E9',
              }}
            >
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 500,
                  marginBottom: '20px',
                }}
              >
                비밀번호 찾기
              </h1>
            </div>

            <Form
              form={form}
              name="SendEmail"
              colon={false}
              layout="vertical"
              requiredMark={false}
              autoComplete="off"
              style={{
                width: '100%',
                marginTop: 'auto',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <PasswordFormItem name="email" label="이메일">
                <StyledInput placeholder="이메일을 입력하세요 " />
              </PasswordFormItem>
              <DivButton>
                <Button
                  onClick={() => {
                    navigate('/login');
                  }}
                  w100
                  color="reset"
                >
                  취소
                </Button>
                <Button onClick={handleSubmit} w100>
                  확인
                </Button>
              </DivButton>
            </Form>
          </LoginBox>
          <StationAnimation />
        </Container>
      </Body>
    </>
  );
};

export default SendMail;

const PasswordFormItem = styled(Form.Item)`
  & .ant-form-item-extra,
  .ant-form-item-explain-error {
    color: var(--red);
    padding: 0.4rem 0 0 0.6rem;
    font-size: 0.8rem;
    letter-spacing: -0.083em;
    line-height: 1;
  }
  &.ant-form-item {
    margin-bottom: 20px;
  }
  span {
    top: 0;
    bottom: 0;
  }
`;
const DivButton = styled.div`
  padding-top: 10px;
  display: flex;
  gap: 14px;
`;
