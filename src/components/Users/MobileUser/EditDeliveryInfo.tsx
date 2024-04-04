import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { postApiUpdate } from 'apis/postApi';
import { putApi } from 'apis/putApi';
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
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { type TermsPolicyInterface } from 'interfaces/ITermsPolicy'; // edit later
import { type StateInterface } from 'interfaces/ICommon';
import { Button } from 'components/common/Button/Button';

interface ModalProps {
  state: StateInterface;
  setState: (param: any) => void;
  isEditDeliveryInfo: boolean;
  setIsEditDeliveryInfo: (param: any) => void;
  setUserid: Dispatch<SetStateAction<number | ''>>;
  userId: number | '';
}

export const EditDeliveryInfo = ({
  state,
  setState,
  isEditDeliveryInfo,
  setIsEditDeliveryInfo,
  setUserid,
  userId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleCloseModal() {
    setIsEditDeliveryInfo(false);
    setUserid('');
    form.resetFields();
  }
  const { loading, error, data, getData } =
    useGetDataWtTrigger<TermsPolicyInterface>(); // edit later

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (userId !== '') {
      void getData({
        url: `/v1/web/users/${userId}`,
      });
    }
  }, [userId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        title: data?.title,
        content: data?.content,
        category: data?.category,
      });
    }
  }, [data]);

  async function onFinish(values: any) {
    const newData = {
      category: values.category,
      title: values.title,
      content: values.content,
    };
    await putApi(
      {
        url: `/v1/web/users/${userId}`, // edit later
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
    <>
      <Modal
        open={isEditDeliveryInfo}
        title="배송지 정보"
        close={handleCloseModal}
      >
        <StyledForm
          form={form}
          name=""
          colon={false}
          type="modal"
          gridcol="1fr 1fr"
        >
          <StyledFormItem
            name="a"
            label="받는분"
            rules={[
              {
                required: true,
                message: '제목를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>

          <StyledFormItem
            name="b"
            label="연락처"
            rules={[
              {
                required: true,
                message: '제목를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>

          <StyledFormItem
            name="c"
            label="우편번호"
            rules={[
              {
                required: true,
                message: '제목를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>
          <StyledFormItem
            name="d"
            label="ID"
            rules={[
              {
                required: true,
                message: '제목를 입력해주세요.',
              },
            ]}
          >
            <div style={{ display: 'flex' }}>
              <StyledInput readOnly />
              <div style={{ marginLeft: '10px' }}>
                <Button size="md" color="primary">
                  검색
                </Button>
              </div>
            </div>
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
