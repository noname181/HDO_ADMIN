import { useState, useEffect } from 'react';

// 패키지
import { Form } from 'antd';

// api
import { defaultUrl } from 'apis/api.helpers';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { Button } from 'components/common/Button/Button';
import { postApiUpdate } from 'apis/postApi';

const PaymentHistoryRegister = ({ stationData, state, setState }: any) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }

  async function onFinish(values: any) {
    const addData = {
      retired: false,
      name: values.name,
      phoneNo: values.phoneNo,
      role: 'ADMIN',
      accountId: values.accountId,
      orgId: stationData.id,
    };

    await postApiUpdate(
      {
        url: `/external/request`,
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
  }, [state]);

  return (
    <>
      <Button onClick={handleOpenModal}>신규등록</Button>
      <Modal open={isModalOpen} title="결제내역 조회" close={handleCloseModal}>
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

export default PaymentHistoryRegister;
