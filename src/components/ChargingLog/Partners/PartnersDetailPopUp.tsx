import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Modal } from 'components/common/Modal/Modal';
// import { Form } from 'antd';
// import { putApi } from 'apis/putApi';
import { DefaultDiv } from 'styles/style';

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  data: any;
  refetch: any;
  rowNumber: any;
}
const PartnersDetailPopUp = ({
  isModalOpen,
  setIsModalOpen,
  data,
  refetch,
  rowNumber,
}: ModalProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  // const [form] = Form.useForm();
  const [statusShow, setstatusShow] = useState<any>([]);
  const [dataShow, setdataShow] = useState<any>([]);
  const [urlPage, setURLPage] = useState<any>([]);

  const [state, setState] = useState<any>({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  useEffect(() => {
    // const newData: string = 'hshhshs <br> hjasdhfjkasdh';
    // form.setFieldsValue({
    //   note: data?.note,
    // });
    setdataShow(data?.note.split(','));
    let statusShowData: any = '';
    if (data?.note) {
      const statusVal = data?.note.split(',');

      if (statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'GET') {
        statusShowData = '개인정보';
      } else if (statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'PUT') {
        statusShowData = '수정';
      } else if (
        statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'POST'
      ) {
        statusShowData = '등록';
      } else if (
        statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'PATCH'
      ) {
        statusShowData = '수정';
      } else if (
        statusVal[6]?.split(':')?.[1]?.replaceAll(' ', '') === 'DELETE'
      ) {
        statusShowData = '삭제';
      }
    }

    if (data?.urlPage === '/') {
      setURLPage('대시보드');
    } else if (data?.urlPage === '/codelookup') {
      setURLPage('공통코드 관리');
    } else if (data?.urlPage === '/parameter') {
      setURLPage('Parameter 관리');
    } else if (data?.urlPage === '/error-code') {
      setURLPage('Errorcode 조회');
    } else if (data?.urlPage === '/charger-model') {
      setURLPage('충전기 모델 관리');
    } else if (data?.urlPage === '/update-file') {
      setURLPage('충전기 전송파일 관리');
    } else if (data?.urlPage === '/permission-admin') {
      setURLPage('권한관리');
    } else if (data?.urlPage === '/station') {
      setURLPage('사업장 관리');
    } else if (data?.urlPage === '/contractor') {
      setURLPage('협력사 관리');
    } else if (data?.urlPage === '/client') {
      setURLPage('고객사 관리');
    } else if (data?.urlPage === '/mobile-user') {
      setURLPage('모바일 회원');
    } else if (data?.urlPage === '/admin') {
      setURLPage('HDO 관리자');
    } else if (data?.urlPage === '/external-admin') {
      setURLPage('외부 관리자');
    } else if (data?.urlPage === '/charging-station') {
      setURLPage('충전소');
    } else if (data?.urlPage === '/charger') {
      setURLPage('충전기 관리');
    } else if (data?.urlPage === '/charging-unit-price') {
      setURLPage('단가테이블');
    } else if (data?.urlPage === '/charger-update') {
      setURLPage('충전기 업데이트');
    } else if (data?.urlPage === '/trouble-report') {
      setURLPage('고장 신고 관리');
    } else if (data?.urlPage === '/charger-history') {
      setURLPage('충전내역');
    } else if (data?.urlPage === '/payment-history') {
      setURLPage('예약내역');
    } else if (data?.urlPage === '/payment-details') {
      setURLPage('결제내역');
    } else if (data?.urlPage === '/outstanding-payment') {
      setURLPage('미결제 내역');
    } else if (data?.urlPage === '/reservation') {
      setURLPage('충전 결제 내역');
    } else if (data?.urlPage === '/unexported-payment') {
      setURLPage('미출차 결제 내역');
    } else if (data?.urlPage === '/bonus-card') {
      setURLPage('멤버쉽');
    } else if (data?.urlPage === '/point') {
      setURLPage('포인트');
    } else if (data?.urlPage === '/car-wash') {
      setURLPage('세차권');
    } else if (data?.urlPage === '/coupon') {
      setURLPage('쿠폰');
    } else if (data?.urlPage === '/added-service-stats') {
      setURLPage('통계');
    } else if (data?.urlPage === '/settlement') {
      setURLPage('일매출관리');
    } else if (data?.urlPage === '/daily-payment') {
      setURLPage('일수금관리');
    } else if (data?.urlPage === '/monthly-settlement') {
      setURLPage('월정산관리');
    } else if (data?.urlPage === '/notice-popup') {
      setURLPage('공지 팝업');
    } else if (data?.urlPage === '/notice') {
      setURLPage('공지사항');
    } else if (data?.urlPage === '/faq') {
      setURLPage('FAQ');
    } else if (data?.urlPage === '/banner-event') {
      setURLPage('배너/이벤트');
    } else if (data?.urlPage === '/terms-policy') {
      setURLPage('정책 및 약관');
    } else if (data?.urlPage === '/inquiry') {
      setURLPage('1:1문의');
    } else if (data?.urlPage === '/review') {
      setURLPage('리뷰');
    } else if (data?.urlPage === '/cs-main') {
      setURLPage('CS');
    } else if (data?.urlPage === '/cs-home') {
      setURLPage('CS');
    } else if (data?.urlPage === '/consultation') {
      setURLPage('상담 내역');
    } else if (data?.urlPage === '/as-consultation') {
      setURLPage('CS');
    } else if (data?.urlPage === '/template') {
      setURLPage('템플릿 관리');
    } else if (data?.urlPage === '/cs-dashboard') {
      setURLPage('CS 대시보드');
    } else if (data?.urlPage === '/statistics') {
      setURLPage('통계');
    } else if (data?.urlPage === '/charger-status-history') {
      setURLPage('충전기 상태 내역');
    } else if (data?.urlPage === '/charger-error-history') {
      setURLPage('충전기 오류 로그');
    } else if (data?.urlPage === '/message-log') {
      setURLPage('알림톡 내역관리');
    } else if (data?.urlPage === '/log') {
      setURLPage('유저 데이터 로그');
    } else if (data?.urlPage === '/batch-log') {
      setURLPage('배치 로그');
    } else if (data?.urlPage === '/charger-diagnostic') {
      setURLPage('충전기 진단정보');
    } else if (data?.urlPage === '/config-log') {
      setURLPage('콘솔로그');
    } else if (data?.urlPage === '/charging-log') {
      setURLPage('충전로그');
    } else if (data?.urlPage === '/payment-log') {
      setURLPage('결제로그');
    } else {
      setURLPage('');
    }

    if (data?.status === 'SUCCESS') {
      setstatusShow('로그인');
      setURLPage('로그인');
    } else if (data?.status === 'INFO') {
      setstatusShow('조회');
    } else if (data?.status === 'PRIVATE') {
      setstatusShow('개인정보');
    } else if (data?.status === 'EXCEL_DOWNLOAD') {
      setstatusShow('엑셀 다운로드');
    } else if (data?.status === 'WRITE') {
      setstatusShow('등록');
    } else if (data?.status === 'CREATE') {
      setstatusShow('등록');
    } else if (data?.status === 'EDIT') {
      setstatusShow('수정');
    } else if (data?.status === 'UPDATE') {
      setstatusShow('수정');
    } else if (data?.status === 'DELETE') {
      setstatusShow('삭제');
    } else if (data?.status === 'LOGOUT') {
      setstatusShow('로그아웃');
      setURLPage('로그아웃');
    } else {
      setstatusShow(statusShowData);
    }
  }, [data]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // form.resetFields();
  };
  // async function onFinish(values: any) {
  //   const addData = {
  //     note: values?.note,
  //   };
  //   await putApi(
  //     {
  //       url: `/userslog-list/${data?.id as string}`,
  //       data: addData,
  //     },
  //     setState,
  //   );
  // }
  // function handleOk() {
  //   form
  //     .validateFields()
  //     .then((values: any) => {
  //       void onFinish(values);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
  useEffect(() => {
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
    <Modal open={isModalOpen} title="상세 내용" close={handleCloseModal}>
      <DefaultDiv style={{ paddingBottom: 20 }}>
        <table className="nl-table-detail">
          <tbody>
            <tr>
              <th>번호</th>
              <td>{rowNumber}</td>
            </tr>
            <tr>
              <th>구분</th>
              <td>{data?.Org?.details}</td>
            </tr>
            <tr>
              <th>부서</th>
              <td>{data?.Org?.name}</td>
            </tr>
            <tr>
              <th>아이디</th>
              <td>{data?.UsersNew?.email}</td>
            </tr>
            <tr>
              <th>이름</th>
              <td>{data?.UsersNew?.name}</td>
            </tr>
            <tr>
              <th>액션</th>
              <td>{statusShow}</td>
            </tr>
            <tr>
              <th>프로그램명</th>
              <td>{urlPage}</td>
            </tr>
            <tr>
              <th>URL</th>
              <td>{data?.urlPage}</td>
            </tr>
            <tr>
              <th>기타</th>
              <td>
                <div
                  style={{
                    width: '100% - 80px',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                  }}
                >
                  {dataShow?.[5]?.split(':')?.[1]?.replaceAll(' ', '')}
                </div>
              </td>
            </tr>
            <tr>
              <th>ip</th>
              <td>{data?.ipAddress}</td>
            </tr>
            <tr>
              <th>생성일</th>
              <td>{data?.createdAt}</td>
            </tr>
            {/*   <tr>
              <th>회원</th>
              <td>
                {data?.UsersNew?.dataValues?.name} ({' '}
                {data?.UsersNew?.dataValues?.accountId} ){' '}
              </td>
            </tr>

            <tr>
              <th>비고</th>
              <td>{dataShow?.[5]?.split(':')?.[1]?.replaceAll(' ', '')}</td>
            </tr> */}

            {/* <tr>
              <th>URL</th>
              <td>{dataShow?.[0]}</td>
            </tr>
            <tr>
              <th>아이디</th>
              <td>{data?.UsersNew?.dataValues?.accountId}</td>
            </tr>
            <tr>
              <th>이름</th>
              <td>{data?.UsersNew?.dataValues?.name}</td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>{data?.UsersNew?.dataValues?.email}</td>
            </tr>
            <tr>
              <th>IP</th>
              <td>{data?.ipAddress}</td>
            </tr>
            <tr>
              <th>파라미터</th>
              <td>
                <div
                  style={{
                    width: '100% - 80px',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                  }}
                >
                  {dataShow?.[5]?.split(':')?.[1]?.replaceAll(' ', '')}
                </div>
              </td>
            </tr> */}
            {/* <tr>
              <th>브라우저</th>
              <td></td>
            </tr>
            <tr>
              <th>운영체제</th>
              <td></td>
            </tr> */}
          </tbody>
        </table>
      </DefaultDiv>
      {/* <StyledForm form={form} gridcol="1fr">
        <StyledFormItem
          name="note"
          label="내용"
          type="column"
          gridcol="100%"
          style={{ marginBottom: '30px' }}
        >
          <StyledTextArea
            style={{
              height: 400,
              width: '100%',
            }}
          ></StyledTextArea>
        </StyledFormItem>
      </StyledForm> */}
      {/* <ModalFooter
        okText="저장"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      /> */}
    </Modal>
  );
};

export default PartnersDetailPopUp;
