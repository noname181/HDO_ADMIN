import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';

// 패키지
import { Form, Select } from 'antd';

// api
import { defaultUrl } from 'apis/api.helpers';

// 타입
import { type UpdateStateInterface } from 'interfaces/ICommon';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';

import { Button } from 'components/common/Button/Button';
import { postApiUpdate } from 'apis/postApi';

interface StationRegisterModalProps {
  state: UpdateStateInterface;
  setState: Dispatch<SetStateAction<UpdateStateInterface>>;
}

const StationRegister = ({ state, setState }: StationRegisterModalProps) => {
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
    await postApiUpdate(
      {
        url: `/orgs`,
        data: { STN_CUST_NO: values.STN_CUST_NO },
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
      {/* <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="등록"
        onClick={handleOpenModal}
      >
        신규등록
      </Button> */}
      <Modal open={isModalOpen} title="사업장 등록" close={handleCloseModal}>
        <StyledForm form={form} name="station-register" colon={false}>
          <StyledFormItem
            label="사업장 고객번호"
            name="STN_CUST_NO"
            rules={[
              {
                required: true,
                message: '사업장 고객번호를 입력해주세요.',
              },
            ]}
          >
            <StyledInput placeholder="사업장 고객번호 입력" />
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

export default StationRegister;
