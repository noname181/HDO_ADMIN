import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

// antd
import { Select, TimePicker, Form, Checkbox } from 'antd';

// api
import { defaultUrl } from 'apis/api.helpers';
import { putApi } from 'apis/putApi';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';

// 전역상태관리
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';

// 공통컴포넌트
import { Modal, ModalFooter } from 'components/common/Modal/Modal';

// 하위컴포넌트
import { StationCharger } from 'components/Charger/ChargingStation/StationCharger/StationCharger';
import { StationMaps } from './StationMap';

// 유틸
import dayjs from 'dayjs';
import { category } from 'utils/stationUtils';
import {
  areaText,
  branchText,
  AreaSelectList,
  BranchSelectList,
} from 'utils/codelookup';

// 타입
import { type StationInterface } from 'interfaces/ICharger';
import { type CoordinateInterface } from 'NaverMaps';
import { type StateInterface } from 'interfaces/ICommon';
// 스타일
import * as Styled from 'components/common/test/Styled.ant';
import { hdoInstance } from 'apis/hdoInstance';
import { StyleDivAdress } from 'components/common/test/Styled.ant';
import axios from 'axios';

interface ChargingStationEditProps {
  state: StateInterface;
  setState: Dispatch<SetStateAction<StateInterface>>;
  stationId: number | '';
  setStationId: Dispatch<SetStateAction<number | ''>>;
  reload: () => void;
  from?: string;
}

const ChargingStationEdit = ({
  state,
  setState,
  stationId,
  setStationId,
  reload,
  from,
}: ChargingStationEditProps) => {
  // Form 상태
  const [form] = Form.useForm();
  const haveCarWash = Form.useWatch('haveCarWash', form);
  const useCarWash = Form.useWatch('chgs_car_wash_yn', form);
  // Edit 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCheck, setActiveCheck] = useState<boolean>(false);
  // Alert 모달
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  // Map 좌표
  const [coordinate, setCoordinate] = useState<CoordinateInterface>({
    latitude: 37.5594437,
    longitude: 126.8551813,
  });

  // 모달 닫는 함수
  const handleCloseModal = () => {
    setIsReadonly(true);
    setAdressList([]);
    setIsShowAddressList(false);
    setStationId('');
    setIsModalOpen(false);
    setSelectedAddress(false);
    form.resetFields();
  };
  const [isReadonly, setIsReadonly] = useState<boolean>(true);
  const [isReadonlyStationID, setIsReadonlyStationId] = useState<boolean>(true);

  const [addressList, setAdressList] = useState<any>([]);
  const [address, setAdress] = useState<any>(null);
  const [isShowAddressList, setIsShowAddressList] = useState<boolean>(false);
  const [onSelectAddress, setOnSelectAddress] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<boolean>(false);
  const [isReadonlyALL, setIsReadonlyALL] = useState<boolean>(false);
  const [areaNo, setAreaNo] = useState('');
  const [areaCheck, setareaCheck] = useState('');
  const [code, setCode] = useState<string>('0');
  // api 호출 준비
  const { loading, error, data, getData } =
    useGetDataWtTrigger<StationInterface>();

  useEffect(() => {
    // stationId를 받아오면 api 호출
    if (stationId !== '') {
      void getData({
        url: `/v1/admin/stations/${stationId}`,
      });
    }
  }, [stationId]);
  useEffect(() => {
    // stationId를 받아오면 api 호출
    if (from === 'cs-home') {
      setIsReadonlyALL(true);
    } else {
      setIsReadonlyALL(false);
    }
  }, [from]);

  // api 호출 후 data를 받아오면 실행
  useEffect(() => {
    // console.log(data);
    if (data !== null) {
      // console.log(data?.chgs_station_id === null);
      // console.log(haveCarWash);
      data?.org?.category && handleSetCode(data?.org?.category);
      // 충전소 coordinate가 없을 시 주소 => 좌표 변환
      if (data?.coordinate?.latitude === null) {
        searchAddressToCoordinate(data?.org?.address);
      }
      if (data?.org?.category === 'EV_DIV') {
        setIsReadonly(false);
      } else {
        setIsReadonly(true);
      }
      if (!data?.chgs_station_id || data?.chgs_station_id === '') {
        setIsReadonlyStationId(false);
        if (data?.org?.branch) {
          form.setFieldsValue({
            chgs_station_id_type: String(data?.org?.branch) + code,
          });
        } else {
          form.setFieldsValue({
            chgs_station_id_type: 9993,
          });
        }
      } else {
        setIsReadonlyStationId(true);
        form.setFieldsValue({
          chgs_station_id_type: data?.chgs_station_id?.split('-')[0],
          chgs_station_id_name: data?.chgs_station_id?.split('-')[1],
        });
      }
      // charging-station-edit form 데이터 입력
      setCoordinate(data?.coordinate);
      form.setFieldsValue({
        // orgId: data?.orgId,
        erp: data?.org?.erp,
        orgId: data?.org?.category === 'EV_DIV' ? 'EV 사업팀' : data?.org?.name,
        category:
          data?.org?.category === 'EV_DIV'
            ? 'EV사업팀'
            : category(data?.org?.category),
        area: String(data?.org?.areaName ?? '') ?? data?.org?.area,
        branch: data?.org?.branch,
        chgs_name: data?.chgs_name,
        chgs_station_id: data?.chgs_station_id,

        address: data?.org?.address,
        // erp: data?.erp,
        coordinate:
          data?.coordinate?.latitude?.toString() +
          ', ' +
          data?.coordinate?.longitude?.toString(),
        status: data?.status,
        chgs_kepco_meter_no: data?.chgs_kepco_meter_no,
        chgs_operator_manager_id: data?.chgs_operator_manager_id,
        haveCarWash: data?.org?.haveCarWash,

        chgs_car_wash_yn: data?.chgs_car_wash_yn,
        chrgStartTime: data?.chrgStartTime
          ? dayjs(data?.chrgStartTime, 'HH:mm')
          : null,
        chrgEndTime: data?.chrgEndTime
          ? dayjs(data?.chrgEndTime, 'HH:mm')
          : null,
        washStartTime: data?.washStartTime
          ? dayjs(data?.washStartTime, 'HH:mm')
          : null,
        washEndTime: data?.washEndTime
          ? dayjs(data?.washEndTime, 'HH:mm')
          : null,
        activestationyn: data?.activeStationYN === 'Y' ?? false,
        region: data?.org?.region,
      });
      setAreaNo(data?.org?.area || '');
      setAdress(data?.org?.address);
      setActiveCheck(data?.activeStationYN === 'Y');
      setareaCheck(String(data?.org?.areaName));
      // 모달 열림
      setIsModalOpen(true);
    }
  }, [data]);

  // 주소 -> 좌표 변환 function
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
        // alert('주소를 찾을 수 없습니다.');
        return;
      }
      const item = response.v2.addresses[0];
      setCoordinate({
        latitude: parseFloat(item.y),
        longitude: parseFloat(item.x),
      });
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

  // coordinate 변경
  useEffect(() => {
    form.setFieldValue(
      'coordinate',
      coordinate?.latitude && coordinate?.longitude
        ? coordinate?.latitude?.toString() +
            ', ' +
            coordinate?.longitude?.toString()
        : '',
    );
  }, [coordinate]);

  // 모달 저장
  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        // form.resetFields();
        void onFinish(values);
      })
      .catch((error: any) => {
        console.log(error);

        // setAlertModal({
        //   ...alertModal,
        //   open: true,
        //   type: 'error',
        //   title: 'Form 에러',
        //   content: error,
        // });
      });
  };

  // 폼제출
  async function onFinish(values: any) {
    // console.log(values);
    let chargingStationData;
    if (values.orgId === 'EV 사업팀') {
      chargingStationData = {
        address: address,
        area: values.area,
        branch: values.branch ? values.branch : null,
        erp: values.erp,
        // category: values.category,
        chgs_station_id:
          (values.chgs_station_id_type as string) +
          '-' +
          (values.chgs_station_id_name as string),

        chgs_name: values.chgs_name,
        // orgId: values.orgId,
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
        chgs_car_wash_yn: values.chgs_car_wash_yn,
        washStartTime: values.washStartTime
          ? dayjs(values.washStartTime).format('HH:mm')
          : null,
        washEndTime: values.washEndTime
          ? dayjs(values.washEndTime).format('HH:mm')
          : null,
        ev_div: true,
        haveCarWash: values.haveCarWash,
        activeStationYN: values.activestationyn === true ? 'Y' : 'N',
        region: values.region,
      };
    } else {
      chargingStationData = {
        chgs_name: values.chgs_name,
        // orgId: values.orgId,
        area: values.area,
        branch: values.branch ? values.branch : null,
        status: values.status,
        erp: values.erp,
        coordinate,
        chgs_kepco_meter_no: values.chgs_kepco_meter_no ?? null,
        chgs_operator_manager_id: values.chgs_operator_manager_id ?? null,
        chrgStartTime: values.chrgStartTime
          ? dayjs(values.chrgStartTime).format('HH:mm')
          : null,
        chrgEndTime: values.chrgEndTime
          ? dayjs(values.chrgEndTime).format('HH:mm')
          : null,
        chgs_car_wash_yn: values.chgs_car_wash_yn,
        washStartTime: values.washStartTime
          ? dayjs(values.washStartTime).format('HH:mm')
          : null,
        washEndTime: values.washEndTime
          ? dayjs(values.washEndTime).format('HH:mm')
          : null,
        activeStationYN: values.activestationyn === true ? 'Y' : 'N',
        haveCarWash: values.haveCarWash,
        chgs_station_id:
          (values.chgs_station_id_type as string) +
          '-' +
          (values.chgs_station_id_name as string),
        region: values.region,
      };
    }

    await putApi(
      {
        url: `/charging-stations-manage/${stationId}`,
        data: chargingStationData,
      },
      setState,
    );
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

  // 폼제출 후 state 상태로 분기 처리
  useEffect(() => {
    // 등록 완료
    if (state.isSuccess) {
      // 모달 창 닫기
      handleCloseModal();
    }
  }, [state]);
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
  // useEffect(() => {
  //   console.log(isReadonly);
  // }, [isReadonly]);

  return (
    <Modal
      open={isModalOpen}
      title="충전소 정보"
      close={handleCloseModal}
      style={{ width: 1340 }}
    >
      <Styled.StyledForm form={form} name="charging-station-edit" colon={false}>
        <Styled.StyledFormItem name="orgId" label="사업장">
          <Styled.StyledInput readOnly />
        </Styled.StyledFormItem>
        <Styled.StyledFormItem name="category" label="구분">
          <Styled.StyledInput readOnly />
        </Styled.StyledFormItem>
        <div style={{ gridColumn: '3 / span 1', gridRow: '1 / span 5' }}>
          {coordinate.latitude && coordinate.longitude && (
            <StationMaps coordinate={coordinate} />
          )}
          {!coordinate.latitude && !coordinate.longitude && (
            <Styled.AddressNotFound>
              <img
                className="nl-icon"
                src="/assets/img/icon/icon_info.png"
                alt="icon-note"
                style={{ marginBottom: '5px' }}
              />
              주소를 찾을 수 없습니다.
            </Styled.AddressNotFound>
          )}
        </div>
        {/* {isReadonly ? (
          <>
            <Styled.StyledFormItem name="area" label="부문">
              <Styled.StyledInput readOnly={isReadonly || isReadonlyALL} />
            </Styled.StyledFormItem>
            <Styled.StyledFormItem name="branch" label="지사">
              <Styled.StyledInput readOnly={isReadonly || isReadonlyALL} />
            </Styled.StyledFormItem>
          </>
        ) : (
          <> */}
        <AreaSelectList
          form={true}
          value={areaCheck ?? areaNo ?? data?.org?.area}
          onChange={(e: any) => {
            // console.log(e);
            setAreaNo(e);
            setareaCheck(e);
            form.setFieldsValue({
              branch: '',
            });
            if (!isReadonlyStationID) {
              form.setFieldsValue({
                chgs_station_id_type: 9993,
              });
            }
          }}
          disabled={isReadonlyALL}
          // rules={[{ required: true, message: '부문을 입력해주세요' }]}
        />
        <BranchSelectList
          areaNo={areaCheck ?? areaNo}
          form={true}
          disabled={isReadonlyALL}
          // rules={[{ required: true, message: '지사을 입력해주세요' }]}
          onChange={(e: any) => {
            // console.log(e);
            form.setFieldsValue({
              branch: e,
            });
            // console.profile(e);
            if (!isReadonlyStationID) {
              form.setFieldsValue({
                chgs_station_id_type: String(e) + code,
              });
            }
          }}
        />
        {/* </>
        )} */}
        <Styled.StyledFormItem
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
          <Styled.StyledInput
            placeholder="충전소명을 입력해주세요"
            readOnly={data?.createdBy === null ?? isReadonlyALL}
          />
        </Styled.StyledFormItem>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Styled.StyledFormItem
            name="chgs_station_id_type"
            rules={[
              {
                required: true,
                message: '',
              },
            ]}
            label="충전소ID"
          >
            <Styled.StyledInput placeholder="사업장 선택" readOnly={true} />
          </Styled.StyledFormItem>
          <span
            style={{
              fontSize: '16px',
              lineHeight: '40px',
              padding: '0 8px',
            }}
          >
            -
          </span>
          <Styled.StyledFormItem
            name="chgs_station_id_name"
            rules={[
              {
                required: true,
                message: '충전소ID를 입력해주세요',
              },
              // {
              //   min: 2,
              //   message: '최소 2글자입니다.',
              // },
              // {
              //   max: 5,
              //   message: '최대 5글자입니다.',
              // },
            ]}
          >
            <Styled.StyledInput
              placeholder="2~5글자 입력"
              width="70px"
              readOnly={isReadonlyStationID}
            />
          </Styled.StyledFormItem>
        </div>
        <Styled.StyledFormItem name="region" label="지역">
          <Styled.StyledSelect>
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
          </Styled.StyledSelect>
        </Styled.StyledFormItem>
        <div style={{ position: 'relative', gridColumn: 'auto / span 2' }}>
          <Styled.StyledFormItem
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
            <Styled.StyledInput
              readOnly={isReadonlyALL}
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
          </Styled.StyledFormItem>
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
        <Styled.StyledFormItem
          name="coordinate"
          label="위치 계정정보"
          style={{ gridColumn: 'auto / span 2' }}
        >
          <Styled.StyledInput readOnly={true} />
        </Styled.StyledFormItem>
        <Styled.StyledFormItem
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
          <Styled.StyledInput
            placeholder="계정정보를 입력하세요"
            readOnly={data?.createdBy === null ?? isReadonlyALL}
          />
        </Styled.StyledFormItem>
        <Styled.StyledFormItem
          name="status"
          label="운영"
          // style={{ gridColumn: 'auto / span 2' }}
        >
          <Styled.StyledRadio
            buttonStyle="solid"
            onChange={(e) => {
              // e.preventDefault();
              //   setAlertModal({
              //     ...alertModal,
              //     open: true,
              //     type: 'success',
              //     title: '운영상태 변경',
              //     content: `해당 충전소의 운영상태를 ${
              //       e.target.value as string
              //     }(으)로 변경하시겠습니까?`,
              //     onCancel() {
              //       return false;
              //     },
              //     onOk() {
              //       return true;
              //     },
              //   });
            }}
            disabled={isReadonlyALL}
          >
            <Styled.StyledRadioBtn value="ACTIVE">운영</Styled.StyledRadioBtn>
            <Styled.StyledRadioBtn value="INACTIVE">정지</Styled.StyledRadioBtn>
          </Styled.StyledRadio>
        </Styled.StyledFormItem>
        <Styled.StyledFormItem name="haveCarWash" label="세차장">
          <Styled.StyledRadio buttonStyle="solid">
            <Styled.StyledRadioBtn value="Y">있음</Styled.StyledRadioBtn>
            <Styled.StyledRadioBtn value="N">없음</Styled.StyledRadioBtn>
          </Styled.StyledRadio>
        </Styled.StyledFormItem>
        {/* <Styled.StyledFormItem
          name="chgs_kepco_meter_no"
          label="한국전력고지번호"
        >
          <Styled.StyledInput
            placeholder="고지번호를 입력하세요"
            readOnly={isReadonlyALL}
          />
        </Styled.StyledFormItem> */}
        {/* <Styled.StyledFormItem
          name="chgs_operator_manager_id"
          label="현장담당자"
        >
          <Styled.StyledSelect placeholder="담당자를 선택해주세요"></Styled.StyledSelect>
        </Styled.StyledFormItem> */}
        <div></div>
        <div style={{ height: '70px', position: 'relative' }}>
          <div style={{ position: 'absolute' }}>
            <Styled.StyledFormItem label="충전소 운영시간" type="date">
              <div
                style={{
                  width: '690px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Form.Item
                  name="activestationyn"
                  valuePropName="checked"
                  style={{ width: '30px' }}
                >
                  <Checkbox
                    disabled={isReadonlyALL}
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                  ></Checkbox>
                </Form.Item>
                <div style={{ margin: '0 20px' }}>24시간</div>
                <Styled.StyledFormItem
                  name="chrgStartTime"
                  rules={[{ validator: validateChrgTime }]}
                >
                  <TimePicker
                    placeholder="시작시간"
                    format={'HH:mm'}
                    minuteStep={10}
                    disabled={activeCheck || isReadonlyALL}
                  />
                </Styled.StyledFormItem>
                <Styled.StyledFormItem
                  name="chrgEndTime"
                  type="date"
                  rules={[{ validator: validateChrgTime }]}
                >
                  <TimePicker
                    placeholder="종료시간"
                    format={'HH:mm'}
                    minuteStep={10}
                    disabled={activeCheck || isReadonlyALL}
                  />
                </Styled.StyledFormItem>
              </div>
            </Styled.StyledFormItem>
          </div>
        </div>
        {/*   <Styled.StyledFormItem name="chgs_car_wash_yn" label="세차장 사용 여부">
          <Styled.StyledRadio
            buttonStyle="solid"
            disabled={!haveCarWash}
            onChange={(e) => {
              if (e.target.value === 'N') {
                form.resetFields(['washStartTime', 'washEndTime']);
              }
            }}
          >
            <Styled.StyledRadioBtn value="Y">사용</Styled.StyledRadioBtn>
            <Styled.StyledRadioBtn value="N">미사용</Styled.StyledRadioBtn>
          </Styled.StyledRadio>
        </Styled.StyledFormItem>
        <Styled.StyledFormItem label="세차장 운영시간" type="date">
          <Styled.StyledFormItem name="washStartTime">
            <TimePicker
              disabled={useCarWash === 'N'}
              placeholder="시작시간"
              format={'HH:mm'}
              minuteStep={10}
            />
          </Styled.StyledFormItem>
          <Styled.StyledFormItem name="washEndTime">
            <TimePicker
              disabled={useCarWash === 'N'}
              placeholder="종료시간"
              format={'HH:mm'}
              minuteStep={10}
            />
          </Styled.StyledFormItem>
        </Styled.StyledFormItem> */}
      </Styled.StyledForm>
      <StationCharger
        stationData={data}
        stationId={stationId}
        reload={reload}
        isReadonlyALL={isReadonlyALL}
      />
      <ModalFooter
        close={handleCloseModal}
        onOk={handleOk}
        okText="수정"
        isOk={!isReadonlyALL}
      />
    </Modal>
  );
};

export default ChargingStationEdit;

// const { loadingStationList, stationList } = Station(); 충전소 수정 시

/* <StyledSelect
    showSearch
    loading={loadingStationList}
    optionFilterProp="children"
    filterOption={(input, option) =>
      option?.children
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    }
    placeholder="주유소를 선택해주세요"
    onChange={(_, props: any) => {
      searchAddressToCoordinate(props.address);
      form.setFieldsValue({
        category: category(props?.category),
        area: areaText(props?.area),
        branch: branchText(props?.branch),
        chgs_name: '',
        address: props?.address,
        // erp: props?.erp ?? '없음',
      });
    }}
  >
    {stationList?.map((item) => {
      return (
        <Select.Option
          key={item.id}
          value={item.id}
          area={item.area}
          branch={item.branch}
          address={item.address}
          category={item.category}
        >
          {item.name}
        </Select.Option>
      );
    })}
  </StyledSelect> */
