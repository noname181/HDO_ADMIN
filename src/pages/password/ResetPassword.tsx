import { Form, notification } from 'antd';
import { Button } from 'components/common/Button/Button';
import { StyledInput } from 'components/common/test/Styled.ant';
// import { Input } from 'components/common/Input/Input';
import {
  ErrorMessage,
  LoginBox,
  LoginLogo,
  StationAnimation,
} from 'pages/login/LoginPage.styled';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Body, Container } from 'styles/style';
import { type StateInterface } from 'interfaces/ICommon';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import { ShowPasswordIcon } from 'components/common/Input/Input.styled';
import { userAuthState } from 'recoil/authState';

// 로컬빌드용 예시 url : http://localhost:3000/password_reset?email=sarc2@ntcon.co&regId=6172aba2-6af1-4f99-81fc-ad707a8140dc
// 발송용 API : [POST] {{apiAddress}}/contractors/confirm
// body 값은 예시 참조

export const ResetPassword = () => {
  // const setAuthState = useSetRecoilState(userAuthState);
  // const signOut = async () => {
  //   try {
  //     localStorage.removeItem('accessToken');
  //     localStorage.removeItem('refreshToken');
  //     setAuthState({
  //       isAuthenticated: false,
  //       user: null,
  //     });
  //   } catch (error) {
  //     console.log('로그아웃 실패 : ', error);
  //   }
  // };
  // useEffect(() => {
  //   void signOut();
  // }, []);
  const navigate = useNavigate();
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState<null | string>(null);

  const [isLoading, setIsLoading] = useState(false);

  form.setFieldsValue({
    token: searchParams.get('token'),
    email: searchParams.get('email'),
  });

  // console.log(searchParams);
  async function onFinish(values: any) {
    const confirmData = {
      token: values.token,
      email: values.email,
      password: values.password,
    };
    const url = `/v1/auth/password/reset`;
    const axios = hdoInstance();
    axios
      .post(url, confirmData, { headers: { ContentType: 'application/json' } })
      .then((res) => {
        // setAlertModal({
        //   ...alertModal,
        //   open: true,
        //   type: 'success',
        //   title: '알림',
        //   content: '완료되었습니다.',
        // });
        alert('비밀번호가 정상적으로 변경되었습니다.');
        setIsLoading(false);
        navigate('/login');
      })
      .catch((err) => {
        setError(err.response.data.message);
        setIsLoading(false);
      });
  }

  const handleSubmit = () => {
    setIsLoading(true);
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch(() => {
        setIsLoading(false);
        // setError(error.errorFields[0].errors);
      });
  };

  const validatePassword = async (_: any, value: any) => {
    const regExp =
      /^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    if (!value) {
      return await Promise.reject(new Error('비밀번호는 필수 항목입니다.'));
    }
    if (!regExp.test(value)) {
      return await Promise.reject(
        new Error(
          '영문 대소문자, 숫자, 특수문자 조합으로 8자리 이상 입력해 주세요.',
        ),
      );
    }
    await Promise.resolve();
  };

  // passwordCheck 유효성 검사
  const validatePasswordCheck = async (_: any, value: any) => {
    if (
      form.getFieldValue('password') &&
      form.getFieldValue('password') !== value
    ) {
      return await Promise.reject(
        new Error('기존 비밀번호가 다릅니다. 확인 후 다시 입력해주세요.'),
      );
    }
    await Promise.resolve();
  };

  useEffect(() => {
    if (state.error) {
      // console.log(state.error);
      alert(state.error.message);
      // setAlertModal({
      //   ...alertModal,
      //   type: 'error',
      //   title: state.error.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
      //   content: state.error.message ?? 'api 호출 에러 : 콘솔창 확인',
      // });
    } else {
      setAlertModal({
        ...alertModal,
        type: 'error',
        title: state?.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: state?.error?.message ?? 'api 호출 에러 : 콘솔창 확인',
      });
      return;
    }
    if (state.isSuccess) {
      // setAlertModal({
      //   ...alertModal,
      //   open: true,
      //   type: 'success',
      //   title: '알림',
      //   content: '비밀번호가 정상적으로 변경되었습니다.',
      // });
      alert('비밀번호가 정상적으로 변경되었습니다.');
      navigate('/login');
    }
  }, [state]);
  // useEffect(() => {
  //   setAlertModal({
  //     ...alertModal,
  //     open: true,
  //     type: 'success',
  //     title: '알림',
  //     content: '완료되었습니다.',
  //   });
  //   console.log(123);
  // }, []);
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleShowPassword2 = () => {
    setShowPassword2((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Body login>
        <Container login>
          <LoginBox style={{ height: 570 }}>
            <LoginLogo />
            <Form
              form={form}
              name="reset-password"
              colon={false}
              layout="vertical"
              requiredMark={false}
              autoComplete="off"
              style={{ width: '100%', marginTop: 'auto' }}
            >
              <PasswordFormItem name="token" label="token" hidden>
                <StyledInput disabled />
              </PasswordFormItem>
              <PasswordFormItem name="email" label="이메일주소(ID)">
                <StyledInput disabled />
              </PasswordFormItem>
              <div className="nl-ip-pw">
                <PasswordFormItem
                  name="password"
                  label="비밀번호"
                  rules={[{ validator: validatePassword }]}
                >
                  <StyledInput
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    placeholder="비밀번호"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </PasswordFormItem>
                <ShowPasswordIcon
                  showPassword={showPassword}
                  onClick={toggleShowPassword}
                  disabled={false}
                />
              </div>
              <div className="nl-ip-pw">
                <PasswordFormItem
                  name="password-check"
                  label="비밀번호 확인"
                  dependencies={['password']}
                  rules={[{ validator: validatePasswordCheck }]}
                >
                  <StyledInput
                    type={showPassword2 ? 'text' : 'password'}
                    value={passwordCheck}
                    placeholder="비밀번호"
                    onChange={(e) => {
                      setPasswordCheck(e.target.value);
                    }}
                  />
                </PasswordFormItem>
                <ShowPasswordIcon
                  showPassword={showPassword2}
                  onClick={toggleShowPassword2}
                  disabled={false}
                />
              </div>
              <DivButton>
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  onClick={handleSubmit}
                  w100
                >
                  저장
                </Button>
                <ErrorMessage>{error}</ErrorMessage>
              </DivButton>
            </Form>
          </LoginBox>
          <StationAnimation />
        </Container>
      </Body>
    </>
  );
};

export default ResetPassword;

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
`;
