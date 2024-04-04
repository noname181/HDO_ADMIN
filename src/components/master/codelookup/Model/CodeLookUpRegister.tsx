import { useEffect, useState } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
// 패키지
import { Form } from 'antd';

// api
import { defaultUrl } from 'apis/api.helpers';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { postApiUpdate } from 'apis/postApi';
import { type StateInterface } from 'interfaces/ICommon';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Button } from 'components/common/Button/Button';
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
}
const CodeLookUpRegister = ({ state, setState }: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [form] = Form.useForm();

  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }

  async function onFinish(values: any) {
    const addData = {
      divCode: values?.divCode,
      divComment: values?.divComment,
    };

    await postApiUpdate(
      {
        url: `/codelookup`,
        data: addData,
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

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
    if (state.error) {
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="등록"
        onClick={handleOpenModal}
      >
        신규등록
      </Button>
      <Modal open={isModalOpen} title="공통코드" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="CodeLookUpAdd"
          colon={false}
          type="modal"
          gridcol="1fr 1fr"
        >
          <StyledFormItem
            name="divCode"
            label="구분코드"
            rules={[
              {
                required: true,
                message: '구분코드를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>
          <StyledFormItem
            name="divComment"
            label="구분설명"
            rules={[
              {
                required: true,
                message: '구분설명를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>
        </StyledForm>
        <ModalFooter
          okText="등록"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};

export default CodeLookUpRegister;
