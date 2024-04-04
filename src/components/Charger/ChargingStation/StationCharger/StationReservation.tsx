import {
  Form,
  Select,
  Radio,
  type RadioChangeEvent,
  DatePicker,
  TimePicker,
} from 'antd';

import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { Button } from 'components/common/Button/Button';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useGetListWtTrigger } from 'hooks/useGetListWt';
import { postApi } from 'apis/postApi';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';
import { type StateInterface } from 'interfaces/ICommon';
import { CPHContainer } from '../../../../pages/cs/CSHome/Model/styled';
import dayjs from 'dayjs';

// 스타일
import {
  StyledForm,
  StyledSelect,
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';

// import { FormContainer, FormItemWrap } from '../Station.styled';
// import { ChargerModel } from 'utils/stationUtils';
// import { CodeLookUp } from 'utils/codelookup';
// import { hdoInstance } from 'apis/hdoInstance';
import { StationReservationGrid } from './StationReservationGrid';
interface StationReservationProps {
  isModalOpenReservation: boolean;
  setIsModalOpenReservation: Dispatch<SetStateAction<boolean>>;
  chgUnitPrice?: any;
  listUnitPrice?: any;
  chargerId?: number | '';
}

const StationReservation = ({
  isModalOpenReservation,
  setIsModalOpenReservation,
  chgUnitPrice,
  listUnitPrice,
  chargerId,
}: StationReservationProps) => {
  // 모달 Open state
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 1,
    odby: 'DESC',
  });
  const { loading, error, data, getData, clearError, totalCount } =
    useGetListWtTrigger<any>();

  const getStationReservation = () => {
    void getData({
      url: `/unit-price-reservation?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&chargerId=${chargerId}`,
    });
  };
  const [state, setState] = useState<StateInterface>({
    isSuccess: false,
    error: null,
    isLoading: false,
  });
  // Form
  const [form] = Form.useForm();
  const [priceOption, setpriceOption] = useState('N');
  // const [unitPrice, seUnitPrice] = useState<any>();
  // const [defaultUnitPrice, setDefaultUnitPrice] = useState<number>();
  // const [fileUrl, setFileUrl] = useState<string>('');
  // const [isData, setData] = useState('');
  // const [isDataStatus, setDataStatus] = useState('');

  // utils 함수
  // const { loadingChargerModelList, ChargerModelList } = ChargerModel();
  // const { ManufacturerInfo, ConnectorTypeInfo, SpeedTypeInfo } = CodeLookUp();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const handleCloseModal = () => {
    setIsModalOpenReservation(false);
    form.resetFields();
    reload();
  };
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });
  };
  useEffect(() => {
    var currentDateTime = new Date();
    form.setFieldsValue({
      date: dayjs(currentDateTime),
      timeDate: dayjs(currentDateTime),
    });
    // console.log(listUnitPrice);
    getStationReservation();
  }, [chargerId]);

  const handlePriceOption = (e: RadioChangeEvent) => {
    setpriceOption(e.target.value);
    // if (e.target.value === 'Y') {

    // } else {

    // }
  };
  function toDatetime(date: dayjs.Dayjs, time: dayjs.Dayjs) {
    return (
      String(date.format('YYYY-MM-DD')) +
      ' ' +
      String(String(time.format('HH:mm')) + ':00')
    );
  }
  async function onFinish(values: any) {
    const addData = {
      priceOption: priceOption,
      floatingPrice: priceOption === 'Y' ? values?.FloatingPrice : '',
      fixedPrice: priceOption === 'N' ? values?.FixedPrice : '',
      date: toDatetime(values?.date, values?.timeDate),
      chargerId: chargerId,
    };

    await postApi(
      {
        url: `/unit-price-reservation`,
        data: addData,
      },
      setState,
    );
    // const accessToken = localStorage.getItem('accessToken') ?? '';
    // const axios = hdoInstance();

    // await axios.post(`/unit-price-reservation`, addData, {
    //   headers: {
    //     Authorization: accessToken,
    //   },
    // });

    // getStationReservation();
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
      getStationReservation();
    }
    if (state?.error) {
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
    // console.log(priceOption);
    // console.log(form.getFieldValue('FixedPrice'));
    if (
      priceOption === 'N' &&
      (form.getFieldValue('FixedPrice') === '' ||
        !form.getFieldValue('FixedPrice'))
    ) {
      alert('변경 단가를 입력해 주세요.');
      return false;
    }
    if (
      priceOption === 'Y' &&
      (form.getFieldValue('FloatingPrice') === '' ||
        !form.getFieldValue('FloatingPrice'))
    ) {
      alert('변경 단가를 입력해 주세요.');
      return false;
    }

    form
      .validateFields()
      .then((values: any) => {
        void onFinish(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Modal
      open={isModalOpenReservation}
      title="단가변경 예약"
      close={handleCloseModal}
    >
      <StyledForm
        form={form}
        name="StationReservation"
        colon={false}
        type="modal"
        gridcol="1fr"
      >
        <CPHContainer style={{ overflow: 'auto' }}>
          <table className="nl-tbl-detail">
            <tbody>
              <tr>
                <th>예약 일시</th>
                <td
                  style={{
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    border: '0px',
                  }}
                >
                  <StyledFormItem name="date" style={{ marginBottom: '0px' }}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      picker="date"
                      placeholder="YYYY-MM-DD"
                    />
                  </StyledFormItem>
                  <StyledFormItem
                    name="timeDate"
                    style={{ marginLeft: '10px', marginBottom: '0px' }}
                    rules={[
                      {
                        required: true,
                        message: '시작시간를 입력해주세요.',
                      },
                    ]}
                  >
                    <TimePicker
                      format={'HH:mm'}
                      placeholder="시작시간"
                      minuteStep={5}
                    />
                  </StyledFormItem>
                </td>
              </tr>
              <tr>
                <th>단가</th>
                <td>
                  <Radio.Group
                    value={priceOption}
                    onChange={handlePriceOption}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      // paddingTop: 10,
                    }}
                  >
                    <Radio
                      value="N"
                      style={{
                        width: '100%',
                        marginRight: '0',
                        // padding: '0px',
                        // display: 'grid',
                        // gridTemplateColumns: 'auto calc(100% - 6px)',
                      }}
                    >
                      <StyledFormItem
                        name="FixedPrice"
                        label="고정단가"
                        style={{
                          display: 'flex',
                          gap: '10px',
                          margin: 0,
                        }}
                      >
                        <StyledInput
                          disabled={priceOption === 'Y'}
                          style={{ width: '200px' }}
                          type="number"
                        />
                      </StyledFormItem>
                    </Radio>
                    {/* <div
                      style={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                      <Radio
                        value="Y"
                        style={{
                          width: '15px',
                          marginRight: '10px',
                          // display: 'grid',
                          // gridTemplateColumns: 'auto calc(100% - 6px)',
                        }}
                      ></Radio>
                      <StyledFormItem name="FloatingPrice" label="유동단가">
                        <StyledSelect
                          disabled={priceOption === 'N'}
                          style={{ width: '200px' }}
                        >
                          {listUnitPrice?.map((item: any) => {
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
                    </div> */}
                  </Radio.Group>
                </td>
              </tr>
            </tbody>
          </table>
        </CPHContainer>
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            size="md"
            color="primary"
            margin="0px"
            minWidth="150px"
            onClick={handleOk}
          >
            저장
          </Button>
        </div>
        <StationReservationGrid
          queryState={queryState}
          setQueryState={setQueryState}
          loading={loading}
          data={data}
          totalCount={totalCount}
          state={state}
          setState={setState}
          chargerId={chargerId}
        />
      </StyledForm>
      {/* <ModalFooter /> */}
    </Modal>
  );
};
export default StationReservation;
