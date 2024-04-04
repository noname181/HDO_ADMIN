import { useState, useEffect } from 'react';
interface PopupProps {
  closePopup: () => void;
  data: {
    regNo: string | null;
    createdAt: string | null;
    completedDate: string | null;
    csData: [];
  };
}
/* eslint-disable react/prop-types */
export const Record: React.FC<PopupProps> = ({ closePopup, data }) => {
  const [csListData, setCsListData] = useState<any>();

  useEffect(() => {
    setCsListData(data.csData);
  }, [data]);

  return (
    <>
      <div
        style={{
          width: '100%',
          background: '#fff',
          display: 'grid',
          gap: 20,
          gridTemplateColumns: '1fr',
          padding: 20,
          boxSizing: 'border-box',
          fontFamily: 'Pretendard, sans-serif',
          height: '100%',
        }}
      >
        {/* popup body */}
        <div
          style={{
            boxSizing: 'border-box',
            height: 'calc(100vh - 137px)',
            overflowY: 'auto',
          }}
        >
          {/* table horizontal */}
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
                  접수번호
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
                  {data.regNo}
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
                  접수날짜
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
                  {data.createdAt}
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
                  완료날짜
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
                  {data.completedDate}
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
                    width: 140,
                    padding: 10,
                    height: 40,
                    fontSize: 14,
                    backgroundColor: '#f1f3f5',
                  }}
                >
                  처리 일시
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
                  담당업체
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
                  담당자
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
                  처리상태
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
                  처리내용
                </th>
                <th
                  style={{
                    border: '1px solid rgb(205, 208, 211)',
                    width: 140,
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
              {csListData?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td
                      style={{
                        border: '1px solid rgb(205, 208, 211)',
                        padding: 10,
                        height: 40,
                        fontSize: 14,
                        textAlign: 'center',
                      }}
                    >
                      {item.updatedAt}
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
                      {item.upOrgName}
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
                      {item.updateName}
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
                      {item.statusNm}
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
                      {item.prsContent}
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
                      {item.dept}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* popup footer */}
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
      </div>
    </>
  );
};

export type RecordType = React.ComponentType<PopupProps>;
