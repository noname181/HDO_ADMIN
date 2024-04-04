import { useEffect } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
// 패키지
import { Form } from 'antd';

// api
import { defaultUrl } from 'apis/api.helpers';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { putApi } from 'apis/putApi';
import { type StateInterface, type IUnitPrice } from 'interfaces/ICommon';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  carWashID: number | '';
  setCarWashID: Dispatch<SetStateAction<number | ''>>;
}
interface iCarWash {
  car_number?: number;
}
const CarWasEdit = ({
  state,
  setState,
  isModalOpen,
  setIsModalOpen,
  carWashID,
  setCarWashID,
}: ModalProps) => {
  const [form] = Form.useForm();
  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data, getData } = useGetDataWtTrigger<iCarWash>();

  function handleCloseModal() {
    setIsModalOpen(false);
    setCarWashID('');
    form.resetFields();
  }

  useEffect(() => {
    // bannereventId를 받아오면 api 호출
    if (carWashID !== '') {
      void getData({
        url: `/v1/car-wash/${carWashID}`,
      });
    }
  }, [carWashID]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    if (data !== null) {
      // 모달 열림
      form.setFieldsValue({
        car_number: data?.car_number,
      });
    }
  }, [data]);

  async function onFinish(values: any) {
    const addData = {
      car_number: values?.car_number,
    };

    await putApi(
      {
        url: `/car-wash/${carWashID}`,
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
      <Modal open={isModalOpen} title="세차권" close={handleCloseModal}>
        <StyledForm form={form} name="CarWasEdit" colon={false} type="modal">
          <StyledFormItem
            name="car_number"
            label="차량번호"
            rules={[
              {
                required: true,
                message: '차량번호를 입력해주세요.',
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

export default CarWasEdit;
