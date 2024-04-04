import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

// 패키지
import { Select, TimePicker, Form, Checkbox } from 'antd';
import dayjs from 'dayjs';

// api
import { postApi } from 'apis/postApi';
import { defaultUrl } from 'apis/api.helpers';

// 타입
import { type CoordinateInterface, StationMaps } from './StationMap';
import {
  type OrganizationInterface,
  type StateInterface,
} from 'interfaces/ICommon';

// 유틸 함수
import { category } from 'utils/stationUtils';

// axios
import axios from 'axios';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledInput,
  StyledRadio,
  StyledRadioBtn,
  StyledSelect,
  StyleDivAdress,
} from 'components/common/test/Styled.ant';
import { Button } from 'components/common/Button/Button';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';
import {
  areaText,
  branchText,
  AreaSelectList,
  BranchSelectList,
} from 'utils/codelookup';
import { useGetListWt } from 'hooks/useGetListWt';
import { hdoInstance } from 'apis/hdoInstance';

interface ChargingStationRegisterProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
}

const ChargingStationRegister = ({
  state,
  setState,
}: ChargingStationRegisterProps) => {
  const [form] = Form.useForm();
  const haveCarWash = Form.useWatch('haveCarWash', form);
  const useCarWash = Form.useWatch('chgs_car_wash_yn', form);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const [coordinate, setCoordinate] = useState<CoordinateInterface>({
    latitude: 37.5594437,
    longitude: 126.8551813,
  });
  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [addressList, setAdressList] = useState<any>([]);
  const [address, setAdress] = useState<any>(null);
  const [isShowAddressList, setIsShowAddressList] = useState<boolean>(false);
  const [onSelectAddress, setOnSelectAddress] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<boolean>(false);
  const [areaNo, setAreaNo] = useState('');
  const [activeCheck, setActiveCheck] = useState<boolean>(false);
  const [code, setCode] = useState<string>('3');
  const { loading, error, data, refetch } = useGetListWt<OrganizationInterface>(
    {
      url: 'v1/orgs/unregister/charging-station',
    },
  );

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsReadonly(true);
    setAdressList([]);
    setIsShowAddressList(false);
    setSelectedAddress(false);
    setIsModalOpen(false);
    form.resetFields();
    setCoordinate({
      latitude: 37.5594437,
      longitude: 126.8551813,
    });
  }
  const handleSetCode = (item: string) => {
    switch (item) {
      case 'STT_DIR':
        setCode('1');
        break;
      case 'STT_FRN':
        setCode('2');
        break;
      case 'EV_DIV':
        setCode('3');
        break;
      default:
        setCode('0');
        break;
    }
  };
  async function onFinish(values: any) {
    let chargingStationData;
    // console.log(values);
    // if (values.orgId === 'EV 사업팀') {
    if (selectedAddress) {
      chargingStationData = {
        address: address,
        area: values.area,
        branch: values.branch ? values.branch : null,
        erp: values.erp,
        category: values.category,
        chgs_station_id:
          (values.chgs_station_id_type as string) +
          '-' +
          (values.chgs_station_id_name as string),
        chgs_name: values.chgs_name,
        orgId: null,
        status: values.status,
        coordinate: {
          latitude: parseFloat(values.coordinate?.split(',')[0]),
          longitude: parseFloat(values.coordinate?.split(',')[1]),
        },
        chgs_kepco_meter_no: values.chgs_kepco_meter_no ?? null,
        chgs_operator_manager_id: values.chgs_operator_manager_id ?? null,
        chrgStartTime: values.chrgStartTime
          ? dayjs(values.chrgStartTime).format('HH:mm')
          : null,
        chrgEndTime: values.chrgEndTime
          ? dayjs(values.chrgEndTime).format('HH:mm')
          : null,
        chgs_car_wash_yn: values.chgs_car_wash_yn === true ? 'Y' : 'N',
        washStartTime: values.washStartTime
          ? dayjs(values.washStartTime).format('HH:mm')
          : null,
        washEndTime: values.washEndTime
          ? dayjs(values.washEndTime).format('HH:mm')
          : null,
        priceType: values.priceType,
        unitPriceSetId: values.unitPriceSetId,
        fixedPrice: values.fixedPrice,
        ev_div: true,
        activeStationYN: values.activestationyn === true ? 'Y' : 'N',
        haveCarWash: values.haveCarWash,
        region: values.region,
      };
    } else {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: '유효하지 않은 주소입니다.',
        content: '유효한 주소를 선택해주세요',
      });
      return;
    }
    // }
    // else {
    //   chargingStationData = {
    //     chgs_station_id:
    //       (values.chgs_station_id_type as string) +
    //       '-' +
    //       (values.chgs_station_id_name as string),
    //     chgs_name: values.chgs_name,
    //     orgId: values.orgId,
    //     status: values.status,
    //     coordinate,
    //     chgs_kepco_meter_no: values.chgs_kepco_meter_no ?? null,
    //     chgs_operator_manager_id: values.chgs_operator_manager_id ?? null,
    //     chrgStartTime: values.chrgStartTime
    //       ? dayjs(values.chrgStartTime).format('HH:mm')
    //       : null,
    //     chrgEndTime: values.chrgEndTime
    //       ? dayjs(values.chrgEndTime).format('HH:mm')
    //       : null,
    //     chgs_car_wash_yn: values.chgs_car_wash_yn === true ? 'Y' : 'N',
    //     washStartTime: values.washStartTime
    //       ? dayjs(values.washStartTime).format('HH:mm')
    //       : null,
    //     washEndTime: values.washEndTime
    //       ? dayjs(values.washEndTime).format('HH:mm')
    //       : null,
    //     priceType: values.priceType,
    //     unitPriceSetId: values.unitPriceSetId,
    //     fixedPrice: values.fixedPrice,
    //     ev_div: false,
    //     erp: values.erp,
    //     activeStationYN: values.activestationyn === true ? 'Y' : 'N',
    //     haveCarWash: values.haveCarWash,
    //   };
    // }

    await postApi(
      {
        url: `/charging-stations-manage`,
        data: chargingStationData,
      },
      setState,
      // (error) => {
      //   if (error.errorCode === 'STATION_ID_IS_EXIST') {
      //     setAlertModal({
      //       ...alertModal,
      //       open: true,
      //       type: 'error',
      //       title: '이미 충전소가 등록된 사업장입니다.',
      //       content: '충전소가 등록되지 않은 다른 사업장을 선택해주세요.',
      //     });
      //     return false;
      //   } else {
      //     setAlertModal({
      //       ...alertModal,
      //       open: true,
      //       type: 'error',
      //       title: error.errorCode,
      //       content: error.message,
      //     });
      //     return false;
      //   }
      // },
    );
  }

  useEffect(() => {
    // 등록 완료
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      refetch();
      setState({
        ...state,
        isSuccess: false,
      });
      handleCloseModal();
    }
    if (state.error?.errorCode) {
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

  function handleOk() {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function searchAddressToCoordinate(address: string) {
    if (!address) {
      alert('주소를 입력해주세요.');
      return;
    }
    naver.maps.Service.geocode({ query: address }, function (status, response) {
      if (status === naver.maps.Service.Status.ERROR) {
        alert('주소 변환에 실패하였습니다.');
        return;
      }
      if (response.v2.meta.totalCount === 0) {
        alert('주소를 찾을 수 없습니다.');
        return;
      }
      const item = response.v2.addresses[0];
      setCoordinate({
        latitude: parseFloat(item.y),
        longitude: parseFloat(item.x),
      });
    });
  }

  function onSearchAddress(address: string) {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${address}&analyze_type=simmilar&size=15&page=1`;
    if (address) {
      axios
        .get(url, {
          headers: {
            Authorization: 'KakaoAK b56e43936b4c0602e01dcf52949c0512',
          },
        })
        .then((result: any) => {
          const addreses = result?.data?.documents;
          var next = true;
          if (addreses.length > 0) {
            addreses.forEach(function (address: any) {
              if (address.road_address_name) {
                next = false;
              }
            });
          }
          if (addreses.length > 0 && !next) {
            setIsShowAddressList(true);
            setAdressList(addreses);
          } else {
            setIsShowAddressList(false);
            setAdressList([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setTimeout(() => {
        setIsShowAddressList(false);
        setAdressList([]);
      }, 500);
    }
  }

  useEffect(() => {
    if (onSelectAddress) {
      setIsShowAddressList(false);
      setOnSelectAddress(false);
    }
  }, [onSelectAddress]);

  useEffect(() => {
    form.setFieldValue(
      'coordinate',
      coordinate?.latitude.toString() + ', ' + coordinate?.longitude.toString(),
    );
  }, [coordinate]);
  // console.log(haveCarWash);
  const handleOnChange = (e: any) => {
    if (e?.target.checked) {
      setActiveCheck(true);
      form.setFieldsValue({
        chrgStartTime: '',
        chrgEndTime: '',
      });
    } else {
      setActiveCheck(false);
    }
  };
  const validateChrgTime = async (_: any, value: any) => {
    const chrgStartTime = dayjs(form.getFieldValue('chrgStartTime')).format(
      'HH:mm',
    );
    const chrgEndTime = dayjs(form.getFieldValue('chrgEndTime')).format(
      'HH:mm',
    );
    if (
      form.getFieldValue('chrgStartTime') &&
      form.getFieldValue('chrgEndTime')
    ) {
      if (
        !activeCheck &&
        chrgStartTime === chrgEndTime &&
        chrgStartTime !== '00:00'
      ) {
        return await Promise.reject(
          new Error('시작 시간과 종료 시간을 동일하게 지정할 수 없습니다.'),
        );
      }
      if (
        !activeCheck &&
        dayjs(chrgStartTime, 'HH:mm').isAfter(dayjs(chrgEndTime, 'HH:mm'))
      ) {
        return await Promise.reject(
          new Error('시작시간은 종료시간보다 이전으로 설정되어야 합니다.'),
        );
      }
    }

    await Promise.resolve();
  };
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
      <Modal
        open={isModalOpen}
        title="충전소 등록"
        close={handleCloseModal}
        style={{ width: 1340 }}
      >
        <StyledForm
          form={form}
          name="charging-station-register"
          colon={false}
          initialValues={{
            status: 'active',
            haveCarWash: 'N',
            orgId: 'EV 사업팀',
            category: 'EV사업팀',
            chgs_station_id_type: '9993',
          }}
        >
          {/* <StyledFormItem
            name="orgId"
            label="사업장"
            rules={[
              {
                required: true,
                message: '사업장 선택',
              },
            ]}
          >
            <StyledSelect
              showSearch
              loading={loading}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children
                  ?.toLowerCase()
                  ?.indexOf(input?.toLowerCase()) >= 0
              }
              placeholder="사업장 선택"
              onChange={(e, props: any) => {
                const accessToken = localStorage.getItem('accessToken') ?? '';
                if (!accessToken) {
                  return;
                }

                if (props.value === 'EV사업부') {
                  setIsReadonly(false);
                  form.setFieldsValue({
                    category: 'EV사업부',
                    haveCarWash: 'Y',
                    chgs_car_wash_yn: true,
                    area: '',
                    branch: '',
                    chgs_station_id_type: '',
                    address: '',
                    // coordinate: '',
                    erp: '',
                  });
                } else {
                  setIsReadonly(true);
                  const axios = hdoInstance();
                  axios
                    .get(`/orgs/${e as string}`, {
                      headers: {
                        Authorization: accessToken,
                        'Content-Type': 'multipart/form-data',
                      },
                    })
                    .then((result) => {
                      const checkStation =
                        result.data.result.chargingStation === null;
                      if (checkStation) {
                        if (props) {
                          searchAddressToCoordinate(
                            result?.data?.result?.address,
                          );
                          form.setFieldsValue({
                            category: category(result?.data?.result?.category),
                            area: result?.data?.result?.areaName,
                            branch: result?.data?.result?.branchName,
                            address: result?.data?.result?.address,
                            haveCarWash: result?.data?.result?.haveCarWash,
                            erp: result?.data?.result?.erp,
                            chgs_station_id_type:
                              (result?.data?.result?.branch as string) +
                              (result?.data?.result?.category === 'STT_DIR'
                                ? '1'
                                : '2'),
                          });
                          if (result?.data?.result?.haveCarWash === 'Y') {
                            form.setFieldValue('chgs_car_wash_yn', true);
                          } else {
                            form.setFieldValue('chgs_car_wash_yn', false);
                            form.resetFields(['washStartTime', 'washEndTime']);
                          }
                          if (!result?.data?.result?.haveCarWash) {
                            form.resetFields([
                              // 'chgs_car_wash_yn',
                              'washStartTime',
                              'washEndTime',
                            ]);
                          }
                        }
                      }
                      if (!checkStation) {
                        setAlertModal({
                          ...alertModal,
                          open: true,
                          type: 'error',
                          title: '이미 충전소가 등록된 사업장입니다.',
                          content:
                            '충전소가 등록되지 않은 다른 사업장을 선택해주세요.',
                        });
                        return false;
                      }
                    })
                    .catch(() => {
                      console.log(error);
                    });
                }
              }}
            >
              <Select.Option value="EV사업부">EV사업부</Select.Option>
              {data?.map((item) => {
                if (item !== null) {
                  return (
                    // <Select.Option key={item.id} value={item.id} {...item}>
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                }
                return null;
              })}
            </StyledSelect>
          </StyledFormItem> */}
          <StyledFormItem name="orgId" label="사업장">
            <StyledInput readOnly />
          </StyledFormItem>
          <StyledFormItem name="category" label="구분">
            <StyledInput placeholder="사업장 선택" readOnly />
          </StyledFormItem>
          <div style={{ gridColumn: '3 / span 1', gridRow: '1 / span 5' }}>
            <StationMaps coordinate={coordinate} />
          </div>
          {/* {isReadonly ? (
            <>
              <StyledFormItem name="area" label="부문">
                <StyledInput placeholder="사업장 선택" readOnly={isReadonly} />
              </StyledFormItem>
              <StyledFormItem name="branch" label="지사">
                <StyledInput placeholder="사업장 선택" readOnly={isReadonly} />
              </StyledFormItem>
            </>
          ) : (
            <> */}
          <AreaSelectList
            form={true}
            onChange={(e: any) => {
              setAreaNo(e);
              form.setFieldsValue({
                branch: '',
              });
              form.setFieldsValue({
                chgs_station_id_type: 9993,
              });
            }}
            // rules={[{ required: true, message: '부문을 입력해주세요' }]}
          />
          <BranchSelectList
            areaNo={areaNo}
            form={true}
            // rules={[{ required: true, message: '지사을 입력해주세요' }]}
            onChange={(e: any) => {
              // console.log(e);
              form.setFieldsValue({
                branch: e,
              });
              // console.profile(e);

              form.setFieldsValue({
                chgs_station_id_type: String(e) + code,
              });
            }}
          />
          {/* </>
          )} */}
          <StyledFormItem
            name="chgs_name"
            label="충전소명"
            rules={[
              { required: true, message: '충전소명을 입력해주세요' },
              {
                max: 20,
                message: '최대 20글자입니다.',
              },
            ]}
          >
            <StyledInput placeholder="충전소명을 입력해주세요" />
          </StyledFormItem>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <StyledFormItem
              name="chgs_station_id_type"
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
              label="충전소ID"
            >
              <StyledInput placeholder="사업장 선택" readOnly={true} />
            </StyledFormItem>
            <span
              style={{
                fontSize: '16px',
                lineHeight: '40px',
                padding: '0 8px',
              }}
            >
              -
            </span>
            <StyledFormItem
              name="chgs_station_id_name"
              rules={[
                {
                  required: true,
                  message: '충전소ID를 입력해주세요',
                },
                {
                  min: 2,
                  message: '최소 2글자입니다.',
                },
                {
                  max: 5,
                  message: '최대 5글자입니다.',
                },
              ]}
            >
              <StyledInput placeholder="2~5글자 입력" width="70px" />
            </StyledFormItem>
          </div>
          <StyledFormItem name="region" label="지역">
            <StyledSelect>
              <Select.Option value="서울">서울</Select.Option>
              <Select.Option value="경기도">경기도</Select.Option>
              <Select.Option value="인천">인천</Select.Option>
              <Select.Option value="강원">강원</Select.Option>
              <Select.Option value="충북">충북</Select.Option>
              <Select.Option value="세종">세종</Select.Option>
              <Select.Option value="대전">대전</Select.Option>
              <Select.Option value="충남">충남</Select.Option>
              <Select.Option value="전북">전북</Select.Option>
              <Select.Option value="광주">광주</Select.Option>
              <Select.Option value="전남">전남</Select.Option>
              <Select.Option value="경북">경북</Select.Option>
              <Select.Option value="대구">대구</Select.Option>
              <Select.Option value="울산">울산</Select.Option>
              <Select.Option value="경남">경남</Select.Option>
              <Select.Option value="부산">부산</Select.Option>
              <Select.Option value="제주">제주</Select.Option>
            </StyledSelect>
          </StyledFormItem>
          <div style={{ position: 'relative', gridColumn: 'auto / span 2' }}>
            <StyledFormItem
              name="address"
              label="주소"
              style={{ gridColumn: 'auto / span 2' }}
              rules={[
                {
                  required: true,
                  message: '주소을 입력해주세요.',
                },
              ]}
            >
              <StyledInput
                placeholder="사업장 선택"
                readOnly={false}
                autoComplete="off"
                onChange={(event) => {
                  onSearchAddress(event?.target?.value);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setIsShowAddressList(false);
                  }, 200);
                }}
                onFocus={() => {
                  setIsShowAddressList(true);
                }}
              />
            </StyledFormItem>
            {isShowAddressList && addressList.length > 0 && (
              <StyleDivAdress style={{ zIndex: 1000 }}>
                {addressList?.map(
                  (
                    value: {
                      id: 0;
                      address_name: '';
                      place_name: '';
                      x: '';
                      y: '';
                    },
                    index: number,
                  ) => {
                    return (
                      <div
                        key={value.id}
                        style={{ padding: '5px 0', cursor: 'pointer' }}
                        onClick={(event) => {
                          setOnSelectAddress(true);
                          setSelectedAddress(true);
                          form.setFieldValue(
                            'address',
                            `${value?.address_name} (${value?.place_name})`,
                          );
                          setAdress(
                            `${value?.address_name} (${value?.place_name})`,
                          );
                          setCoordinate({
                            latitude: parseFloat(value.y),
                            longitude: parseFloat(value.x),
                          });
                        }}
                      >{`${value?.address_name} (${value?.place_name})`}</div>
                    );
                  },
                )}
              </StyleDivAdress>
            )}
          </div>
          <StyledFormItem
            name="coordinate"
            label="위치 계정정보"
            style={{ gridColumn: 'auto / span 2' }}
          >
            <StyledInput placeholder="사업장 선택" readOnly={true} />
          </StyledFormItem>
          <StyledFormItem
            name="erp"
            label="ERP 계정정보"
            rules={[
              // {
              //   required: true,
              //   message: 'ERP 계정정보을 입력해주세요.',
              // },
              {
                max: 20,
                message: '최대 20글자입니다.',
              },
            ]}
          >
            <StyledInput placeholder="계정정보를 입력하세요" />
          </StyledFormItem>
          <StyledFormItem
            name="status"
            label="운영"
            // style={{ gridColumn: 'auto / span 2' }}
          >
            <StyledRadio buttonStyle="solid">
              <StyledRadioBtn value="active">운영</StyledRadioBtn>
              <StyledRadioBtn value="inactive">정지</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem>
          <StyledFormItem name="haveCarWash" label="세차장">
            <StyledRadio
              buttonStyle="solid"
              // disabled={isReadonly}
              // onChange={(e) => {
              //   if (e.target.value === 'Y') {
              //     form.setFieldValue('chgs_car_wash_yn', true);
              //   } else {
              //     form.setFieldValue('chgs_car_wash_yn', false);
              //   }
              // }}
            >
              <StyledRadioBtn value="Y">있음</StyledRadioBtn>
              <StyledRadioBtn value="N">없음</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem>{' '}
          {/* <StyledFormItem name="chgs_kepco_meter_no" label="한국전력고지번호">
            <StyledInput placeholder="고지번호를 입력하세요" />
          </StyledFormItem> */}
          {/* <StyledFormItem name="chgs_operator_manager_id" label="현장담당자">
            <StyledSelect
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="담당자를 선택해주세요"
            ></StyledSelect>
          </StyledFormItem> */}
          <div></div>
          <div style={{ height: '70px', position: 'relative' }}>
            <div style={{ position: 'absolute' }}>
              {' '}
              <StyledFormItem label="충전소 운영시간" type="date">
                <div
                  style={{
                    width: '690px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Form.Item
                    name="test"
                    valuePropName="activestationyn"
                    style={{ width: '30px' }}
                  >
                    <Checkbox
                      onChange={(e) => {
                        handleOnChange(e);
                      }}
                    ></Checkbox>
                  </Form.Item>
                  <div style={{ margin: '0 20px' }}>24시간</div>

                  <StyledFormItem
                    name="chrgStartTime"
                    rules={[{ validator: validateChrgTime }]}
                  >
                    <TimePicker
                      placeholder="시작시간"
                      format={'HH:mm'}
                      minuteStep={10}
                      disabled={activeCheck}
                    />
                  </StyledFormItem>
                  <StyledFormItem
                    name="chrgEndTime"
                    type="date"
                    rules={[{ validator: validateChrgTime }]}
                  >
                    <TimePicker
                      placeholder="종료시간"
                      format={'HH:mm'}
                      minuteStep={10}
                      disabled={activeCheck}
                    />
                  </StyledFormItem>
                </div>
              </StyledFormItem>
            </div>
          </div>
          {/*  <StyledFormItem name="chgs_car_wash_yn" label="세차장 사용 여부">
            <StyledRadio
              buttonStyle="solid"
              disabled={haveCarWash === 'N' || !haveCarWash}
              onChange={(e) => {
                if (!e.target.value) {
                  form.resetFields(['washStartTime', 'washEndTime']);
                }
              }}
            >
              <StyledRadioBtn value={true}>사용</StyledRadioBtn>
              <StyledRadioBtn value={false}>미사용</StyledRadioBtn>
            </StyledRadio>
          </StyledFormItem>
          <StyledFormItem label="세차장 운영시간" type="date">
            <StyledFormItem
              name="washStartTime"
              // rules={[
              //   {
              //     required: useCarWash,
              //     message: '세차장 시작시간을 선택하세요',
              //   },
              // ]}
            >
              <TimePicker
                disabled={!useCarWash}
                placeholder="시작시간"
                format={'HH:mm'}
                minuteStep={10}
              />
            </StyledFormItem>
            <StyledFormItem
              name="washEndTime"
              type="date"
              // rules={[
              //   {
              //     required: useCarWash,
              //     message: '세차장 종료시간을 선택하세요',
              //   },
              // ]}
            >
              <TimePicker
                disabled={!useCarWash}
                placeholder="종료시간"
                format={'HH:mm'}
                minuteStep={10}
              />
            </StyledFormItem>
          </StyledFormItem> */}
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

export default ChargingStationRegister;
