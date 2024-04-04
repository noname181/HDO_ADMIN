import { useEffect, useState } from 'react';
import { Form, Input } from 'antd';

// 스타일
import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import { StyledForm, StyledFormItem } from 'components/common/test/Styled.ant';

import { category } from 'utils/stationUtils';
import { CPHContainer } from '../../../../pages/cs/CSHome/Model/styled';
import { postApi } from 'apis/postApi';
import { useGetDataWtTrigger } from 'hooks/useGetDataWt';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export const OutstandingDetail = ({
  itemData,
  setItemData,
  state,
  setState,
}: any) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
  const [amountPayment, setAmountPayment] = useState<number>(0);
  const [queryState, setQueryState] = useState({
    costReason: '',
  });
  const { loading, error, data, getDetail } = useGetDataWtTrigger<any>();
  const [isShowEdit, setIsShowEdit] = useState<boolean>(false);
  const featDetail = () => {
    if (itemData?.cl_id && itemData?.cl_id !== '') {
      void getDetail({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/payment/outstanding/detail/${itemData?.cl_id}`,
      });
    }
  };
  const resetData = () => {
    setIsShowEdit(false);
    setItemData(null);
    setQueryState({
      costReason: '',
    });
    form.resetFields();
    setAmountPayment(0);
  };
  useEffect(() => {
    featDetail();
  }, [itemData]);

  useEffect(() => {
    if (state.isSuccess) {
      resetData();
      featDetail();
    }
  }, [state]);
  useEffect(() => {
    if (data?.result) {
      setIsModelOpen(true);
      let element = 0;
      if (data?.result?.afterActions?.length > 0) {
        for (
          let index = 0;
          index < data?.result?.afterActions?.length;
          index++
        ) {
          element += Number(data?.result?.afterActions[index]?.amount);
        }
        // console.log(element);
        setAmountPayment(element);
      }
    }
    if (data?.result?.afterActions.length === 0) {
      setIsShowEdit(true);
      // console.log(data?.result?.afterActions?.length);
    } else {
      setIsShowEdit(false);
    }
  }, [data]);
  function handleCloseModal() {
    setIsModelOpen(false);
    resetData();
  }
  async function onFinish(values: any) {
    const addData = {
      cl_id: itemData?.cl_id,
      costReason: queryState.costReason,
    };
    await postApi(
      {
        url: `v1/afterAction/cost`,
        data: addData,
      },
      setState,
    );
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'alert',
          title: '알림',
          content: '잡손실로 처리하시겠습니까? 다시 수정이 불가합니다.',
          onOk() {
            void onFinish(values);
            setAlertModal({ ...alertModal, open: false });
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Modal open={isModelOpen} title="미결제 내역" close={handleCloseModal}>
        <StyledForm
          form={form}
          name="ConsultantPayHistoryModel"
          colon={false}
          type="modal"
          gridcol="1fr"
        >
          <CPHContainer style={{ overflow: 'auto' }}>
            <p className="nl-lbl">기본 정보</p>
            <table className="nl-tbl-detail">
              <tbody>
                <tr>
                  <th>Cl-NO</th>
                  <td>{data?.result?.cl_id}</td>
                  <th>부문</th>
                  <td>
                    {
                      data?.result?.chargerUseLog?.chargingStation?.org
                        ?.areaName
                    }
                  </td>
                  <th>지사</th>
                  <td>
                    {
                      data?.result?.chargerUseLog?.chargingStation?.org
                        ?.branchName
                    }
                  </td>
                </tr>
                <tr>
                  <th>구분</th>
                  <td>
                    {category(
                      data?.result?.chargerUseLog?.chargingStation?.org
                        ?.category,
                    )}
                  </td>
                  <th>충전소명</th>
                  <td>
                    {data?.result?.chargerUseLog?.chargingStation?.chgs_name}
                  </td>
                  <th>충전소 ID</th>
                  <td>
                    {
                      data?.result?.chargerUseLog?.chargingStation
                        ?.chgs_station_id
                    }
                  </td>
                </tr>
                <tr>
                  <th>충전량</th>
                  <td>
                    {data?.result?.cl_kwh
                      ? new Intl.NumberFormat('en-US').format(
                          data?.result?.cl_kwh,
                        ) + 'kWh'
                      : ''}
                  </td>
                  <th>적용단가</th>
                  <td>
                    {data?.result?.appliedUnitPrice &&
                      new Intl.NumberFormat('en-US').format(
                        data?.result?.appliedUnitPrice,
                      ) + '원'}
                  </td>
                  <th>충전날짜</th>
                  <td>{data?.result?.createdAt}</td>
                </tr>
                <tr>
                  <th>인증방법</th>
                  <td>{data?.result?.useType}</td>
                  <th>회원구분</th>
                  <td>
                    {data?.result?.useType
                      ? data?.result?.useType === 'CREDIT'
                        ? '비회원'
                        : '회원'
                      : ''}
                  </td>
                  <th>사용자</th>
                  <td>
                    {data?.result?.userNew?.name}
                    {data?.result?.userNew?.accountId && ' ( '}
                    {data?.result?.userNew?.accountId}
                    {data?.result?.userNew?.accountId && ' )'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* <p className="nl-lbl">결제 내역</p> */}
            {/* <table className="nl-tbl-detail">
              <tbody>
                <tr>
                  <th>카드사</th>
                  <td></td>
                  <th>카드번호</th>
                  <td>{data?.result?.payMethodDetail}</td>
                </tr>
              </tbody>
            </table> */}
            {/* table vertical */}
            <table className="nl-tbl-vertical">
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>구분</th>
                  <th style={{ width: '160px' }}>결제 요청 일자</th>
                  <th style={{ width: '125px' }}>결제 금액</th>
                  <th style={{ width: '80px' }}>승인번호</th>
                  <th style={{ width: '195px' }}>담당자</th>
                  <th style={{ width: '80px' }}>결제 상태</th>
                  <th style={{ width: 'auto' }}>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>결제</td>
                  <td>
                    {data?.result?.payFail?.createdAt
                      ? data?.result?.payFail?.createdAt
                      : data?.result?.cl_datetime}
                  </td>
                  <td>
                    {data?.result?.expectedAmt
                      ? new Intl.NumberFormat('en-US').format(
                          data?.result?.expectedAmt,
                        ) + '원'
                      : 0}
                  </td>
                  <td></td>
                  <td>
                    {data?.result?.userNew?.name}{' '}
                    {data?.result?.userNew?.accountId
                      ? '( ' + String(data?.result?.userNew?.accountId) + ' )'
                      : ''}
                  </td>
                  <td>실패</td>
                  <td>{data?.result?.payFail?.resMsg}</td>
                </tr>
                {data?.result?.afterActions?.map((item: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td>
                        {item?.afterAction === 'COST' ? '잡손실' : '결제'}
                      </td>
                      <td>{item?.createdAt}</td>
                      <td>
                        {item?.amount
                          ? new Intl.NumberFormat('en-US').format(
                              item?.amount,
                            ) + '원'
                          : 0}
                      </td>
                      <td>
                        {item?.afterAction === 'PAID'
                          ? ''
                          : data?.result?.approval_number}
                      </td>
                      <td>
                        {item?.costUser?.name}{' '}
                        {item?.costUser?.accountId
                          ? '( ' + String(item?.costUser?.accountId) + ' )'
                          : ''}
                      </td>
                      <td>{item?.afterAction === 'PAID' ? '성공' : ''}</td>
                      <td>
                        {item?.costReason} {' | '}
                        {data?.result?.payMethodDetail}
                      </td>
                    </tr>
                  );
                })}

                {/* <tr>
                <td>결제</td>
                <td>2023.11.15 15:31:02</td>
                <td>54,300</td>
                <td></td>
                <td></td>
                <td>실패</td>
                <td>잔액부족</td>
              </tr>
              <tr>
                <td>잡손실처리</td>
                <td>2023.11.15 15:31:02</td>
                <td>54,300</td>
                <td></td>
                <td>홍길동(hong)</td>
                <td></td>
                <td>잡손실 처리사유 노출</td>
              </tr> */}
                <tr>
                  <th colSpan={2}>총 결제 금액</th>
                  <td colSpan={4}>
                    {amountPayment
                      ? new Intl.NumberFormat('en-US').format(amountPayment) +
                        '원'
                      : 0}
                  </td>
                </tr>
              </tbody>
            </table>
            {isShowEdit ? (
              <table className="nl-tbl-detail">
                <tbody>
                  <tr>
                    <th style={{ width: 205 }}>
                      잡손실 처리 사유{' '}
                      <span style={{ color: '#e92c2c' }}>*</span>
                    </th>
                    <td colSpan={3}>
                      <StyledFormItem
                        name="reason"
                        rules={[
                          {
                            required: true,
                            message: '잡손실 처리 사유을 입력해주세요.',
                          },
                        ]}
                        gridcol="100%"
                        style={{ width: '100%' }}
                      >
                        <Input
                          value={queryState?.costReason}
                          onChange={(event) => {
                            setQueryState({
                              ...queryState,
                              costReason: event.target.value,
                            });
                          }}
                        />
                      </StyledFormItem>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : null}
          </CPHContainer>
        </StyledForm>
        {isShowEdit && (
          <ModalFooter
            okText="잡손실 처리"
            closeText="취소"
            close={handleCloseModal}
            onOk={handleOk}
          />
        )}
      </Modal>
    </>
  );
};
