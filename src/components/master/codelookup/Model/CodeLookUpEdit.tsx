import { useEffect, useState } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
// 패키지
import { Form } from 'antd';

// api
import { defaultUrl } from 'apis/api.helpers';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { putApi } from 'apis/putApi';
import { type StateInterface } from 'interfaces/ICommon';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
// import { type UseGetListResponse } from 'interfaces/IUseGetData';
// import { useGetListWt } from 'hooks/useGetListWt';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isModalOpen3: boolean;
  setIsModalOpen3: Dispatch<SetStateAction<boolean>>;
  codeLookUpID: number | '';
  setCodeLookUpID: Dispatch<SetStateAction<number | ''>>;
  divCode: string;
  setDivCode: Dispatch<SetStateAction<string>>;
}
interface ICodeLookUp {
  divCode: string;
  divComment: string;
  sequence: string;
  descVal: string;
  descInfo: string;
  use: string;
}

const CodeLookUpEdit = ({
  state,
  setState,
  isModalOpen3,
  setIsModalOpen3,
  codeLookUpID,
  setCodeLookUpID,
  divCode,
  setDivCode,
}: ModalProps) => {
  const [form] = Form.useForm();
  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [dataCode, setDataCode] = useState<ICodeLookUp>();
  function handleCloseModal() {
    // setDivCode('');
    // setCodeLookUpID('');
    form.resetFields();
    setIsModalOpen3(false);
  }
  const getData = () => {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }

    const axios = hdoInstance();
    axios
      .get(`/codelookup/details/${codeLookUpID}`, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res: any) => {
        // console.log(res.data.result);
        setDataCode(res?.data?.result);
      })
      .catch((err) => {
        const errorMessage = err.response
          ? err?.response?.data?.message
          : 'Error';
        setState({
          isLoading: false,
          isSuccess: false,
          error: err?.response?.data?.message || errorMessage,
        });
        console.log('error-', err?.response?.data?.message);
      });
  };

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (codeLookUpID !== '' && isModalOpen3) {
      getData();
    }
  }, [isModalOpen3]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    // console.log(dataCode);
    if (dataCode !== null) {
      // 모달 열림
      form.setFieldsValue({
        divCode: dataCode?.divCode,
        divComment: dataCode?.divComment,
      });
    }
  }, [dataCode]);

  async function onFinish(values: any) {
    const addData = {
      divComment: values?.divComment,
    };

    await putApi(
      {
        url: `/codelookup/${codeLookUpID}`,
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
  }, [state]);

  return (
    <>
      <Modal open={isModalOpen3} title="공통코드" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="CodeLookUpEdit"
          colon={false}
          type="modal"
          gridcol="1fr 1fr"
        >
          <StyledFormItem
            name="divCode"
            label="구분코드"
            rules={[
              {
                required: true,
                message: '구분코드를 입력해주세요.',
              },
            ]}
          >
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem
            name="divComment"
            label="구분설명"
            rules={[
              {
                required: true,
                message: '구분설명를 입력해주세요.',
              },
            ]}
          >
            <StyledInput />
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

export default CodeLookUpEdit;
