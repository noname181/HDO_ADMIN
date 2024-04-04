import { useEffect, useState } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
// 패키지
import { Form } from 'antd';

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
import { hdoInstance } from 'apis/hdoInstance';
import { Button } from 'components/common/Button/Button';

interface ModalProps {
  state2: any;
  setState2: Dispatch<SetStateAction<any>>;
  codeLookUpID: number | '';
  setCodeLookUpID: Dispatch<SetStateAction<number | ''>>;
  divCode: string;
}
const CodeLookUpDetailRegister = ({
  state2,
  setState2,
  codeLookUpID,
  divCode,
}: ModalProps) => {
  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  function handleCloseModal() {
    setIsModalOpen(false);
    form.resetFields();
  }
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  async function onFinish(values: any) {
    const addData = {
      descVal: values?.descVal,
      descInfo: values?.descInfo,
      use: values?.use,
      codeId: codeLookUpID,
      upperDivCode: divCode === 'BRANCH' ? values?.upperDivCode : '',
    };
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const url = `/subcodelookup`;
    const axios = hdoInstance();
    axios
      .post(url, addData, { headers: { Authorization: accessToken } })
      .then(() => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'success',
          title: '알림',
          content: '완료되었습니다.',
        });
        setState2({ isLoading2: false, error2: null, isSuccess2: true });
      })
      .catch((err) => {
        setState2({
          isLoading2: false,
          isSuccess2: false,
          error2: err?.response?.data,
        });
      });
    // await postApiUpdate(
    //   {
    //     url: `/subcodelookup`,
    //     data: addData,
    //   },
    //   setState2,
    // );
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
    if (state2.isSuccess2) {
      handleCloseModal();
    }
    if (state2.error2?.errorCode) {
      const textError = state2?.error2?.errorMessage ?? state2.error2.message;
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state2.error2?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: textError ?? 'api 호출 에러 : 콘솔창 확인',
        onOk() {
          setAlertModal({ ...alertModal, open: false });
          setState2({
            isLoading2: false,
            isSuccess2: false,
            error2: null,
          });
        },
        onCancel() {
          setAlertModal({ ...alertModal, open: false });
          setState2({
            isLoading2: false,
            isSuccess2: false,
            error2: null,
          });
        },
      });
    }
  }, [state2]);
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
      <Modal open={isModalOpen} title="공통코드" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="CodeLookUpDetailRegister"
          colon={false}
          type="modal"
          gridcol="1fr 1fr"
          initialValues={{
            use: true,
          }}
        >
          <StyledFormItem
            name="descVal"
            label="코드값"
            rules={[
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
              {
                required: true,
                message: '코드값를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>
          <StyledFormItem
            name="descInfo"
            label="코드 값 설명"
            rules={[
              {
                required: true,
                message: '코드 값 설명를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
          </StyledFormItem>

          <StyledFormItem
            name="use"
            label="사용여부"
            rules={[
              {
                required: true,
                message: '사용여부를 입력해주세요.',
              },
            ]}
          >
            <StyledRadio>
              <StyledRadioBtn value={true}>사용</StyledRadioBtn>
              <StyledRadioBtn value={false}>미사용</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem>
          {divCode === 'BRANCH' && (
            <StyledFormItem
              name="upperDivCode"
              label="상위코드"
              // rules={[
              //   {
              //     required: true,
              //     message: '상위코드를 입력해주세요.',
              //   },
              // ]}
            >
              <StyledInput />
            </StyledFormItem>
          )}
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

export default CodeLookUpDetailRegister;
