import React from 'react';
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

const ConsultantContentPopup2: React.FC<PopupProps> = ({
  closePopup,
  data,
}) => {
  return (
    <>
      <div
        style={{
          width: '100%',
          background: '#fff',
          display: 'grid',
          alignItems: 'center',
          gap: 20,
          gridTemplateColumns: '1fr',
          padding: 20,
          boxSizing: 'border-box',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        {/* popup body */}
        <div
          style={{
            boxSizing: 'border-box',
            maxHeight: 'calc(100vh - 137px)',
            overflowY: 'auto',
          }}
        >
          <p
            style={{
              color: '#484848',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              marginBottom: 0,
              marginTop: 0,
            }}
          >
            기본 정보
          </p>
          <table
            style={{
              borderCollapse: 'collapse',
              border: '1px solid rgb(205, 208, 211)',
              width: '100%',
              marginBottom: 20,
              tableLayout: 'fixed',
            }}
          >
            <tbody>
              <tr>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  번호
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  00000000
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  부문
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  중부
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  지사
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  서울
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  구분
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  직영점
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  충전소 명
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  강남셀프주유소
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  충전소 ID
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  123
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  충전량
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  12.00
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  적용 단가
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  345.6
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  예약 충전 여부
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  N
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  인증방법
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                  }}
                >
                  신용카드
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  회원구분
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                  }}
                >
                  비회원
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  사용자
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                  }}
                >
                  -
                </td>
              </tr>
            </tbody>
          </table>

          <p
            style={{
              color: '#484848',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              marginBottom: 0,
            }}
          >
            결제 내역
          </p>
          <table
            style={{
              borderCollapse: 'collapse',
              border: '1px solid rgb(205, 208, 211)',
              width: '100%',
              marginBottom: 20,
              tableLayout: 'fixed',
            }}
          >
            <tbody>
              <tr>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  카드사
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  현대카드
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  카드번호
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    width: 'calc(100% / 3 - 120px)',
                  }}
                >
                  ****-1234-****-123*
                </td>
              </tr>
            </tbody>
          </table>
          {/* table vertical */}
          <table
            style={{
              borderCollapse: 'collapse',
              border: '1px solid rgb(205, 208, 211)',
              width: '100%',
              marginBottom: 20,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  구분
                </th>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 160,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  결제 일자
                </th>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  결제 금액
                </th>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  승인번호
                </th>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 120,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  결제 상태
                </th>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 'auto',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  비고
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'left',
                  }}
                >
                  선 결제
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  2023.11.15 15:31:02
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  54,300
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  1234448
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  성공
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'left',
                  }}
                >
                  부분 취소
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  2023.11.15 15:31:02
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  - 14,300
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  1234448
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  성공
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'left',
                  }}
                >
                  환불 금액
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  2023.11.15 15:51:10
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  - 40,000
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  5454555
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  성공
                </td>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  사유 : 신규 이벤트{' '}
                </td>
              </tr>
              <tr>
                <th
                  colSpan={2}
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  총 결제 금액
                </th>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>

          <p
            style={{
              color: '#484848',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '40px',
              marginBottom: 0,
              marginTop: 0,
            }}
          >
            환불 신청 내역
          </p>
          <table
            style={{
              borderCollapse: 'collapse',
              border: '1px solid rgb(205, 208, 211)',
              width: '100%',
              marginBottom: 20,
              tableLayout: 'fixed',
            }}
          >
            <tbody>
              <tr>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                    width: 120,
                  }}
                >
                  환불 가능 금액
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  0
                </td>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                    width: 120,
                  }}
                >
                  환불 요청 금액 <span style={{ color: '#e92c2c' }}>*</span>
                </th>
                <td
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  <input
                    type="text"
                    style={{
                      height: 40,
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: '40px',
                      padding: '0px 10px',
                      borderRadius: 6,
                      backgroundColor: '#fff',
                      border: '1px solid #cdd0d3',
                      color: '#484848',
                      width: '100%',
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 'auto',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  구분
                </th>
                <td
                  colSpan={3}
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gap: 10,
                      gridTemplateColumns: '200px auto',
                    }}
                  >
                    <select
                      name=""
                      id=""
                      style={{
                        height: 40,
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: '40px',
                        padding: '0px 10px',
                        borderRadius: 6,
                        backgroundColor: '#fff',
                        border: '1px solid #cdd0d3',
                        color: '#484848',
                      }}
                    >
                      <option value="">기타</option>
                    </select>
                    <input
                      type="text"
                      style={{
                        height: 40,
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: '40px',
                        padding: '0px 10px',
                        borderRadius: 6,
                        backgroundColor: '#fff',
                        border: '1px solid #cdd0d3',
                        color: '#484848',
                      }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* popup footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            borderTop: '1px solid rgb(205, 208, 211)',
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
          <button
            style={{
              padding: '0px 10px',
              height: 40,
              fontWeight: 500,
              fontSize: 14,
              backgroundColor: '#002f87',
              color: '#fff',
              border: 0,
              borderRadius: 6,
              marginTop: 20,
              minWidth: 90,
              cursor: 'pointer',
            }}
            onClick={() => {}}
          >
            환불
          </button>
        </div>
      </div>
    </>
  );
};

export default ConsultantContentPopup2;
