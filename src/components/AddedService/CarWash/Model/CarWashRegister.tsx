import { useEffect } from 'react';
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
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}
const CarWasRegister = ({
  state,
  setState,
  isModalOpen,
  setIsModalOpen,
}: ModalProps) => {
  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [form] = Form.useForm();

  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }

  async function onFinish(values: any) {
    const addData = {
      car_number: values?.car_number,
    };

    await postApiUpdate(
      {
        url: `/v1/car-wash`,
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

  return (
    <>
      <Modal open={isModalOpen} title="세차권" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="CarWasAdd"
          colon={false}
          type="modal"
        ></StyledForm>
        <StyledFormItem
          name="car_number"
          label="차량번호"
          rules={[
            {
              required: true,
              message: '차량번호를 입력해주세요.',
            },
          ]}
        >
          <StyledInput />
        </StyledFormItem>
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

export default CarWasRegister;
