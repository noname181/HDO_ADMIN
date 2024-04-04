import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';
import { Form, Radio, Select, type RadioChangeEvent } from 'antd';
import { FormContainer, FormItemWrap } from '../Station.styled';
import { CodeLookUp } from 'utils/codelookup';
import { ChargerModel } from 'utils/stationUtils';
import { type ConfigInterface } from 'interfaces/Test/IConfig';
import {
  StyledForm,
  StyledInput,
  StyledSelect,
  StyledRadio,
  StyledRadioBtn,
  StyledFormItem,
} from 'components/common/test/Styled.ant';
import { type StationInterface, type formData } from 'interfaces/ICharger';
import { Button } from 'components/common/Button/Button';
import { type StateInterface } from 'interfaces/ICommon';
import { hdoInstance } from 'apis/hdoInstance';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
interface StationChargerRegisterProps {
  reload: () => void;
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  stationId: number | '';
}

export const StationChargerRegister = ({
  reload,
  state,
  setState,
  stationId,
}: StationChargerRegisterProps) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unitPrice, seUnitPrice] = useState<any>();
  const [defaultUnitPrice, setDefaultUnitPrice] = useState<number>();
  const [usePreset, setUsePreset] = useState('N');
  const { ManufacturerInfo, ConnectorTypeInfo, SpeedTypeInfo } = CodeLookUp();
  const { loadingChargerModelList, ChargerModelList } = ChargerModel();
  // api 호출 준비
  const { loading, error, data, getData } = useGetDataWtTrigger<any>();

  useEffect(() => {
    // stationId를 받아오면 api 호출
    if (stationId !== '' && isModalOpen) {
      void getData({
        url: `/v1/admin/stations/${stationId}`,
      });
    }
    // console.log('aaaaaa');
  }, [isModalOpen]);

  useEffect(() => {
    // stationId를 받아오면 api 호출
    if (data !== null && isModalOpen) {
      setUsePreset('N');
      form.resetFields();
      form.setFieldsValue({
        chgs_station_id: data?.chgs_station_id,
        chg_charger_id:
          (data?.chgs_station_id as string) +
          '-' +
          (parseInt(data?.chargers.length) + 1).toString(),
        chg_unit_price: defaultUnitPrice ?? null,
      });
      // console.log(data);
    }
  }, [data]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUsePreset = (e: RadioChangeEvent) => {
    setUsePreset(e.target.value);
    if (e.target.value === 'Y') {
      form.setFieldValue('chg_unit_price', null);
      // console.log('bbbbb');
    } else {
      form.setFieldValue('upSetId', null);
      form.setFieldValue('chg_unit_price', defaultUnitPrice ?? null);
      // console.log('aaa');
      // console.log(defaultUnitPrice);
      // form.resetFields(['usePreset']);
    }
  };

  function handleOk() {
    form
      .validateFields()
      .then((values: formData) => {
        void onFinish(values);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  const onFinish = async (values: formData) => {
    const ChargerData = {
      chgs_id: data?.chgs_id, // 충전소 ID * 필수
      chargerModelId: values.chargerModelId, // 충전기 모델 ID * 필수
      chg_unit_price: values.chg_unit_price, // 고정단가 * 필수
      usePreset, // 단가프리셋 * 필수
      upSetId: values.upSetId,
      chg_use_yn: values.chg_use_yn, // 충전기 사용여부
      reservable: values.reservable, // 예약기능
      total_channel: values.total_channel,
      mall_id: values.mall_id,
      mall_id2: values.mall_id2,
      chg_alias: values.chg_alias,
      charger_status: values?.charger_status,
    };

    // console.log(ChargerData);

    await postApi(
      {
        url: `/chargers-manage`,
        data: ChargerData,
      },
      setState,
    );
  };

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
      reload();
    }
  }, [state]);
  const getUnitPrice = () => {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }

    const axios = hdoInstance();
    axios
      .get(`/unit-price-set`, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res: any) => {
        // console.log(res.data.result);
        seUnitPrice(res.data.result);
      })
      .catch((err) => {
        const errorMessage = err.response ? err.response.data.message : 'Error';
        setState({
          isLoading: false,
          isSuccess: false,
          error: err?.response?.data?.message || errorMessage,
        });
        console.log('error-', err?.response?.data?.message);
      });
  };
  const getDefaultPrice = () => {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }

    const axios = hdoInstance();
    axios
      .get(`/config?category=divCode&search=DEFAULT_UNITPRICE`, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res: any) => {
        // console.log(res.data.result);
        // console.log(Number(res.data.result[0].cfgVal));

        setDefaultUnitPrice(Number(res.data.result[0].cfgVal));
      })
      .catch((err) => {
        const errorMessage = err.response ? err.response.data.message : 'Error';
        setState({
          isLoading: false,
          isSuccess: false,
          error: err?.response?.data?.message || errorMessage,
        });
        console.log('error-', err?.response?.data?.message);
      });
  };
  useEffect(() => {
    getUnitPrice();
    getDefaultPrice();
  }, []);

  return (
    <>
      <Button onClick={handleOpenModal}>신규등록</Button>
      <Modal open={isModalOpen} title="충전기 등록" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="charger-register"
          colon={false}
          type="modal"
          initialValues={{
            chg_use_yn: 'Y',
            reservable: 'Y',
            chg_unit_price: 0,
            total_channel: '1',
            charger_status: 'normal',
          }}
        >
          <StyledFormItem
            name="chgs_station_id"
            label="충전소 ID"
            rules={[
              {
                required: true,
                message: '충전소 ID를 입력해주세요',
              },
            ]}
          >
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem
            label="충전기 ID"
            name="chg_charger_id"
            rules={[
              {
                required: true,
                message: '충전기 ID를 입력해주세요',
              },
            ]}
          >
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem name="chg_use_yn" label="사용여부">
            <StyledRadio buttonStyle="solid">
              <StyledRadioBtn value="Y">사용</StyledRadioBtn>
              <StyledRadioBtn value="N">미사용</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem>
          <StyledFormItem
            name="chargerModelId"
            label="모델명"
            rules={[{ required: true, message: '충전기 모델을 선택해주세요.' }]}
          >
            <StyledSelect
              loading={loadingChargerModelList}
              placeholder="충전기 모델을 선택하세요."
              onChange={(_, item: any) => {
                form.setFieldsValue({
                  manufacturerId: ManufacturerInfo(item?.manufacturerId),
                  speedType: SpeedTypeInfo(item?.speedType),
                  maxKw: item?.maxKw,
                  connectorType: ConnectorTypeInfo(item?.connectorType),
                });
              }}
            >
              {ChargerModelList?.map((item) => (
                <Select.Option key={item.value} {...item}>
                  {item.label}
                </Select.Option>
              ))}
            </StyledSelect>
          </StyledFormItem>
          <StyledFormItem name="manufacturerId" label="제조사">
            <StyledInput placeholder="충전기 모델을 선택하세요." readOnly />
          </StyledFormItem>
          {/* <StyledFormItem name="reservable" label="예약기능">
            <StyledRadio buttonStyle="solid">
              <StyledRadioBtn value="Y">사용</StyledRadioBtn>
              <StyledRadioBtn value="N">불가능</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem> */}
          <StyledFormItem name="speedType" label="속도유형">
            <StyledInput placeholder="충전기 모델을 선택하세요." readOnly />
          </StyledFormItem>
          <StyledFormItem name="maxKw" label="속도(kW)">
            <StyledInput placeholder="충전기 모델을 선택하세요." readOnly />
          </StyledFormItem>
          <StyledFormItem name="connectorType" label="커넥터 타입">
            <StyledInput placeholder="충전기 모델을 선택하세요." readOnly />
          </StyledFormItem>

          <div
            style={{
              display: 'flex',
            }}
          >
            <Radio.Group
              value={usePreset}
              onChange={handleUsePreset}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '38px',
                paddingTop: '10px',
              }}
            >
              <Radio
                value="N"
                style={{
                  width: '100%',
                  marginRight: '0',
                  display: 'grid',
                  gridTemplateColumns: 'auto calc(100% - 6px)',
                }}
              ></Radio>
              {/* <Radio
                value="Y"
                style={{
                  width: '100%',
                  marginRight: '0',
                  display: 'grid',
                  gridTemplateColumns: 'auto calc(100% - 6px)',
                }}
              > */}
              {/* <StyledFormItem
              name="upSetId"
              label="단가 프리셋"
              style={{
                display: 'flex',
                gap: '10px',
                margin: 0,
              }}
              rules={[
                {
                  required: usePreset === 'Y',
                  message: '단가 프리셋을 선택해주세요.',
                },
              ]}
            >
              <StyledInput readOnly disabled={usePreset === 'N'} />
            </StyledFormItem> */}
              {/* </Radio> */}
            </Radio.Group>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingLeft: '10px',
              }}
            >
              <StyledFormItem
                gridcol="auto calc(100% - 125px)"
                name="chg_unit_price"
                label="고정단가"
                // style={{ margin: '0' }}
                rules={[
                  {
                    pattern: usePreset === 'N' ? /^[0-9]+$/g : /[0]/,
                    message: '숫자만 입력하세요',
                  },
                  {
                    required: usePreset === 'N',
                    message: '고정단가 입력이 필수입니다.',
                  },
                ]}
              >
                <StyledInput
                  disabled={usePreset === 'Y'}
                  suffix="원"
                  maxLength={7}
                />
              </StyledFormItem>
              {/* <StyledFormItem
                name="upSetId"
                label="단가테이블"
                gridcol="auto calc(100% - 125px)"
                rules={[
                  {
                    required: usePreset === 'Y',
                    message: '단가 프리셋을 선택해주세요.',
                  },
                ]}
              >
                <StyledSelect disabled={usePreset === 'N'}>
                  {unitPrice?.map((item: any) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.unitPriceSetName}
                      </Select.Option>
                    );
                  })}
                </StyledSelect>
              </StyledFormItem> */}
            </div>
          </div>

          <StyledFormItem
            name="total_channel"
            label="커넥터 수"
            rules={[
              {
                required: true,
                message: '커넥터 수를 선택하세요.',
              },
            ]}
          >
            <StyledSelect>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              {/* <Select.Option value="3">3</Select.Option>
              <Select.Option value="4">4</Select.Option>
              <Select.Option value="5">5</Select.Option>
              <Select.Option value="6">6</Select.Option>
              <Select.Option value="7">7</Select.Option>
              <Select.Option value="8">8</Select.Option>
              <Select.Option value="9">9</Select.Option>
              <Select.Option value="10">10</Select.Option> */}
            </StyledSelect>
          </StyledFormItem>

          <StyledFormItem
            name="mall_id"
            label="오프라인 MID"
            rules={[
              {
                required: true,
                message: '오프라인 MID를 선택하세요.',
              },
            ]}
          >
            <StyledInput placeholder="오프라인 MID" />
          </StyledFormItem>
          <StyledFormItem
            name="mall_id2"
            label="온라인 MID"
            rules={[
              {
                required: true,
                message: '온라인 MID를 선택하세요.',
              },
            ]}
          >
            <StyledInput placeholder="온라인 MID" />
          </StyledFormItem>

          <StyledFormItem name="chg_alias" label="맥어드레스">
            <StyledInput placeholder="맥어드레스" />
          </StyledFormItem>

          <StyledFormItem name="charger_status" label="운영상태">
            <StyledSelect>
              <Select.Option value="normal">정상</Select.Option>
              <Select.Option value="malfunction">고장(점검중)</Select.Option>
              {/* <Select.Option value="installing">설치중</Select.Option>
              <Select.Option value="offline">사용중지</Select.Option> */}
            </StyledSelect>
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
