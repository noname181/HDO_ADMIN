import { type Dispatch, type SetStateAction } from 'react';

import { Form } from 'antd';
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';

import { type StateInterface } from 'interfaces/ICommon';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddData = ({
  state,
  setState,
  isModalOpen,
  setIsModalOpen,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }
  async function onFinish(values: any) {
    const newData = {
      number: values.number,
      regtime: '',
      division: values.division,
      information: values.information,
      isUsed: values.isUsed,
      count: 0,
    };
    await postApi(
      {
        url: `/coupon`,
        data: newData,
      },
      setState,
    );
    handleCloseModal();
  }
  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        void onFinish(values);
      })
      .catch((error: any) => {
        setAlertModal({
          ...alertModal,
          type: 'error',
          title: 'Form 에러',
          content: error,
        });
      });
  }
  return (
    <Modal open={isModalOpen} title="쿠폰" close={handleCloseModal}>
      <StyledForm
        form={form}
        name="couponAddData"
        colon={false}
        type="modal"
        gridcol="1fr"
        initialValues={{
          isUsed: false,
        }}
      >
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <li>
            <StyledFormItem name="number" label="쿠폰 번호">
              <StyledInput />
            </StyledFormItem>
          </li>
          <li>
            <StyledFormItem name="division" label="구분">
              <StyledInput />
            </StyledFormItem>
          </li>
          <li>
            <StyledFormItem name="information" label="쿠폰 정보">
              <StyledInput style={{ height: '10vh' }} />
            </StyledFormItem>
          </li>
          <StyledFormItem label="사용여부" name="isUsed">
            <StyledRadio>
              <StyledRadioBtn value={false}>운영</StyledRadioBtn>
              <StyledRadioBtn value={true}>정지</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem>
        </ul>
      </StyledForm>
      <ModalFooter
        okText="저장"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </Modal>
  );
};
