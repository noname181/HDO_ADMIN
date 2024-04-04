import { useEffect, useRef, useContext, useState } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import { type StateProps, type UpdateStateInterface } from 'interfaces/ICommon';
import dayjs from 'dayjs';
import { TabsContext } from 'components/common/Tab/Tabs';
import { DefaultDiv, GridHeader } from 'styles/style';
import { Label, LabelWrap } from 'components/common/Form/Form';
import { StyledInput } from 'components/common/test/Styled.ant';
import { useGetListWtTrigger } from 'hooks/useGetListWt';
import { Button } from 'components/common/Button/Button';
import StationAdminRegister from './StationAdminRegister';
import StationAdminEdit from './StationAdminEdit';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const StationAdminGrid = ({ stationData, state, setState }: any) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const context = useContext(TabsContext);
  const [stationAdminData, setStationAdminData] = useState('');

  // 그리드 객체
  const stationAdminGrid = useRef<AUIGrid>(null);

  const { loading, error, data, getData } = useGetListWtTrigger();

  useEffect(() => {
    if (stationData !== '') {
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/web/orgs/${stationData.id}/users`,
      });
    }
  }, [stationData]);

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      void getData({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/v1/web/orgs/${stationData.id}/users`,
      });
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);

  const gridProps: IGrid.Props = {
    width: '100%',
    headerHeights: [40], // 헤더의 높이를 지정합니다.
    rowHeight: 40, // 행의 높이를 지정합니다. 행의 높이는 20보다 작아질 수 없습니다. (즉, 행 높이 최소값은 20)
    height: 200, // 기본 지정 높이
    enableSorting: false,
    // autoGridHeight: true, // 삽입한 모든 데이터를 세로 스크롤 없이 출력하고 데이터에 맞게 그리드의 높이를 자동 결정할지를 지정합니다.
    rowIdField: 'id', // rowIdField 지정
    rowIdTrustMode: true, // rowId 값 신뢰 여부
    fillColumnSizeMode: true, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
    showRowNumColumn: false, // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
    showRowCheckColumn: true, // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    // showAutoNoDataMessage: false, // 그리드가 표현할 데이터가 존재 하지 않을 때 자동으로 메세지를 출력할지 여부를 지정합니다.
    noDataMessage: '데이터가 없습니다.', // showAutoNoDataMessage 가 true 인 경우 출력시킬 메세지를 지정합니다.
    selectionMode: 'singleRow', // 셀 선택모드를 지정합니다. 유효 속성값은 다음과 같습니다. singleCell, singleRow, multipleCells, multipleRows, none
  };

  // 드랍다운리스트의 리스트들
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'retired',
      headerText: '재직',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (!value) {
          return '재직';
        }
        return '퇴사';
      },
    },
    {
      dataField: 'name',
      headerText: '이름',
      style: 'text-center',
    },
    {
      dataField: 'role',
      headerText: '권한',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'ADMIN':
            return '관리';
          case 'VIEWER':
            return '조회';
          default:
            return '에러';
        }
      },
    },
    {
      dataField: 'phoneNo',
      headerText: '전화',
      style: 'text-center',

      // labelFunction(_rowIndex, _columnIndex, value) {
      //   // 전화번호 마스킹 처리 로직
      //   const dash = value?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      //   return dash;
      // },
      width: '10%',
      minWidth: 50,
    },
    {
      dataField: 'accountId',
      headerText: '이메일',
      style: 'text-center',
    },
    {
      dataField: 'currentAccessDateTime',
      headerText: '최근접속일',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (value !== null) {
          return dayjs(value).format('YYYY-MM-DD');
        }
        return '접속기록 없음';
      },
    },
  ];

  useEffect(() => {
    if (context.selectedIndex === '2') {
      const grid = stationAdminGrid.current as AUIGrid;
      grid.resize();
    }
  }, [context.selectedIndex]);

  useEffect(() => {
    if (!loading && data !== null) {
      const grid = stationAdminGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setStationAdminData(event.item);
        },
      );

      // 그리드 데이터 세팅
      grid.setGridData(data);
    }
  }, [loading, data]);

  return (
    <DefaultDiv>
      <GridHeader between>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Label>관리자 목록</Label>
          <LabelWrap label="소속명">
            <StyledInput
              readOnly
              value={stationData !== '' ? stationData.name : '에러'}
            />
          </LabelWrap>
        </div>
        <StationAdminRegister
          stationData={stationData}
          state={state}
          setState={setState}
        />
      </GridHeader>
      <AUIGrid
        ref={stationAdminGrid}
        columnLayout={columnLayout}
        gridProps={gridProps}
      />
      <StationAdminEdit
        state={state}
        setState={setState}
        stationAdminData={stationAdminData}
        setStationAdminData={setStationAdminData}
      />
    </DefaultDiv>
  );
};

export default StationAdminGrid;
