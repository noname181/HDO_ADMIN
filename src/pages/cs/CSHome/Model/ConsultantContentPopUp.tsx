import React from 'react';
import styled from 'styled-components';
// import {
//   StyledForm,
//   StyledFormItem,
//   StyledInput,
//   StyledTextArea,
// } from 'components/common/test/Styled.ant';
import { Form } from 'antd';
import dayjs from 'dayjs';
interface PopupProps {
  closePopup: () => void;
  data: any;
}

const ConsultantContentPopup: React.FC<PopupProps> = ({ closePopup, data }) => {
  const csCls1Data = (data: any) => {
    switch (data) {
      case 'CHG':
        return '이용방법';
      case 'BRK':
        return '결제문의';
      case 'PAY':
        return '장애문의';
      case 'REG':
        return '환불';
      case 'CAR':
        return '단순 문의';
      default:
        return '기타';
    }
  };
  const orgNameData = (data: any) => {
    switch (data) {
      case 'DEF':
        return '일반회원';
      case 'BIZ':
        return '법인회원';
      case 'ETC':
        return '비회원';
      case 'STT':
        return '제휴회원';
      default:
        return '비회원';
    }
  };
  const incomingCdData = (data: any) => {
    switch (data) {
      case 'CTP':
        return '상담센터';
      case 'APP':
        return 'APP신고';
      case 'MAN':
        return '수동등록';
      default:
        return '';
    }
  };
  const statusCdData = (data: any) => {
    switch (data) {
      case 'HOL':
        return '보류';
      case 'ALL':
        return '전체';
      case 'COM':
        return '완료';
      case 'APR':
        return '승인';
      case 'REF':
        return '환불';
      case 'ARR':
        return '승인요청';
      case 'RER':
        return '환불요청';
      case 'TRA':
        return '이관';
      default:
        return '';
    }
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          background: '#fff',
          display: 'grid',
          alignItems: 'center',
          gap: 20,
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: 20,
          borderBottom: '1px solid rgb(205, 208, 211)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '120px auto',
          }}
        >
          <div style={{ fontSize: 14 }}>접수번호</div>
          <div
            style={{
              height: 40,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              padding: '0px 10px',
              borderRadius: 6,
              backgroundColor: 'rgb(241, 247, 253)',
              color: '#8f9295',
            }}
          >
            {data?.regNo}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '120px auto',
          }}
        >
          <div style={{ fontSize: 14 }}>처리결과</div>
          <div
            style={{
              height: 40,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              padding: '0px 10px',
              borderRadius: 6,
              backgroundColor: 'rgb(241, 247, 253)',
              color: '#8f9295',
            }}
          >
            {statusCdData(data?.statusCd)}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '120px auto',
          }}
        >
          <div style={{ fontSize: 14 }}>회원 분류</div>
          <div
            style={{
              height: 40,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              padding: '0px 10px',
              borderRadius: 6,
              backgroundColor: 'rgb(241, 247, 253)',
              color: '#8f9295',
            }}
          >
            {orgNameData(data?.orgName)}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '120px auto',
          }}
        >
          <div style={{ fontSize: 14 }}>상담분류</div>
          <div
            style={{
              height: 40,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              padding: '0px 10px',
              borderRadius: 6,
              backgroundColor: 'rgb(241, 247, 253)',
              color: '#8f9295',
            }}
          >
            {csCls1Data(data?.csCls1)}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '120px auto',
            gridColumn: '1 / span 3',
          }}
        >
          <div style={{ fontSize: 14 }}>상담내용</div>
          <div
            style={{
              height: 240,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              padding: '0px 10px',
              borderRadius: 6,
              backgroundColor: 'rgb(241, 247, 253)',
              color: '#8f9295',
            }}
          >
            {data?.csContent}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '120px auto',
            gridColumn: '1 / span 3',
          }}
        >
          <div style={{ fontSize: 14 }}>처리내용</div>
          <div
            style={{
              height: 240,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              padding: '0px 10px',
              borderRadius: 6,
              backgroundColor: 'rgb(241, 247, 253)',
              color: '#8f9295',
            }}
          >
            {data?.prsContent}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '120px auto',
          }}
        >
          <div style={{ fontSize: 14 }}>접수날짜</div>
          <div
            style={{
              height: 40,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              padding: '0px 10px',
              borderRadius: 6,
              backgroundColor: 'rgb(241, 247, 253)',
              color: '#8f9295',
            }}
          >
            {data?.createdAt}
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '120px auto',
          }}
        >
          <div style={{ fontSize: 14 }}>완료날짜</div>
          <div
            style={{
              height: 40,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              padding: '0px 10px',
              borderRadius: 6,
              backgroundColor: 'rgb(241, 247, 253)',
              color: '#8f9295',
            }}
          >
            {data?.completeDate}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          style={{
            padding: '0px 10px',
            height: 40,
            fontWeight: 500,
            fontSize: 14,
            backgroundColor: '#fff',
            color: 'rgb(72, 72, 72)',
            border: '1px solid rgb(205, 208, 211)',
            borderRadius: 6,
            marginTop: 20,
            minWidth: 90,
            cursor: 'pointer',
          }}
          onClick={closePopup}
        >
          닫기
        </button>
      </div>
    </>
  );
};

export default ConsultantContentPopup;
export type ConsultantContentPopupType = React.ComponentType<PopupProps>;
