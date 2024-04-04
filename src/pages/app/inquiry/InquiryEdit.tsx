import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { Form } from 'antd';
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';
import { putApi } from 'apis/putApi';
import { type StateInterface, type IInquiry } from 'interfaces/ICommon';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledTextArea,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setInquiryId: Dispatch<SetStateAction<number | ''>>;
  InquiryId: number | '';
}

export const InquiryEdit = ({
  state,
  setState,
  isEditOpen,
  setIsEditOpen,
  setInquiryId,
  InquiryId,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  function handleCloseModal() {
    setIsEditOpen(false);
    setInquiryId('');
    form.resetFields();
  }
  const { loading, error, data, getData } = useGetDataWtTrigger<IInquiry>();

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (InquiryId !== '') {
      void getData({
        url: `/inquiry/${InquiryId}`,
      });
    }
  }, [InquiryId]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // console.log(data);
      // 모달 열림
      form.setFieldsValue({
        content: data?.content,
        comment: data?.comment,
      });
      setIsEditOpen(true);
    }
  }, [data]);

  async function onFinish(values: any) {
    const newData = {
      comment: values.comment,
    };
    await putApi(
      {
        url: `/v1/inquiry/${InquiryId}`,
        data: newData,
      },
      setState,
    );
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
  useEffect(() => {
    // 등록 완료
    if (state.isSuccess) {
      // 모달 창 닫기
      handleCloseModal();
    }
    // 등록 에러
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
    <Modal open={isEditOpen} title="1:1문의" close={handleCloseModal}>
      <StyledForm
        form={form}
        name="inquiryAddData"
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
              <StyledTextArea
                readOnly={true}
                rows={4}
                style={{ resize: 'none' }}
              />
            </StyledFormItem>
          </li>
          {/* <li>
            <StyledFormItem name="comment" label="논평">
              <StyledTextArea rows={4} style={{ resize: 'none' }} />
            </StyledFormItem>
          </li> */}
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
