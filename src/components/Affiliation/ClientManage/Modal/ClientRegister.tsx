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
  StyledRadio,
  StyledRadioBtn,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { Button } from 'components/common/Button/Button';
import { postApiUpdate } from 'apis/postApi';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface ClientRegisterModalProps {
  state: UpdateStateInterface;
  setState: Dispatch<SetStateAction<UpdateStateInterface>>;
}

const ClientRegister = ({ state, setState }: ClientRegisterModalProps) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }

  async function onFinish(values: any) {
    const clientData = {
      category: values.category,
      fullname: values.name,
      name: values.name,
      contactName: values.contactName,
      contactPhoneNo: values.contactPhoneNo,
      contactEmail: values.contactEmail,
      closed: values.closed,
      bizRegNo: values.bizRegNo,
      address: values.address,
    };

    await postApiUpdate(
      {
        url: `/orgs`,
        data: clientData,
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
  // console.log('Client Register');
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
      <Modal open={isModalOpen} title="고객사 등록" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="client-register"
          colon={false}
          initialValues={{ closed: false }}
        >
          <StyledFormItem
            label="구분"
            name="category"
            rules={[{ required: true, message: '고객사를 선택해주세요.' }]}
          >
            <StyledSelect placeholder="카테고리 선택">
              <Select.Option value="BIZ">법인</Select.Option>
              <Select.Option value="ALLNC">제휴</Select.Option>
              {/* <Select.Option value="GRP">그룹</Select.Option> */}
            </StyledSelect>
          </StyledFormItem>
          <StyledFormItem
            label="소속명"
            name="name"
            rules={[{ required: true, message: '소속명을 입력해주세요.' }]}
          >
            <StyledInput placeholder="소속명 입력" />
          </StyledFormItem>
          <StyledFormItem label="운영" name="closed" required>
            <StyledRadio>
              <StyledRadioBtn value={false}>운영</StyledRadioBtn>
              <StyledRadioBtn value={true}>정지</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem>
          <StyledFormItem
            label="대표자"
            name="contactName"
            rules={[{ required: true, message: '대표자를 입력해주세요.' }]}
          >
            <StyledInput placeholder="대표자 입력" />
          </StyledFormItem>
          <StyledFormItem
            label="연락처"
            name="contactPhoneNo"
            rules={[
              {
                required: true,
                message: '연락처를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요.',
              },
            ]}
          >
            <StyledInput placeholder="연락처 입력" />
          </StyledFormItem>
          <StyledFormItem
            label="이메일"
            name="contactEmail"
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
            label="주소"
            name="address"
            style={{ gridColumn: '1 / span 2' }}
            rules={[{ required: true, message: '주소를 입력해주세요.' }]}
          >
            <StyledInput placeholder="주소 입력" />
          </StyledFormItem>
          <StyledFormItem
            label="사업자번호"
            name="bizRegNo"
            rules={[{ required: true, message: '사업자번호를 입력해주세요.' }]}
          >
            <StyledInput placeholder="사업자번호 입력" />
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

export default ClientRegister;
