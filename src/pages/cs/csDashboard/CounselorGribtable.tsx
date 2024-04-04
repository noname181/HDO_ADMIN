import { useEffect, useRef, useState } from 'react';
import type * as IGrid from 'aui-grid';
import { AUIGridContainer, Spinner } from 'styles/style';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import axios from 'axios';

interface AgentDataItem {
  agent_id: number;
  state: number;
  [key: string]: any; // 추가적인 필드를 위한 인덱스 시그니처
}

interface DataItem {
  extensionNumber: string;
  NAME: string;
  csState: string;
  BridgeCount: string;
  messageCount: number;
  refundCount: number;
  refundAmount: string;
  [key: string]: any; // 추가적인 필드를 위한 인덱스 시그니처
}

const CounselorGribtable = ({ loading, data }: any) => {
  const [agentData, setAgentData] = useState<AgentDataItem[]>([]);

  const agentKtAPI = async () => {
    // const url = `https://211.253.36.82:8100/api/v1/agents?tenants_id=1`;
    const url = `https://ktapi-evnu.oilbank.co.kr:8100/api/v1/agents?tenants_id=1`;
    try {
      const result = await axios.get<{ item: AgentDataItem[] }>(url);
      setAgentData(result.data.item);
    } catch (error: any) {
      console.error(error);
    }
  };

  const myGrid = useRef<AUIGrid>(null);
  // 그리드 칼럼 레이아웃 정의
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'agent_id',
      headerText: '내선번호',
    },
    {
      dataField: 'agentName',
      headerText: '상담사',
      labelFunction(
        rowIndex,
        columnIndex,
        value,
        headerText,
        item,
        dataField,
        cItem,
      ) {
        if (!value) {
          value = '로그 데이터 없음';
        }
        return value;
      },
    },
    {
      dataField: 'state',
      headerText: '상태',
      labelFunction(
        rowIndex,
        columnIndex,
        value,
        headerText,
        item,
        dataField,
        cItem,
      ) {
        switch (value) {
          case 1:
            return '대기';
          case 2:
            return '자리비움';
          case 3:
            return '상담';
          case 5:
            return '식사';
          case 6:
            return '교육';
          case 7:
            return '후처리';
          case 8:
            return '링울림';
          case 11:
            return '감청';
          case 13:
            return '회의';
          case 14:
            return '휴식';
          case 16:
            return '작업중';
          case 17:
            return '다른업무';
          case 18:
            return '로그온';
          case 0:
            return '로그아웃';
        }
        return value;
      },
    },
    {
      dataField: 'BridgeCount',
      headerText: '총 수신콜',
      labelFunction(
        rowIndex,
        columnIndex,
        value,
        headerText,
        item,
        dataField,
        cItem,
      ) {
        if (!value) {
          value = 0;
        }
        return value;
      },
    },
    {
      dataField: 'messageCount',
      headerText: '문자발송',
      labelFunction(
        rowIndex,
        columnIndex,
        value,
        headerText,
        item,
        dataField,
        cItem,
      ) {
        if (!value) {
          value = 0;
        }
        return value;
      },
    },
    {
      dataField: 'refundCount',
      headerText: '환불 건수',
      labelFunction(
        rowIndex,
        columnIndex,
        value,
        headerText,
        item,
        dataField,
        cItem,
      ) {
        if (!value) {
          value = 0;
        }
        return value;
      },
    },
    {
      dataField: 'refundAmount',
      headerText: '환불 금액',
      labelFunction(
        rowIndex,
        columnIndex,
        value,
        headerText,
        item,
        dataField,
        cItem,
      ) {
        if (!value) {
          value = '0 원';
        } else {
          value = value.toLocaleString().concat(' 원');
        }
        return value;
      },
    },
  ];
  // 그리드 속성 정의
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 150,
    fillColumnSizeMode: true,
    // autoGridHeight: true,
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    enableRestore: true,
    notBeginEventNewRowsOnPaste: false,
    uneditableNewRowsOnPaste: true,
    softRemoveRowMode: false,
    enableSorting: false,
  };

  useEffect(() => {
    // API 호출
    void agentKtAPI();

    if (data && agentData) {
      const grid = myGrid.current as AUIGrid;

      // 데이터를 합칩니다.
      const mergedData = agentData.map((dataItem: { agent_id: number }) => {
        // dataItem의 extensionNumber에 해당하는 agentData를 찾습니다.
        const agentItem = data.find(
          (agentItem: {
            extensionNumber: string;
            agent_id: { toString: () => any };
          }) =>
            agentItem.extensionNumber === dataItem.agent_id.toString() &&
            dataItem.agent_id,
        );
        // 찾은 agentItem이 있다면, dataItem과 합쳐서 새 객체를 반환합니다.
        return agentItem ? { ...dataItem, ...agentItem } : dataItem;
      });
      const filteredMergedData = mergedData.filter(
        (item) => item.agent_id !== 9000,
      );
      // 합쳐진 데이터를 그리드에 설정합니다.
      grid.setGridData(filteredMergedData);
    }
  }, [data]);
  // 그리드 이벤트 세팅

  return (
    <AUIGridContainer>
      {loading && <Spinner />}
      <AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
    </AUIGridContainer>
  );
};
export default CounselorGribtable;
