import { useState, useEffect } from 'react';

import { Form, Input, Select } from 'antd';
// import { postApi } from 'apis/postApi';
// import { defaultUrl } from 'apis/api.helpers';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import { category } from 'utils/stationUtils';
import { CPHContainer } from './styled';

const ConsultantOutStandingPaymentModel = ({
  state,
  setState,
  isConsultantPayHistory,
  setIsConsultantPayHistory,
  payHisData,
  setPayHisData,
}: any) => {
  const [form] = Form.useForm();
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [pgCno, setpgCno] = useState('');
  const [disabledInput, setDisabledInput] = useState<boolean>(false);

  // const [clID, setClID] = useState<number | ''>('');
  const [payNoTiData, setPayNoTiData] = useState<any>();
  const [phoneShow, setphoneShow] = useState('');
  const [queryState, setQueryState] = useState({
    divCode: '',
    refundReason: '',
  });
  function handleCloseModal() {
    setIsConsultantPayHistory(false);
    form.resetFields();
    setPayHisData(null);
    setpgCno('');
    // setClID('');
    setCalculatedAmount(0);
    setQueryState({
      divCode: '',
      refundReason: '',
    });
  }
  async function onFinish(values: any) {
    setState({ ...state, isLoading: true, isSuccess: false });
    const addData = {
      // cl_id: clID,
      refundAmount: values?.refundAmount,
      pgCno,
      div_code: queryState.divCode,
      refund_reason: queryState.refundReason,
    };
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
          // handleCloseModal();
          setState({ ...state, isLoading: false, isSuccess: true });
        } else {
          setState({ ...state, isLoading: false, isSuccess: false });
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
        setState({ ...state, isLoading: false, isSuccess: false });
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
        let amount = '';
        if (values?.refundAmount) {
          amount = values?.refundAmount.toLocaleString();
        }
        if (Number(amount) > calculatedAmount) {
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'error',
            title: '환불하기',
            content: '환불가능한 최대금액을 초과하였습니다.',
          });
        } else {
          amount = new Intl.NumberFormat('en-US').format(Number(amount));
          setAlertModal({
            ...alertModal,
            open: true,
            type: 'alert',
            title: '환불',
            content: (
              <div>
                <span>{`환불 금액: `}</span>
                <span
                  style={{
                    fontSize: '1.5rem',
                    position: 'relative',
                    bottom: '-2px',
                    lineHeight: '29px',
                  }}
                >
                  {amount}원
                </span>
                <span>{`을 환불 하시겠습니까?`}</span>
              </div>
            ),
            okText: '확인',
            onOk() {
              void onFinish(values);
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const calculateRefundAmount = (paymentHistory: any) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/payment-notifications?cno=${paymentHistory?.cno}`;
    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;
    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        setPayNoTiData(result?.data?.result);
        let totalPay = 0;
        let totalRefund = 0;
        // eslint-disable-next-line array-callback-return
        result?.data?.result?.map((item: any) => {
          if (item.noti_type && item.noti_type === '10') {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            totalPay += item?.amount;
            setphoneShow(item?.phoneNoNewVersion || item?.phoneNoOldVersion);
          }
          if (item.noti_type && item.noti_type === '20') {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            totalRefund += item?.mgr_amt;
          }
        });
        setCalculatedAmount(totalPay - totalRefund);
        setpgCno(paymentHistory?.cno);
        // setClID(paymentHistory?.chargingLogs?.cl_id);
        form.setFieldsValue({
          refundAmount: totalPay - totalRefund,
        });
      })
      .catch((error) => {
        setpgCno('');
        console.log(error);
      });
    // setCalculatedAmount(0);
  };

  useEffect(() => {
    if (payHisData && isConsultantPayHistory) {
      calculateRefundAmount(payHisData);
    }
  }, [payHisData]);

  useEffect(() => {
    if (state.isSuccess) {
      handleCloseModal();
    }
  }, [state]);

  return (
    <>
      <Modal
        open={isConsultantPayHistory}
        title="미결제 내역"
        close={handleCloseModal}
      >
        <StyledForm
          form={form}
          name="ConsultantPayHistoryModel"
          colon={false}
          type="modal"
          gridcol="1fr"
        >
          <CPHContainer>
            <p className="nl-lbl">기본 정보</p>
            <table className="nl-tbl-detail">
              <tbody>
                <tr>
                  <th>번호</th>
                  <td>{payHisData?.auth_no}</td>
                  <th>부문</th>
                  <td>
                    {
                      payHisData?.sb_charger_memb?.chargingStation?.org
                        ?.areaName
                    }
                  </td>
                  <th>지사</th>
                  <td>
                    {
                      payHisData?.sb_charger_memb?.chargingStation?.org
                        ?.branchName
                    }
                  </td>
                </tr>
                <tr>
                  <th>구분</th>
                  <td>
                    {category(
                      payHisData?.sb_charger_memb?.chargingStation?.org
                        ?.category,
                    )}
                  </td>
                  <th>충전소명</th>
                  <td>
                    {payHisData?.sb_charger_memb?.chargingStation?.chgs_name}
                  </td>
                  <th>충전소 ID</th>
                  <td>
                    {
                      payHisData?.sb_charger_memb?.chargingStation
                        ?.chgs_station_id
                    }
                  </td>
                </tr>
                <tr>
                  <th>충전량</th>
                  <td>
                    {payHisData?.chargingLogs?.cl_kwh
                      ? new Intl.NumberFormat('en-US').format(
                          payHisData?.chargingLogs?.cl_kwh,
                        ) + 'kWh'
                      : ''}
                  </td>
                  <th>적용단가</th>
                  <td>
                    {payHisData?.chargingLogs?.appliedUnitPrice &&
                      new Intl.NumberFormat('en-US').format(
                        payHisData?.chargingLogs?.appliedUnitPrice,
                      ) + '원'}
                  </td>
                  <th>예약 충전 여부</th>
                  <td></td>
                </tr>
                <tr>
                  <th>인증방법</th>
                  <td>{payHisData?.chargingLogs?.useType}</td>
                  <th>회원구분</th>
                  <td>
                    {payHisData?.chargingLogs?.useType
                      ? payHisData?.chargingLogs?.useType === 'CREDIT'
                        ? '비회원'
                        : '회원'
                      : ''}
                  </td>
                  <th>사용자</th>
                  <td>
                    {payHisData?.chargingLogs?.userNew?.name}
                    {payHisData?.chargingLogs?.userNew?.accountId && ' ( '}
                    {payHisData?.chargingLogs?.userNew?.accountId}
                    {payHisData?.chargingLogs?.userNew?.accountId && ' )'}
                  </td>
                </tr>
                <tr>
                  <th>전화번호</th>
                  <td>{phoneShow}</td>
                  <th></th>
                  <td></td>
                  <th></th>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <p className="nl-lbl">결제 내역</p>

            <table className="nl-tbl-detail">
              <tbody>
                <tr>
                  <th>카드사</th>
                  <td>{payHisData?.issuer_nm}</td>
                  <th>카드번호</th>
                  <td>{payHisData?.card_no}</td>
                </tr>
              </tbody>
            </table>
            {/* table vertical */}
            <table className="nl-tbl-vertical">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>구분</th>
                  <th style={{ width: '155px' }}>결제 일자</th>
                  <th style={{ width: '125px' }}>결제 금액</th>
                  <th>승인번호</th>
                  <th>담당자</th>
                  <th style={{ width: '75px' }}>결제 상태</th>
                  <th style={{ width: 'auto' }}>비고</th>
                </tr>
              </thead>
              <tbody>
                {payNoTiData?.map((item: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td>
                        {/* {item?.stat_cd === 'TS06'
                          ? '취소'
                          : item?.stat_cd === 'TS03'
                          ? '결제'
                          : ''} */}
                        {item?.noti_type === '10'
                          ? '결제'
                          : item?.noti_type === '20'
                          ? '취소'
                          : ''}
                      </td>
                      <td>{item?.createdAt} </td>
                      <td>
                        {item?.noti_type === '10'
                          ? item?.amount
                          : item?.mgr_amt}
                      </td>
                      <td>{item?.cno}</td>
                      <td>
                        {item?.requestRefunds[0]?.whoRefund?.name}
                        {item?.requestRefunds[0]?.whoRefund?.accountId && '('}
                        {item?.requestRefunds[0]?.whoRefund?.accountId}
                        {item?.requestRefunds[0]?.whoRefund?.accountId && ')'}
                      </td>
                      <td>성공</td>
                      <td>
                        {item?.requestRefunds[0]?.div_code === 'BROKEN'
                          ? '충전기 고장'
                          : item?.requestRefunds[0]?.div_code === 'ETC'
                          ? '기타'
                          : ''}{' '}
                        {item?.requestRefunds[0]?.refund_reason
                          ? `: ${String(item.requestRefunds[0].refund_reason)}`
                          : ''}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <th colSpan={2}>총 결제 금액</th>
                  <td colSpan={4}>{calculatedAmount}</td>
                </tr>
              </tbody>
            </table>

            <p className="nl-lbl">환불 신청 내역</p>
            <table className="nl-tbl-detail">
              <tbody>
                <tr>
                  <th>환불 가능 금액</th>
                  <td>{calculatedAmount}</td>
                  <th>
                    환불 요청 금액 <span style={{ color: '#e92c2c' }}>*</span>
                  </th>
                  <td>
                    <StyledFormItem
                      name="refundAmount"
                      // label="price"
                      rules={[
                        {
                          required: true,
                          message: '환불금액을 입력하세요.',
                        },
                        // {
                        //   pattern: /^[1-9]+$/g,
                        //   message: '0보다 큰 숫자를 입력해야합니다.',
                        // },
                        {
                          pattern: /^[1-9]\d*(\.\d+)?$/,
                          message: '0보다 큰 숫자를 입력해야합니다.',
                        },
                      ]}
                      gridcol="100%"
                    >
                      <Input />
                    </StyledFormItem>
                  </td>
                </tr>
                <tr>
                  <th>사유</th>
                  <td colSpan={3}>
                    <StyledSelectInput>
                      <StyledFormItem
                        name="divCode"
                        rules={[
                          {
                            required: true,
                            message: '선택하세요을 입력하세요.',
                          },
                        ]}
                      >
                        <StyledSelect
                          placeholder="선택하세요"
                          value={queryState.divCode}
                          onChange={(value) => {
                            if (value === 'BROKEN') {
                              setDisabledInput(true);
                            } else {
                              setDisabledInput(false);
                            }
                            setQueryState({
                              ...queryState,
                              divCode: String(value),
                            });
                          }}
                          style={{ width: '120px' }}
                        >
                          {/* <Select.Option value="">선택해주세요</Select.Option> */}
                          <Select.Option value="BROKEN">
                            충전기 고장
                          </Select.Option>
                          <Select.Option value="ETC">기타</Select.Option>
                        </StyledSelect>
                      </StyledFormItem>

                      <StyledFormItem
                        name="refundReason"
                        rules={[
                          {
                            required: !disabledInput,
                            message: '환불 사유는 필수입력값입니다.',
                          },
                        ]}
                        gridcol="100%"
                        style={{ width: '100%' }}
                      >
                        <Input
                          disabled={disabledInput}
                          value={queryState?.refundReason}
                          onChange={(event) => {
                            setQueryState({
                              ...queryState,
                              refundReason: event.target.value,
                            });
                          }}
                        />
                      </StyledFormItem>
                    </StyledSelectInput>
                  </td>
                </tr>
              </tbody>
            </table>
          </CPHContainer>
        </StyledForm>
        <ModalFooter
          okText="선택"
          closeText="취소"
          close={handleCloseModal}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};
export default ConsultantOutStandingPaymentModel;
