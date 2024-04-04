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

const StationAdminRegister = ({ stationData, state, setState }: any) => {
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
        url: `/v1/web/auth/accounts/external/requests`,
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
      <Modal
        open={isModalOpen}
        title="관리자 계정 등록"
        close={handleCloseModal}
      >
        <StyledForm
          form={form}
          name="station-admin-register"
          colon={false}
          initialValues={{
            retired: '재직',
            role: '관리',
          }}
        >
          <StyledFormItem label="재직" name="retired">
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem label="권한" name="role">
            <StyledInput readOnly />
          </StyledFormItem>
          <div></div>
          <StyledFormItem
            label="이메일(ID)"
            name="accountId"
            rules={[
              {
                required: true,
                message: '이메일을 입력해주세요.',
              },
              {
                type: 'email',
                message: '이메일 형식이 아닙니다.',
              },
            ]}
          >
            <StyledInput placeholder="이메일 입력" />
          </StyledFormItem>
          <StyledFormItem
            label="이름"
            name="name"
            rules={[
              {
                required: true,
                message: '이름을 입력해주세요.',
              },
            ]}
          >
            <StyledInput placeholder="이름 입력" />
          </StyledFormItem>
          <StyledFormItem
            label="전화번호"
            name="phoneNo"
            rules={[
              {
                required: true,
                message: '전화번호를 입력해주세요',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
          >
            <StyledInput placeholder="전화번호 입력" />
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

export default StationAdminRegister;
