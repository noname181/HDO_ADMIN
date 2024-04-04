import { useEffect, useState } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
// 패키지
import { Form, notification } from 'antd';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { type StateInterface, type ICodeLookUp } from 'interfaces/ICommon';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
} from 'components/common/test/Styled.ant';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
// import { type UseGetListResponse } from 'interfaces/IUseGetData';
// import { useGetListWt } from 'hooks/useGetListWt';

interface ModalProps {
  isModalOpen4: boolean;
  setIsModalOpen4: Dispatch<SetStateAction<boolean>>;
  codeLookUpID2: number | '';
  setCodeLookUpID2: Dispatch<SetStateAction<number | ''>>;
  state2: any;
  setState2: Dispatch<SetStateAction<any>>;
  divCode: string;
}
const CodeLookUpDetailEdit = ({
  isModalOpen4,
  setIsModalOpen4,
  codeLookUpID2,
  setCodeLookUpID2,
  state2,
  setState2,
  divCode,
}: ModalProps) => {
  const [form] = Form.useForm();
  // AlertModal
  function handleCloseModal() {
    setCodeLookUpID2('');
    form.resetFields();
    setIsModalOpen4(false);
  }
  const { loading, error, data, getData } = useGetDataWtTrigger<ICodeLookUp>();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (codeLookUpID2 !== '') {
      void getData({
        url: `/subcodelookup/${codeLookUpID2}`,
      });
    }
  }, [codeLookUpID2]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        descVal: data?.descVal,
        descInfo: data?.descInfo,
        use: data?.use,
      });
      if (divCode === 'BRANCH') {
        form.setFieldsValue({
          upperDivCode: data?.upperDivCode,
        });
      }
    }
  }, [data]);

  async function onFinish(values: any) {
    const addData = {
      // descVal: values?.descVal,
      descInfo: values?.descInfo,
      use: values?.use,
      upperDivCode: divCode === 'BRANCH' ? values?.upperDivCode : '',
    };

    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;
    const url = `/subcodelookup/${codeLookUpID2}`;
    const axios = hdoInstance();
    axios
      .put(url, addData, { headers: { Authorization: accessToken } })
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
    // await putApi(
    //   {
    //     url: `/subcodelookup/${codeLookUpID2}`,
    //     data: addData,
    //   },
    //   setState,
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
    // if (state.error) {
    //   const textError = state?.error?.errorMessage ?? state?.error?.message;
    // console.log(state.error);
    //   setAlertModal({
    //     ...alertModal,
    //     open: true,
    //     type: 'error',
    //     title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
    //     content: textError ?? 'api 호출 에러 : 콘솔창 확인',
    //   });
    // }
  }, [state2]);

  return (
    <>
      <Modal open={isModalOpen4} title="공통코드" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="CodeLookUpDetailEdit"
          colon={false}
          type="modal"
          gridcol="1fr 1fr"
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
            <StyledInput readOnly />
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
          okText="저장"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};

export default CodeLookUpDetailEdit;
