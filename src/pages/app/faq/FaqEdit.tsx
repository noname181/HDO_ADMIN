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
import { type FaqInterface } from 'interfaces/IFaq';
import { type StateInterface } from 'interfaces/ICommon';
import { FaqCategorySelectList } from 'utils/codelookup';
interface ModalProps {
  state: StateInterface;
  setState: (param: any) => void;
  isModalOpen: boolean;
  setIsModalOpen: (param: any) => void;
  setFaqId: Dispatch<SetStateAction<number | ''>>;
  FaqId: number | '';
}

export const FaqEdit = ({
  state,
  setState,
  isModalOpen,
  setIsModalOpen,
  setFaqId,
  FaqId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  function handleCloseModal() {
    setIsModalOpen(false);
    setFaqId('');
    form.resetFields();
  }
  const { loading, error, data, getData } = useGetDataWtTrigger<FaqInterface>();

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (FaqId !== '') {
      void getData({
        url: `/faq/${FaqId}`,
      });
    }
  }, [FaqId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        title: data?.title,
        content: data?.content,
        category: Number(data?.category),
      });
      setIsModalOpen(true);
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
        url: `/faq/${FaqId}`,
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
      <Modal open={isModalOpen} title="FAQ" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="faqEdit"
          colon={false}
          type="modal"
          gridcol="1fr"
        >
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <li>
              {/* <StyledFormItem
                name="category"
                label="카테고리"
                rules={[
                  {
                    required: true,
                    message: '카테고리를 입력해주세요.',
                  },
                ]}
              >
                <StyledSelect>
                  <Select.Option value="charge">충전</Select.Option>
                  <Select.Option value="payment">결제</Select.Option>
                  <Select.Option value="pnc">PNC인증</Select.Option>
                  <Select.Option value="cancel">결제취소</Select.Option>
                  <Select.Option value="secession">탈퇴</Select.Option>
                </StyledSelect>
              </StyledFormItem> */}
              <FaqCategorySelectList form={true} />
            </li>
            {/* <li>
              <StyledFormItem name="category" label="카테고리">
                <StyledInput />
              </StyledFormItem>
            </li> */}
            <li>
              <StyledFormItem
                name="title"
                label="제목"
                rules={[
                  {
                    required: true,
                    message: '제목를 입력해주세요.',
                  },
                ]}
              >
                <StyledInput />
              </StyledFormItem>
            </li>
            <li>
              <StyledFormItem
                name="content"
                label="내용"
                rules={[
                  {
                    required: true,
                    message: '내용를 입력해주세요.',
                  },
                ]}
              >
                <StyledTextArea rows={4} style={{ resize: 'none' }} />
              </StyledFormItem>
            </li>
          </ul>
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
