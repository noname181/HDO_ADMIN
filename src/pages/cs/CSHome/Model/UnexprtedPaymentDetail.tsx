import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Modal } from 'components/common/Modal/Modal';
import {
  StyledForm,
  StyledFormItem,
  StyledTextArea,
} from 'components/common/test/Styled.ant';
import { Form } from 'antd';
import { CPHContainer } from './styled';
const UnexprtedPaymentDetail = ({
  isConsultantPayHistory,
  setIsConsultantPayHistory,
  payHisData,
  setPayHisData,
}: any) => {
  const [form] = Form.useForm();
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const handleCloseModal = () => {
    setIsConsultantPayHistory(false);
  };

  return (
    <Modal
      open={isConsultantPayHistory}
      title="기본 정보"
      close={handleCloseModal}
    >
      <StyledForm
        form={form}
        name="UnexportedPaymentDetail"
        colon={false}
        type="modal"
        gridcol="1fr"
      >
        {/* popup body */}
        <CPHContainer style={{ overflow: 'auto' }}>
          <p className="nl-lbl">기본 정보</p>
          <table className="nl-tbl-detail">
            <tbody>
              <tr>
                <th>번호</th>
                <td>00000000</td>
                <th>부문</th>
                <td>중부</td>
                <th>지사</th>
                <td>서울</td>
              </tr>
              <tr>
                <th>구분</th>
                <td>직영점</td>
                <th>충전소 명</th>
                <td>강남셀프주유소</td>
                <th>충전소 ID</th>
                <td>123</td>
              </tr>
              <tr>
                <th>충전량</th>
                <td>12.00</td>
                <th>적용 단가</th>
                <td>345.6</td>
                <th>예약 충전 여부</th>
                <td>N</td>
              </tr>
              <tr>
                <th>인증방법</th>
                <td>신용카드</td>
                <th>회원구분</th>
                <td>비회원</td>
                <th>사용자</th>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          <p className="nl-lbl">결제 내역</p>
          <table className="nl-tbl-detail">
            <tbody>
              <tr>
                <th>카드사</th>
                <td>현대카드</td>
                <th>카드번호</th>
                <td>****-1234-****-123*</td>
              </tr>
            </tbody>
          </table>
          {/* table vertical */}
          <table className="nl-tbl-vertical">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>구분</th>
                <th style={{ width: '155px' }}>결제 일자</th>
                <th style={{ width: '125px' }}>결제 금액</th>
                <th>승인번호</th>
                <th style={{ width: '75px' }}>결제 상태</th>
                <th style={{ width: 'auto' }}>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>선 결제</td>
                <td>2023.11.15 15:31:02</td>
                <td>54,300</td>
                <td>1234448</td>
                <td>성공</td>
                <td></td>
              </tr>
              <tr>
                <td>부분 취소</td>
                <td>2023.11.15 15:31:02</td>
                <td>- 14,300</td>
                <td>1234448</td>
                <td>성공</td>
                <td></td>
              </tr>
              <tr>
                <td>환불 금액</td>
                <td>2023.11.15 15:51:10</td>
                <td>- 40,000</td>
                <td>5454555</td>
                <td>성공</td>
                <td>사유 : 신규 이벤트 </td>
              </tr>
              <tr>
                <th colSpan={2}>총 결제 금액</th>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </CPHContainer>
      </StyledForm>
    </Modal>
  );
};

export default UnexprtedPaymentDetail;
