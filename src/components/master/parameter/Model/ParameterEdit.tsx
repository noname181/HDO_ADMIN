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
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
// import { type UseGetListResponse } from 'interfaces/IUseGetData';
// import { useGetListWt } from 'hooks/useGetListWt';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  id: number | '';
  setId: Dispatch<SetStateAction<number | ''>>;
}
interface ICodeLookUp {
  divCode: string;
  divComment: string;
  cfgVal: string;
}

const ParameterEdit = ({
  state,
  setState,
  isModalOpen,
  setIsModalOpen,
  id,
  setId,
}: ModalProps) => {
  const [form] = Form.useForm();
  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data, getData } = useGetDataWtTrigger<ICodeLookUp>();
  // const [dataCode, setDataCode] = useState<ICodeLookUp>();
  function handleCloseModal() {
    setId('');
    form.resetFields();
    setIsModalOpen(false);
  }
  // const getData = () => {
  //   const accessToken = localStorage.getItem('accessToken') ?? '';
  //   if (!accessToken) {
  //     return;
  //   }

  //   const axios = hdoInstance();
  //   axios
  //     .get(`/config/details/${id}`, {
  //       headers: {
  //         Authorization: accessToken,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     .then((res: any) => {
  //       // console.log(res.data.result);
  //       setDataCode(res.data.result);
  //     })
  //     .catch((err) => {
  //       const errorMessage = err.response
  //         ? err?.response?.data?.message
  //         : 'Error';
  //       setState({
  //         isLoading: false,
  //         isSuccess: false,
  //         error: err?.response?.data?.message || errorMessage,
  //       });
  //       console.log('error-', err?.response?.data?.message);
  //     });
  // };

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (id !== '') {
      void getData({
        url: `/config/details/${id}`,
      });
    }
  }, [id]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    // console.log(dataCode);
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        divCode: data?.divCode,
        divComment: data?.divComment,
        cfgVal: data?.cfgVal,
      });
    }
  }, [data]);

  async function onFinish(values: any) {
    const addData = {
      cfgVal: values?.cfgVal,
    };
    await putApi(
      {
        url: `/config/${id}`,
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
    <>
      <Modal
        open={isModalOpen}
        title="파라메타 테이블"
        close={handleCloseModal}
      >
        <StyledForm
          form={form}
          name="ParameterEdit"
          colon={false}
          type="modal"
          gridcol="1fr 1fr "
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

          {data?.divCode === 'DEEPLINK' ? (
            <StyledFormItem
              name="cfgVal"
              label="값 Deep"
              rules={[
                {
                  required: true,
                  message: '값를 입력해주세요.',
                },
              ]}
            >
              <StyledInput />
            </StyledFormItem>
          ) : (
            <StyledFormItem
              name="cfgVal"
              label="값"
              rules={[
                {
                  pattern: /^[0-9]+$/g,
                  message: '숫자만 입력하세요',
                },
                {
                  required: true,
                  message: '값를 입력해주세요.',
                },
              ]}
            >
              <StyledInput />
            </StyledFormItem>
          )}

          <StyledFormItem
            name="divComment"
            label="구분설명"
            rules={[
              {
                required: true,
                message: '구분설명를 입력해주세요.',
              },
            ]}
            style={{ gridColumn: '1 / span 2' }}
          >
            <StyledInput readOnly />
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

export default ParameterEdit;
