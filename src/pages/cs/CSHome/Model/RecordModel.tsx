import { useEffect, useRef, useState } from 'react';
import { Modal } from 'components/common/Modal/Modal';
import { CPHContainer } from './styled';
import Tabs from 'components/common/Tab/Tabs';
import { Button } from 'components/common/Button/Button';
const RecordModel = ({
  data,
  isModalRecordOpen,
  setIsModalRecordOpen,
}: any) => {
  const handleCloseModal = () => {
    setIsModalRecordOpen(false);
  };
  const [csListData, setCsListData] = useState<any>([]);
  const [csCallListData, setCsCallListData] = useState<any>([]);

  useEffect(() => {
    if (data?.csData) {
      setCsListData(data?.csData);
    }
    if (data?.callLogData) {
      setCsCallListData(data?.callLogData);
    }
  }, [data]);

  function openDeposition(recordFile: string | null) {
    if (recordFile) {
      window.open(
        `https://ktapi-evnu.oilbank.co.kr:8100/api/v2/record-player/${recordFile}`,
      );
    }
  }

  return (
    <Modal open={isModalRecordOpen} title="기본 정보" close={handleCloseModal}>
      {/* popup body */}
      <CPHContainer style={{ overflow: 'auto', minHeight: 600 }}>
        {/* table horizontal */}
        <table className="nl-tbl-detail">
          <tbody>
            <tr>
              <th>접수번호</th>
              <td>{data?.regNo}</td>
              <th>접수날짜</th>
              <td>{data?.createdAt}</td>
              <th>완료날짜</th>
              <td>{data?.completedDate}</td>
            </tr>
          </tbody>
        </table>
        <Tabs defaultValue="1">
          <Tabs.List>
            <Tabs.Trigger value="1" text="상태 변경 로그" />
            <Tabs.Trigger value="2" text="통화 로그" />
          </Tabs.List>
          <Tabs.Content>
            <Tabs.Panel value="1">
              {/* table vertical */}
              <table className="nl-tbl-vertical">
                <thead>
                  <tr>
                    <th style={{ width: 160 }}>처리 일시</th>
                    <th style={{ width: 120 }}>담당업체</th>
                    <th style={{ width: 120 }}>담당자</th>
                    <th style={{ width: 'auto' }}>처리상태</th>
                    <th style={{ width: 'auto' }}>처리내용</th>
                    <th style={{ width: 140 }}>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {csListData?.map((item: any, index: any) => {
                    return (
                      <tr key={index}>
                        <td>{item.updatedAt}</td>
                        <td>{item.upOrgName}</td>
                        <td>{item.updateName}</td>
                        <td>{item.statusNm}</td>
                        <td>{item.prsContent}</td>
                        <td>{item.dept}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Tabs.Panel>
            <Tabs.Panel value="2">
              {/* table vertical */}
              <table className="nl-tbl-vertical">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>통화 시작 시간</th>
                    <th>통화 종료 시간</th>
                    <th>담당자</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {csCallListData?.map((item: any, index: any) => {
                    return (
                      <tr key={index}>
                        <td>{item.callType}</td>
                        <td>{item.start_time}</td>
                        <td>{item.end_time}</td>
                        <td>{item.agentName}</td>
                        <td>
                          <Button
                            onClick={() => {
                              openDeposition(item.recordFile);
                            }}
                          >
                            녹취파일 듣기
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Tabs.Panel>
          </Tabs.Content>
        </Tabs>
      </CPHContainer>
    </Modal>
  );
};

export default RecordModel;
