import {
  Modal,
  ModalFooter,
  ModalFooterCharger,
} from 'components/common/Modal/Modal';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { defaultUrl } from 'apis/api.helpers';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';
import { Form, Radio, Select, type RadioChangeEvent, notification } from 'antd';
import { CodeLookUp } from 'utils/codelookup';
import { putApi, putApiUpdate } from 'apis/putApi';
import { hdoInstance } from 'apis/hdoInstance';
import {
  FormContainer,
  FormItemWrap,
} from 'components/Charger/ChargingStation/Station.styled';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import {
  type formData,
  type ChargerEditProps,
  type ChargerInterface,
} from 'interfaces/ICharger';
import { ChargerModel } from 'utils/stationUtils';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
  StyledSelect,
  StyltedIMG,
} from 'components/common/test/Styled.ant';
import { type UpdateStateInterface } from 'interfaces/ICommon';
import StationReservation from '../ChargingStation/StationCharger/StationReservation';

export const ChargerEdit = ({
  state,
  setState,
  chargerId,
  setChargerId,
  refetch,
}: any) => {
  const [form] = Form.useForm();
  const { loadingChargerModelList, ChargerModelList } = ChargerModel();
  const { ManufacturerInfo, ConnectorTypeInfo, SpeedTypeInfo } = CodeLookUp();
  const [usePreset, setUsePreset] = useState('N');
  const [unitPrice, seUnitPrice] = useState<any>();
  const [defaultUnitPrice, setDefaultUnitPrice] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isData, setData] = useState('');
  const [isDataStatus, setDataStatus] = useState('');
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isModalOpenReservation, setIsModalOpenReservation] = useState(false);
  const handleCloseModal = () => {
    setChargerId('');
    setIsModalOpen(false);
    setUsePreset('N');
    refetch();
  };

  const handleUsePreset = (e: RadioChangeEvent) => {
    setUsePreset(e.target.value);
    if (e.target.value === 'Y') {
      form.setFieldValue('chg_unit_price', null);
      // form.setFieldValue('upSetId', data?.upSetId ?? '');
      // console.log('bbbbb');
    } else {
      form.setFieldValue('upSetId', null);
      form.setFieldValue(
        'chg_unit_price',
        data?.chg_unit_price ?? defaultUnitPrice,
      );
      // console.log('aaa');
      // console.log(defaultUnitPrice);
      // form.resetFields(['usePreset']);
    }
  };

  const { error, data, getData } = useGetDataWtTrigger<ChargerInterface>();

  useEffect(() => {
    if (chargerId !== '') {
      void getData({
        url: `/chargers-manage/${chargerId as unknown as string}`,
      });
    }
  }, [chargerId]);

  useEffect(() => {
    // console.log(data);
    if (data !== null) {
      setUsePreset(data?.usePreset);
      form.setFieldsValue({
        chgs_station_id: data?.chargingStation?.chgs_station_id,
        chg_charger_id: data?.chg_charger_id,
        // chg_use_yn: data?.chg_use_yn,
        reservable: data?.reservable,
        chg_unit_price: data?.chg_unit_price,
        upSetId: data?.upSetId,
        chargerModelId: data?.chargerModelId,
        manufacturerId: ManufacturerInfo(data?.chargerModel?.manufacturerId),
        speedType: SpeedTypeInfo(data?.chargerModel?.speedType),
        maxKw: data?.chargerModel?.maxKw,
        connectorType: ConnectorTypeInfo(data?.chargerModel?.connectorType),
        chg_alias: data?.chg_alias,
        total_channel: data?.total_channel,
        mall_id: data?.mall_id,
        mall_id2: data?.mall_id2,
        charger_status: data?.charger_status,
      });
      setData(data?.chg_use_yn);
      setDataStatus(data?.charger_status);
      setIsModalOpen(true);
      setFileUrl(data?.qrcode);
    }
  }, [data]);

  const onFinish = async (values: formData) => {
    if (data !== null) {
      const chgId = data.chg_id.toString();
      const ChargerData = {
        // chgs_id: data.chargingStation.chgs_id,
        // chg_charger_id: values.chgs_station_id,
        chargerModelId: values.chargerModelId,
        chg_use_yn: values?.chg_use_yn,
        reservable: values.reservable,
        chg_unit_price: usePreset === 'N' ? values.chg_unit_price : null, // 고정단가 * 필수
        usePreset, // 단가프리셋 * 필수
        upSetId: usePreset === 'Y' ? values.upSetId : null, // 단가프리셋 ID * 필수
        chg_alias: values?.chg_alias,
        mall_id: values?.mall_id,
        mall_id2: values?.mall_id2,
        // charger_status: values?.charger_status,
        // total_channel: values?.total_channel,
      };

      await putApiUpdate(
        {
          url: `/chargers-manage/${chgId}`,
          data: ChargerData,
        },
        setState,
        // (error) => {
        //   if (error) {
        //     setAlertModal({
        //       ...alertModal,
        //       open: true,
        //       isOk: false,
        //       type: 'error',
        //       title: '안내' ?? 'api 호출 에러 : 콘솔창 확인',
        //       content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
        //     });
        //   }
        // },
      );
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

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      setState({
        ...state,
        isSuccess: false,
      });
      handleCloseModal();
    }
    if (state?.error) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: state.error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
        content: state.error?.message ?? 'api 호출 에러 : 콘솔창 확인',
      });
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
  async function handleUpdateSoft() {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const isConfirmed = window.confirm('정말로 리셋할까요?');
    if (isConfirmed) {
      const axios = hdoInstance();
      interface ResetData {
        type: string;
      }

      const resetData = {
        type: 'Soft',
      };

      axios
        .put(`/reset-charger/${chargerId as string}`, resetData, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res: any) => {
          // console.log(res);
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'success',
            title: '알림',
            content: '완료되었습니다.',
          });
        })
        .catch((err) => {
          const errorMessage = err.response
            ? err.response.data.message
            : 'Error';
          setState({
            isLoading: false,
            isSuccess: false,
            error: err?.response?.data || errorMessage,
          });
          // console.log('error-', err?.response?.data?.message);
          // setAlertModal({
          //   ...alertModal,
          //   open: true,
          //   type: 'error',
          //   title: '안내',
          //   content:
          //     err?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
          // });
        });
    }
  }
  async function handleUpdateHard() {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) {
      return;
    }
    const isConfirmed = window.confirm('정말로 리셋할까요?');
    if (isConfirmed) {
      const axios = hdoInstance();
      interface ResetData {
        type: string;
      }

      const resetData = {
        type: 'Hard',
      };

      axios
        .put(`/reset-charger/${chargerId as string}`, resetData, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res: any) => {
          // console.log(res);
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'success',
            title: '알림',
            content: '완료되었습니다.',
          });
        })
        .catch((err) => {
          const errorMessage = err.response
            ? err.response.data.message
            : 'Error';
          setState({
            isLoading: false,
            isSuccess: false,
            error: err?.response?.data || errorMessage,
          });
          // setAlertModal({
          //   ...alertModal,
          //   open: true,
          //   type: 'error',
          //   title: '안내',
          //   content:
          //     err?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
          // });
        });
    }
  }
  async function updateChgUseYn(event: string) {
    if (isData !== event) {
      setData(event);
      form.setFieldsValue({
        chg_use_yn: event,
      });
    }
  }

  async function updateChargerstatus(event: any) {
    // console.log(event);
    // if (isDataStatus !== event) {
    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) {
      return;
    }

    const isConfirmed = window.confirm('정말로 변경할까요?');
    if (isConfirmed) {
      const axios = hdoInstance();
      // interface availabilityData {
      //   chg_use_yn: string;
      // }

      const availabilityData = {
        charger_status: event,
      };

      axios
        .put(
          `/change-charger-availability/${chargerId as string}`,
          availabilityData,
          {
            headers: {
              Authorization: accessToken,
            },
          },
        )
        .then((res: any) => {
          // console.log(res);
          /* eslint-disable */
          notification['success']({
            message: res?.msg,
          });

          form.setFieldsValue({
            charger_status: event,
          });
        })
        .catch((err) => {
          //setDataChange(!isDataChange);
          form.setFieldsValue({
            charger_status: isDataStatus,
          });

          let isConfirmed = true;
          if (event === 'normal') {
            isConfirmed = window.confirm(
              `충전기 상태 : [고장(점검중)] 입니다. 해당 충전기를 “정상”으로 강제로 변경 하시겠습니까?`,
            );
          } else {
            isConfirmed = window.confirm(
              `충전기 상태 : [정상] 입니다. 해당 충전기를 “고장”으로 강제로 변경 하시겠습니까?`,
            );
          }

          const availabilityData2 = {
            charger_status: event,
            pass: 'yes',
          };

          if (isConfirmed) {
            axios
              .put(
                `/change-charger-availability/${chargerId as string}`,
                availabilityData2,
                {
                  headers: {
                    Authorization: accessToken,
                  },
                },
              )
              .then((res: any) => {
                // console.log(res);
                /* eslint-disable */
                notification['success']({
                  message: res?.data?.msg,
                });

                form.setFieldsValue({
                  charger_status: event,
                });
              })
              .catch((err) => {
                form.setFieldsValue({
                  charger_status: isDataStatus,
                });
                const errorMessage = err.response
                  ? err.response.data.message
                  : 'Error';
                setState({
                  isLoading: false,
                  isSuccess: false,
                  error: err?.response?.data || errorMessage,
                });
              });
          } else {
            form.setFieldsValue({
              charger_status: isDataStatus,
            });
          }

          // setAlertModal({
          //   ...alertModal,
          //   open: true,
          //   type: 'error',
          //   title: '안내',
          //   content:
          //     err?.response?.data?.message ?? 'api 호출 에러 : 콘솔창 확인',
          // });
        });
    } else {
      form.setFieldsValue({
        charger_status: isDataStatus,
      });
    }
    // }
  }

  useEffect(() => {
    getUnitPrice();
    getDefaultPrice();
  }, []);
  const handleOpenModalReservation = () => {
    setIsModalOpenReservation(true);
  };
  return (
    <>
      <Modal
        open={isModalOpen}
        title="충전기 수정"
        close={handleCloseModal}
        button="단가변경 예약"
        buttonClick={handleOpenModalReservation}
      >
        <StyledForm form={form} name="charger-edit" colon={false} type="modal">
          <StyledFormItem name="chgs_station_id" label="충전소 ID">
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem name="chg_charger_id" label="충전기 ID">
            <StyledInput readOnly />
          </StyledFormItem>
          {/* <StyledFormItem name="chg_use_yn" label="사용여부">
          <StyledRadio buttonStyle="solid">
            <StyledRadioBtn value="Y">사용</StyledRadioBtn>
            <StyledRadioBtn value="N">미사용</StyledRadioBtn>
          </StyledRadio>
        </StyledFormItem> */}
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
                  speedType: SpeedTypeInfo(item.speedType),
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
            </div>
          </div>

          <StyledFormItem name="chg_alias" label="맥어드레스">
            <StyledInput />
          </StyledFormItem>

          <StyledFormItem
            name="chg_use_yn"
            label="맥어드레스"
            style={{ display: 'none' }}
          >
            <StyledInput />
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

          <StyledFormItem name="total_channel" label="커넥터 수">
            <StyledSelect disabled>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
            </StyledSelect>
          </StyledFormItem>

          <StyledFormItem name="charger_status" label="운영상태">
            <StyledSelect
              onChange={(value) => {
                updateChargerstatus(value);
              }}
            >
              <Select.Option value="normal">정상</Select.Option>
              <Select.Option value="malfunction">고장(점검중)</Select.Option>
              {/* <Select.Option value="installing">설치중</Select.Option>
            <Select.Option value="offline">사용중지</Select.Option> */}
            </StyledSelect>
          </StyledFormItem>

          {/* {fileUrl && (
          <li>
            <StyledFormItem name="image" label="충전기 QR코드">
              <StyltedIMG fileUrl={fileUrl} name="qrcode">
                <StyledInput type="file" accept="image/*" disabled />
                {fileUrl ? <img src={fileUrl} alt="충전기 QR코드" /> : <></>}
              </StyltedIMG>
            </StyledFormItem>
          </li>
        )} */}
          {/* <div
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
                gap: '5px',
                paddingTop: '10px',
              }}
              // disabled={isReadonlyALL}
            >
              <Radio
                value="N"
                style={{
                  width: '100%',
                  marginRight: '0',
                  display: 'grid',
                  gridTemplateColumns: 'auto calc(100% - 6px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <StyledFormItem
                    gridcol="auto calc(100% - 125px)"
                    name="chg_unit_price"
                    label="고정단가"
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
              
                </div>
              </Radio>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Radio
                  value="Y"
                  style={{
                    width: '15px',
                    marginRight: '10px',
                  }}
                >
                </Radio>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '100%',
                  }}
                >
                  <StyledFormItem
                    gridcol="auto calc(100% - 125px)"
                    name="upSetId"
                    label="유동단가"
                  >
                    <StyledSelect
                      disabled={usePreset === 'N'}
                      style={{ width: '100%' }}
                    >
                      {unitPrice?.map((item: any) => {
                        if (item !== null) {
                          return (
                            <Select.Option key={item.id} value={item.id}>
                              {item.unitPriceSetName}
                            </Select.Option>
                          );
                        } else {
                          return '';
                        }
                      })}
                    </StyledSelect>
                  </StyledFormItem>
                </div>
              </div>
            </Radio.Group>
          </div> */}
        </StyledForm>
        <ModalFooterCharger
          okText="수정"
          closeText="취소"
          data={isData}
          close={handleCloseModal}
          onOk={handleOk}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          updateTypeSoft={handleUpdateSoft}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          updateTypeHard={handleUpdateHard}
          updateChgUseYn={updateChgUseYn}
        />
      </Modal>
      <StationReservation
        isModalOpenReservation={isModalOpenReservation}
        setIsModalOpenReservation={setIsModalOpenReservation}
        listUnitPrice={unitPrice}
        chargerId={chargerId}
      />
    </>
  );
};
