import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';

import { Form } from 'antd';
import { postApiUpdate } from 'apis/postApi';
// 타입
import { type StateInterface } from 'interfaces/ICommon';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { ShowPasswordIcon } from 'components/common/Input/Input.styled';
import { LabelWrap } from 'components/common/Form/Form';
import { useRecoilState } from 'recoil';

import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { hdoInstance } from 'apis/hdoInstance';
import { alertModalState } from 'recoil/modalState';

interface ModalProps {
  //   state: StateInterface;
  //   setState: Dispatch<SetStateAction<StateInterface>>;
  isModalChangePw: boolean;
  setIsModalChangePw: Dispatch<SetStateAction<boolean>>;
}

export const ChangePassword = ({
  isModalChangePw,
  setIsModalChangePw,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [state, setState] = useState<StateInterface>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const [username, setUsername] = useState('');

  // function handleOpenModal() {
  //   setIsModalOpen(true);
  // }
  function handleCloseModal() {
    // console.log('123');
    setIsModalChangePw(false);
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    // console.log(isModalChangePw);

    form.resetFields();
  }
  async function onFinish(values: any) {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    // const axios = hdoInstance();

    if (!accessToken) {
      return;
    }

    const newData = {
      old_password: values.oldpassword,
      new_password: values.newpassword,
      confirm_password: values.confirmpw,
    };
    await postApiUpdate(
      {
        url: `/v1/web/auth/change-password`,
        data: newData,
      },
      setState,
    );
  }
  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const toggleShowOldPassword = () => {
    setShowOldPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
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
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '비밀번호가 정상적으로 변경되었습니다',
      });
      handleCloseModal();
    }
    if (state.error?.errorCode) {
      const textError = state?.error?.errorMessage ?? state?.error?.message;
      console.log(state.error);
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
      });
    }
  }, [state]);
  return (
    <>
      <Modal
        open={isModalChangePw}
        title="비밀번호 변경하기"
        close={handleCloseModal}
        style={{ width: '600px' }}
      >
        <StyledForm
          form={form}
          name="change-password"
          colon={false}
          type="modal"
          gridcol="1fr"
          autoComplete="off"
        >
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            className="nl-ctn-change-pw"
          >
            <li style={{ position: 'relative' }}>
              <StyledFormItem
                name="oldpassword"
                label="기존 비밀번호"
                dependencies={['password']}
                rules={[{ validator: validatePassword }]}
              >
                <StyledInput
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="기존 비밀번호"
                />
              </StyledFormItem>
              <ShowPasswordIcon
                showPassword={showOldPassword}
                onClick={toggleShowOldPassword}
                disabled={false}
                style={{ top: 0 }}
              />
            </li>
            <li style={{ position: 'relative' }}>
              <StyledFormItem
                name="newpassword"
                label="새 비밀번호"
                rules={[{ validator: validatePassword }]}
              >
                <StyledInput
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="새 비밀번호"
                />
              </StyledFormItem>
              <ShowPasswordIcon
                showPassword={showNewPassword}
                onClick={toggleShowNewPassword}
                disabled={false}
                style={{ top: 0 }}
              />
            </li>
            <li style={{ position: 'relative' }}>
              <StyledFormItem
                name="confirmpw"
                label="새 비밀번호 확인"
                rules={[{ validator: validatePassword }]}
              >
                <StyledInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="새 비밀번호 확인"
                />
              </StyledFormItem>
              <ShowPasswordIcon
                showPassword={showConfirmPassword}
                onClick={toggleShowConfirmPassword}
                disabled={false}
                style={{ top: 0 }}
              />
            </li>
          </ul>
        </StyledForm>
        <ModalFooter
          okText="비밀번호 변경하기"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};
