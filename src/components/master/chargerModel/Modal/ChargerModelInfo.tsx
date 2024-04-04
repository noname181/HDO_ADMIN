import { useEffect } from 'react';
import { Form, Select } from 'antd';
import { putApi } from 'apis/putApi';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { ModalFooter } from 'components/common/Modal/Modal';
import {
  ManufacturerSelectList,
  SpeedTypeSelectList,
  ConTypeSelectList,
} from 'utils/codelookup';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';

const ChargerModelInfo = ({
  state,
  setState,
  chargerModelData,
  setIsModalOpen,
  handleCloseModal,
}: any) => {
  const [form] = Form.useForm();
  // const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const { loading, error, data, getData } = useGetDataWtTrigger<any>();
  // function handleCloseModal() {
  //   setIsModalOpen(false);
  //   form.resetFields();
  // }
  useEffect(() => {
    if (chargerModelData && chargerModelData?.id !== '') {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/charger-model/${chargerModelData?.id}`,
      });
    }
  }, [chargerModelData]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        id: data?.id,
        manufacturerId: Number(data?.manufacturerId),
        modelCode: data?.modelCode,
        modelName: data?.modelName,
        speedType: Number(data?.speedType),
        maxKw: data?.maxKw,
        connectorType: Number(data?.connectorType),
        channelCount: data?.channelCount,
        pncAvailable: data?.pncAvailable,
        useYN: data?.useYN,
      });
      setIsModalOpen(true);
    }
  }, [data]);

  async function onFinish(values: any) {
    const editData = {
      manufacturerId: values.manufacturerId,
      modelName: values.modelName,
      modelCode: values.modelCode,
      speedType: values.speedType,
      maxKw: values.maxKw,
      connectorType: values.connectorType,
      channelCount: values.channelCount,
      pncAvailable: values.pncAvailable,
      useYN: values.useYN,
    };

    await putApi(
      {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/charger-model/${chargerModelData.id}`,
        data: editData,
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
  }, [state]);

  return (
    <>
      <StyledForm form={form} name="charger-model-edit" colon={false}>
        {/* <StyledFormItem
          name="manufacturerId"
          label="제조사"
          rules={[
            {
              required: true,
              message: '제조사를 선택해주세요.',
            },
          ]}
        >
          <StyledSelect placeholder="제조사">
            <Select.Option value="1">클린일렉스</Select.Option>
            <Select.Option value="2">삼성전자</Select.Option>
          </StyledSelect>
        </StyledFormItem> */}
        <ManufacturerSelectList
          form
          rules={[
            {
              required: true,
              message: '제조사를 선택해주세요.',
            },
          ]}
          placeholder="제조사 선택"
        />
        <StyledFormItem
          name="modelCode"
          label="모델 ID"
          rules={[
            {
              required: true,
              message: '모델 ID를 입력해주세요.',
            },
          ]}
        >
          <StyledInput placeholder="모델 ID" />
        </StyledFormItem>
        <StyledFormItem
          name="modelName"
          label="모델명"
          rules={[
            {
              required: true,
              message: '모델명을 입력해주세요.',
            },
          ]}
        >
          <StyledInput placeholder="모델명" />
        </StyledFormItem>
        {/* <StyledFormItem
          name="speedType"
          label="속도유형"
          rules={[
            {
              required: true,
              message: '속도유형을 선택해주세요.',
            },
          ]}
        >
          <StyledSelect placeholder="속도유형 선택">
            <Select.Option value="1">초고속</Select.Option>
            <Select.Option value="2">급속</Select.Option>
            <Select.Option value="3">중속</Select.Option>
            <Select.Option value="4">완속</Select.Option>
          </StyledSelect>
        </StyledFormItem> */}
        <SpeedTypeSelectList
          form
          rules={[
            {
              required: true,
              message: '속도유형을 선택해주세요.',
            },
          ]}
          placeholder="속도유형 선택"
        />
        <StyledFormItem
          name="maxKw"
          label="충전속도(kW)"
          rules={[
            {
              required: true,
              message: '충전속도를 입력해주세요.',
            },
            // {
            //   pattern: /^[1-9]\d*$/,
            //   message: '0보다 큰 숫자를 입력해야합니다.',
            // },
            {
              pattern: /^[1-9]\d*(\.\d+)?$/,
              message: '0보다 큰 숫자를 입력해야합니다.',
            },
          ]}
        >
          <StyledInput
            placeholder="충전속도"
            maxLength={3}
            onChange={(event) => {
              if (
                (event.target.value.length === 2 &&
                  event.target.value[0] === '0' &&
                  event.target.value[1] !== '0') ||
                (event.target.value.length > 2 &&
                  event.target.value[0] === '0' &&
                  event.target.value[1] === '0' &&
                  event.target.value[2] !== '0')
              ) {
                const currentData = {
                  ...form.getFieldsValue(),
                  maxKw: event.target.value.replaceAll('0', ''),
                };
                form.resetFields();
                form.setFieldsValue(currentData);
              }
            }}
          />
        </StyledFormItem>
        {/* <StyledFormItem
          name="connectorType"
          label="커넥터 타입"
          rules={[
            {
              required: true,
              message: '커넥터 타입을 선택해주세요.',
            },
          ]}
        >
          <StyledSelect placeholder="커넥터 타입 선택">
            <Select.Option value="1">DC차데모</Select.Option>
            <Select.Option value="2">AC완속</Select.Option>
            <Select.Option value="3">DC차데모+AC3상</Select.Option>
            <Select.Option value="4">DC콤보</Select.Option>
            <Select.Option value="5">DC차데모+DC콤보</Select.Option>
            <Select.Option value="6">DC차데모+AC3상+DC콤보</Select.Option>
            <Select.Option value="7">AC3상</Select.Option>
          </StyledSelect>
        </StyledFormItem> */}
        <ConTypeSelectList
          form
          rules={[
            {
              required: true,
              message: '커넥터 타입을 선택해주세요.',
            },
          ]}
          placeholder="커넥터 타입"
        />
        <StyledFormItem
          name="channelCount"
          label="채널 수"
          rules={[
            {
              required: true,
              message: '채널 수를 선택해주세요.',
            },
          ]}
        >
          <StyledSelect placeholder="채널 수 선택">
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
            <Select.Option value="3">3</Select.Option>
            <Select.Option value="4">4</Select.Option>
          </StyledSelect>
        </StyledFormItem>
        <StyledFormItem name="useYN" label="사용여부" required>
          <StyledRadio>
            <StyledRadioBtn value={true}>사용</StyledRadioBtn>
            <StyledRadioBtn value={false}>미사용</StyledRadioBtn>
          </StyledRadio>
        </StyledFormItem>
        <StyledFormItem name="pncAvailable" label="PnC 가능 여부" required>
          <StyledRadio>
            <StyledRadioBtn value={true}>가능</StyledRadioBtn>
            <StyledRadioBtn value={false}>불가능</StyledRadioBtn>
          </StyledRadio>
        </StyledFormItem>
      </StyledForm>
      <ModalFooter
        okText="수정"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </>
  );
};

export default ChargerModelInfo;
