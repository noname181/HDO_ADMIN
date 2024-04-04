import { useEffect, useRef, useState } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import { DefaultDiv, Spinner } from 'styles/style';
import { type subGridInterface } from 'interfaces/IConsultant';
import BasicInformationPopUp from 'pages/cs/CSHome/Model/BasicInformationPopUp';
interface gridInterface {
  state: subGridInterface;
  setState: React.Dispatch<React.SetStateAction<subGridInterface>>;
  data: any;
  totalCount: number;
}

interface DataInput {
  totalCount: number | null;
  id: string;
  scriptName: string;
  scrptContent: string | null;
  scriptComment: string | null;
  scriptCategory: string | null;
}

const TableScript = ({ state, setState, data, totalCount }: gridInterface) => {
  const myGrid = useRef<AUIGrid>(null);
  const [isModalBasicInfoOpen, setIsModalBasicInfoOpen] = useState(false);
  const [content, setContent] = useState('');
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '5%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex ?? '-';
      },
    },
    {
      dataField: 'id',
      headerText: '아이디',
      width: 100,
      visible: false,
    },
    {
      dataField: 'scriptName',
      headerText: '제목',
      visible: false,
    },
    {
      dataField: 'scriptCategory',
      headerText: '카테고리',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'payment':
            return '결제';
          case 'info':
            return '안내';
          case 'announce':
            return '공지';
          default:
            return '';
        }
      },
    },
    {
      dataField: 'scrptContent',
      headerText: '내용',
    },
    {
      dataField: 'scriptComment',
      headerText: '설명',
      width: 300,
    },
  ];
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 400,
    fillColumnSizeMode: false, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
    enableColumnResize: false, // 칼럼 리사이징 가능 여부를 지정합니다.
    showSelectionBorder: false, // 셀 선택 시 선택된 셀에 테두리(border) 를 표시할지 여부를 나타냅니다.
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false, // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
    noDataMessage: '출력할 데이터가 없습니다.',
    // wordWrap: true, // 이 속성값이 true 인 경우 자동 word-wrap 이 발생하며 각 행의 높이가 설정한 텍스트에 맞게 가변적으로 렌더링됩니다.
    // showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };

  const transformData = (data: DataInput[]) => {
    return data.map((item) => {
      return {
        id: item.id,
        scriptName: item.scriptName,
        scriptCategory: item.scriptCategory,
        scrptContent: item.scrptContent,
        scriptComment: item.scriptComment,
        totalCount: totalCount,
      };
    });
  };

  useEffect(() => {
    const grid = myGrid.current as AUIGrid;
    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {});
    // 그리드 수직스크롤 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.CellDoubleClick,
      (event: IGrid.CellDoubleClickEvent) => {
        setContent(event.item.scrptContent);
        setIsModalBasicInfoOpen(true);
      },
    );
    grid.bind(
      IGrid.EventKind.RowCheckClick,
      (event: IGrid.VScrollChangeEvent) => {},
    );
    const data2 = transformData(data);
    grid.setGridData(data2);
  }, [data]);

  return (
    <DefaultDiv>
      <AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
      <BasicInformationPopUp
        isModalOpen={isModalBasicInfoOpen}
        setIsModalOpen={setIsModalBasicInfoOpen}
        content={content}
      ></BasicInformationPopUp>
    </DefaultDiv>
  );
};
export default TableScript;
