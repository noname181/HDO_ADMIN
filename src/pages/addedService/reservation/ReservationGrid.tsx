import { useEffect, useRef } from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';
import { Button } from 'components/common/Button/Button';
import { AUIGridContainer, GridButton, Spinner } from 'styles/style';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { category } from 'utils/stationUtils';
import { areaText, branchText } from 'utils/codelookup';

export const ReservationGrid = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  setQueryState,
  queryState,
}: any) => {
  const bookingGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      style: 'text-center',
      labelFunction: function (
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value - _rowIndex;
      },
    },
    {
      dataField: 'areaName',
      headerText: '부문',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return _item?.chargingStation?.org?.category === 'EV_DIV'
          ? 'EV사업부'
          : value;
      },
    },
    {
      dataField: 'branchName',
      headerText: '지사',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        return _item?.chargingStation?.org?.category === 'EV_DIV'
          ? 'EV사업부'
          : value;
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '구분',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return category(value?.org?.category) ?? '';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '운영',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.status === 'ACTIVE'
          ? '사용'
          : value?.status === 'INACTIVE'
          ? '미사용'
          : '';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '주소',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.org?.address ?? '-';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '충전소 ID',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_station_id ?? '-';
      },
    },
    {
      dataField: 'chargingStation',
      headerText: '충전소명',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chgs_name ?? '-';
      },
    },
    {
      dataField: 'chargers',
      headerText: '충전기 ID',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chg_charger_id ?? '-';
      },
    },
    {
      dataField: 'chargers',
      headerText: '속도',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargerModel?.maxKw
          ? String(value?.chargerModel?.maxKw) + 'kWh'
          : '-';
      },
    },
    {
      dataField: 'scanType',
      headerText: '인증방법',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 1:
            return 'QR';
          case 2:
            return 'NFC';
          default:
            return '';
        }
      },
    },
    {
      dataField: 'chg_id',
      headerText: '충전 ID',
      style: 'text-center',
    },
    {
      dataField: 'createdBy',
      headerText: '유저 ID',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.accountId ?? '-';
      },
    },
    {
      dataField: 'createdBy',
      headerText: '이름',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.name ?? '-';
      },
    },
    {
      dataField: 'createdBy',
      headerText: '전화번호',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.phoneNo ?? '-';
      },
    },
    {
      dataField: 'b_status',
      headerText: '예약상태',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'reserved':
            return '예약완료';
          case 'selected':
            return '충전준비';
          case 'charging':
            return '충전중';
          case 'completed':
            return '충전완료';
          case 'cancelled':
            return '충전취소';
          // case 'terminated':
          //   return '이 종료되었습니다';
          case 'active':
            return '충전대기';
          default:
            return '';
        }
      },
    },
    // {
    //   dataField: 'd16',
    //   headerText: '결제방법',
    //   style: 'text-center',
    // },
    {
      dataField: '',
      headerText: '예약시간',
      style: 'text-center',
      width: 300,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        const timeIn = String(_item?.b_time_in); // Ensure it's a string
        const timeOut = String(_item?.b_time_out); // Ensure it's a string
        return timeIn + ' - ' + timeOut;
      },
    },

    // {
    //   dataField: 'edit',
    //   headerText:
    //     '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width: 16px;height:auto;">',
    //   width: '4%',
    //   minWidth: 50,
    //   renderer: {
    //     type: IGrid.RendererKind.IconRenderer,
    //     iconWidth: 18,
    //     iconHeight: 18,
    //     iconTableRef: {
    //       default: './assets/img/icon/icon-edit.png',
    //     },
    //     onClick: function (event) {
    //       // alert(event.text);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true, // 정의한 칼럼 레이아웃을 가로 스크롤 없이 현재 그리드 영역에 꽉차도록 칼럼들을 비율로 계산하여 출력합니다.
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
  const requestAddData = async () => {
    const grid = bookingGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/booking?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        const data2 = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        // console.log(data);
        grid.appendData(data2);
      })
      .catch((error) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error.code,
          content: error.message,
        });
        console.log(error);
      });
  };
  useEffect(() => {
    // if (!loading && data !== null) {
    const grid = bookingGrid.current as AUIGrid;

    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });

    // 그리드 셀클릭 이벤트 바인딩
    // TODO 흠.. 헤더쪽 스타일은 cellClick 이후에 실행되어서 한박자 느리게 보임
    let previousColumnIndex: number | null = null;
    grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
      if (previousColumnIndex !== null) {
        grid.setColumnProp(previousColumnIndex, { headerStyle: '' });
      }
      grid.setColumnProp(event.columnIndex, {
        headerStyle: 'select-header',
      });
      previousColumnIndex = event.columnIndex;
    });

    // 그리드 셀더블클릭 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.CellDoubleClick,
      (event: IGrid.CellDoubleClickEvent) => {
        // console.log(event);
      },
    );

    // 그리드 수직스크롤 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.VScrollChange,
      (event: IGrid.VScrollChangeEvent) => {
        // console.log(event);
        const rowCount = grid.getRowCount();
        if (rowCount === totalCount) {
          grid.unbind(IGrid.EventKind.VScrollChange);
          return;
        }
        if (event.position === event.maxPosition) {
          void requestAddData();
        }
      },
    );
    // fake data
    // const data = [];
    // for (let i = 35; i > 0; i--) {
    //   data.push({
    //     isActive: false,
    //     d99: i,
    //     d1: '중부',
    //     d2: '경기남부',
    //     d3: '직영',
    //     d4: '운영',
    //     d5: '경기 화성시 삼천병마로 862',
    //     d6: '7979',
    //     d7: '봉담셀프',
    //     d8: '1011-경기-1',
    //     d9: '200kw',
    //     d10: 'PG인증',
    //     d11: 'AAA',
    //     d12: 'UserID',
    //     d13: '김철수',
    //     d14: '010-1234-1234',
    //     d15: '예약완료',
    //     d16: '카드',
    //     d17: '13:00',
    //     d18: '14:00',
    //     d19: '대기중',
    //     d20: '3,000원',
    //     d21: '2023-10-10',
    //   });
    // }

    // 그리드 데이터 세팅
    const data2 = data?.map((item: any) => ({
      ...item,
      totalCount,
    }));
    grid.setGridData(data2);
  }, [loading, data]);

  return (
    <>
      <GridButton label="예약 관리" myGrid={bookingGrid}>
        {/* <Button
          size="md"
          color="primary"
          icon="/assets/img/icon/icon-add-w.png"
          alt="등록"
        >
          등록
        </Button> */}
        {/* <AddData state={state} setState={setState} /> */}
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {/* {loading && <Spinner />} */}
        <AUIGrid
          ref={bookingGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </>
  );
};
