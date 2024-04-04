import { useEffect, useState } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
// 패키지
import { Form } from 'antd';

// api
import { defaultUrl } from 'apis/api.helpers';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
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
import { postApi } from 'apis/postApi';

// import { type UseGetListResponse } from 'interfaces/IUseGetData';
// import { useGetListWt } from 'hooks/useGetListWt';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isModalOpenRefund: boolean;
  setIsModalOpenRefund: Dispatch<SetStateAction<boolean>>;
  refundAmount: number;
  pgCno: string;
  setpgCno: Dispatch<SetStateAction<string>>;
  clID: number | '';
  setClID: Dispatch<SetStateAction<number | ''>>;
}

const PaymentRefund = ({
  state,
  setState,
  isModalOpenRefund,
  setIsModalOpenRefund,
  refundAmount,
  clID,
  setClID,
  pgCno,
  setpgCno,
}: ModalProps) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const handleCloseModal = () => {
    setIsModalOpenRefund(false);
    setpgCno('');
    setClID('');
  };

  async function onFinish(values: any) {
    const addData = {
      cl_id: clID,
      refundAmount: values?.refundAmount,
      pgCno,
    };

    // await postApi(
    //   {
    //     url: `/test-refund-payment`,
    //     data: addData,
    //   },
    //   setState,
    // );
    const axios = hdoInstance();
    await axios
      .post(`/request-refund`, addData)
      .then((result) => {
        if (result?.data?.resCd === '0000') {
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'success',
            title: '환불하기',
            content: '완료되었습니다.',
          });
          handleCloseModal();
        } else {
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title: '환불하기',
            content: result?.data?.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: '환불하기',
          content:
            error?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
      });
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      refundAmount: refundAmount,
    });
  }, [refundAmount]);

  return (
    <>
      <Modal
        open={isModalOpenRefund}
        title="환불하기"
        close={handleCloseModal}
        style={{ width: '300px' }}
      >
        <StyledForm
          form={form}
          name="paymentRefund"
          colon={false}
          type="modal"
          gridcol="1fr 1fr "
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          얼마를 환불할까요?
          <StyledFormItem
            name="refundAmount"
            // label="price"
            rules={
              [
                //   {
                //     required: true,
                //     message: '입력해주세요.',
                //   },
              ]
            }
            gridcol="100%"
          >
            <StyledInput />
          </StyledFormItem>
        </StyledForm>
        <ModalFooter
          okText="확인"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};

export default PaymentRefund;
