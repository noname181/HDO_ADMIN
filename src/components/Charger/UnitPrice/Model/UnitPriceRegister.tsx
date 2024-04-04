import { useEffect, useState } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
// 패키지
import { Form } from 'antd';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { postApiUpdate } from 'apis/postApi';
import { type StateInterface } from 'interfaces/ICommon';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Button } from 'components/common/Button/Button';
interface ModalProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>> | any;
}
const UnitPriceRegister = ({ state, setState }: ModalProps) => {
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
      unitPriceSetName: values?.unitPriceSetName,
      unitPrice1: Number(values?.unitPrice1),
      unitPrice2: Number(values?.unitPrice2),
      unitPrice3: Number(values?.unitPrice3),
      unitPrice4: Number(values?.unitPrice4),
      unitPrice5: Number(values?.unitPrice5),
      unitPrice6: Number(values?.unitPrice6),
      unitPrice7: Number(values?.unitPrice7),
      unitPrice8: Number(values?.unitPrice8),
      unitPrice9: Number(values?.unitPrice9),
      unitPrice10: Number(values?.unitPrice10),
      unitPrice11: Number(values?.unitPrice11),
      unitPrice12: Number(values?.unitPrice12),
      unitPrice13: Number(values?.unitPrice13),
      unitPrice14: Number(values?.unitPrice14),
      unitPrice15: Number(values?.unitPrice15),
      unitPrice16: Number(values?.unitPrice16),
      unitPrice17: Number(values?.unitPrice17),
      unitPrice18: Number(values?.unitPrice18),
      unitPrice19: Number(values?.unitPrice19),
      unitPrice20: Number(values?.unitPrice20),
      unitPrice21: Number(values?.unitPrice21),
      unitPrice22: Number(values?.unitPrice22),
      unitPrice23: Number(values?.unitPrice23),
      unitPrice24: Number(values?.unitPrice24),
    };

    await postApiUpdate(
      {
        url: `/v1/unit-price-set`,
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
      <Button
        size="md"
        color="primary"
        icon="/assets/img/icon/icon-add-w.png"
        alt="등록"
        onClick={handleOpenModal}
      >
        신규등록
      </Button>
      <Modal open={isModalOpen} title="단가테이블" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="unitPriceAddData"
          colon={false}
          type="modal"
          gridcol="1fr 1fr 1fr 1fr 1fr 1fr"
        >
          <StyledFormItem
            style={{ gridColumn: '1 / span 3' }}
            name="unitPriceSetName"
            label="단가이름"
            rules={[
              {
                required: true,
                message: '단가이름를 입력해주세요.',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput />
          </StyledFormItem>
          <div></div>
          <div></div>
          <div></div>
          <StyledFormItem
            name="unitPrice1"
            label="0시~1시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice2"
            label="1시~2시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice3"
            label="2시~3시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice4"
            label="3시~4시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice5"
            label="4시~5시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice6"
            label="5시~6시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice7"
            label="6시~7시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice8"
            label="7시~8시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice9"
            label="8시~9시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice10"
            label="9시~10시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice11"
            label="10시~11시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice12"
            label="11시~12시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice13"
            label="12시~13시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice14"
            label="13시~14시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice15"
            label="14시~15시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice16"
            label="15시~16시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice17"
            label="16시~17시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice18"
            label="17시~18시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice19"
            label="18시~19시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice20"
            label="19시~20시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice21"
            label="20시~21시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice22"
            label="21시~22시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice23"
            label="22시~23시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
          </StyledFormItem>
          <StyledFormItem
            name="unitPrice24"
            label="23시~24시"
            rules={[
              {
                required: true,
                message: '단가를 입력해주세요.',
              },
              {
                pattern: /^[0-9]+$/g,
                message: '숫자만 입력하세요',
              },
            ]}
            gridcol="100%"
            type="column"
          >
            <StyledInput suffix="원" maxLength={7} />
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

export default UnitPriceRegister;
