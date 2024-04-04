import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { postApiUpdate, postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import {
  type UpdateStateInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';
// interface ModalProps {
//   state: StateInterface;
//   setState: Dispatch<SetStateAction<StateInterface>>;
//   isModalOpen: boolean;
//   setIsModalOpen: Dispatch<SetStateAction<boolean>>;
// }
interface ModalProps {
  setIsRegistCoporation: Dispatch<SetStateAction<boolean>>;
  isRegistCoporation: boolean;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  refetch: () => void;
}

export const RegisterCoporation = ({
  setIsRegistCoporation,
  isRegistCoporation,
  state,
  setState,
  refetch,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleCloseModal() {
    setIsRegistCoporation(false);
    form.resetFields();
  }
  async function onFinish(values: any) {
    const MobileData = {
      status: values.status,
      accountId: values.accountId,
      name: values.name,
      phoneNo: values.phoneNo,
      email: values.email,
      password: values.password,
    };

    await postApi(
      {
        url: `/v1/web/users/mobile`,
        data: MobileData,
      },
      setState,
    );
  }

  useEffect(() => {
    if (state.isSuccess) {
      setState({
        ...state,
        isSuccess: false,
      });
      refetch();
      handleCloseModal();
    }
    // if (state.error) {
    //   const textError = state?.error?.errorMessage ?? state?.error?.message;
    // console.log(state.error);
    //   setAlertModal({
    //     ...alertModal,
    //     open: true,
    //     type: 'error',
    //     title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
    //     content: textError ?? 'api 호출 에러 : 콘솔창 확인',
    //   });
    // }
  }, [state]);

  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  return (
    <>
      {/* <Button
        size="md"
        color="reset"
        icon="/assets/img/icon/icon-trash.png"
        alt="비활성"
      >
        삭제
      </Button> */}
      <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="등록"
        onClick={() => {
          setIsRegistCoporation(true);
        }}
      >
        등록
      </Button>
      <Modal open={isRegistCoporation} title="등록" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="hdo-mobile"
          colon={false}
          type="modal"
          gridcol="1fr 1fr"
        >
          <StyledFormItem name="status" label="이용여부">
            <StyledSelect>
              <Select.Option value="ACTIVE">이용</Select.Option>
              <Select.Option value="BLOCK">중지</Select.Option>
            </StyledSelect>
          </StyledFormItem>
          <StyledFormItem
            name="accountId"
            label="유저 ID"
            rules={[
              {
                required: true,
                message: '사번을 입력해주세요.',
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/g,
                message: 'Id는 6~12자리 문자와 숫자를 조합해서 입력해주세요',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>
          <StyledFormItem
            name="name"
            label="이름"
            rules={[
              {
                required: true,
                message: '이름를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>
          <StyledFormItem
            name="phoneNo"
            label="전화번호"
            rules={[
              {
                required: true,
                message: '전화번호을 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
          >
            <StyledInput maxLength={11} />
          </StyledFormItem>

          <StyledFormItem
            name="email"
            label="이메일"
            rules={[
              {
                required: true,
                message: '이메일를 입력해주세요.',
              },
              {
                type: 'email',
                message: '이메일 형식이 아닙니다.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>

          <StyledFormItem
            name="password"
            label="비밀번호"
            rules={[
              {
                required: true,
                message: '비밀번호를 입력해주세요.',
              },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z!@#$%^&*\d]{8,12}$/g,
                message:
                  '비밀번호는 영문,숫자,특수문자 조합으로 8~12자리 문자여야합니다.',
              },
            ]}
          >
            <StyledInput type="password" autoComplete="new-password" />
          </StyledFormItem>
        </StyledForm>
        <ModalFooter
          okText="저장"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};
