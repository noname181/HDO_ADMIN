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
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';
import { putApi } from 'apis/putApi';

const StationAdminEdit = ({
  stationAdminData,
  setStationAdminData,
  state,
  setState,
}: any) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function handleCloseModal() {
    setIsModalOpen(false);
    setStationAdminData('');
    form.resetFields();
  }

  useEffect(() => {
    if (stationAdminData !== '') {
      form.setFieldsValue({
        retired: stationAdminData.retired,
        name: stationAdminData.name,
        phoneNo: stationAdminData.phoneNo,
        role: stationAdminData.role,
        accountId: stationAdminData.accountId,
      });
      // 모달 열림
      setIsModalOpen(true);
    }
  }, [stationAdminData]);

  async function onFinish(values: any) {
    if (stationAdminData !== '') {
      const editData = {
        retired: values.retired,
        name: values.name,
        phoneNo: values.phoneNo,
        role: values.role,
        accountId: values.accountId,
      };

      await putApi(
        {
          url: `/v1/web-users/${stationAdminData.id as string}`,
          data: editData,
        },
        setState,
      );
    }
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
    <Modal open={isModalOpen} title="관리자 계정 수정" close={handleCloseModal}>
      <StyledForm form={form} name="station-user-edit" colon={false}>
        <StyledFormItem label="재직" name="retired" required>
          <StyledRadio>
            <StyledRadioBtn value={false}>재직</StyledRadioBtn>
            <StyledRadioBtn value={true}>퇴사</StyledRadioBtn>
          </StyledRadio>
        </StyledFormItem>
        <StyledFormItem label="권한" name="role" required>
          <StyledRadio>
            <StyledRadioBtn value="ADMIN">관리</StyledRadioBtn>
            <StyledRadioBtn value="VIEWER">조회</StyledRadioBtn>
          </StyledRadio>
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
        okText="수정"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </Modal>
  );
};

export default StationAdminEdit;
