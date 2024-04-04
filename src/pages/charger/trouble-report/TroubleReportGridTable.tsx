import { useState, useEffect, useRef } from 'react';
import { useGetListWt } from 'hooks/useGetListWt';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import {
  GridContainer,
  DefaultDiv,
  Spinner,
  AUIGridContainer,
  GridButton,
} from 'styles/style';
import { TableButton } from 'components/common/Button/TableButton';
import TroubleReportDetail from './Model/TroubleReportDetail';
import { type StateInterface, type ITroubleReport } from 'interfaces/ICommon';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import dayjs from 'dayjs';
import ExportGridDataView from 'utils/ExportGridDataView';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const TroubleReportGridTable = ({
  state,
  setState,
  loading,
  data,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
}: any) => {
  const TRGrid = useRef<AUIGrid>(null);
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [troubleReportId, setTroubleReportId] = useState<number | ''>('');
  const [isEditOpen, setIsEditOpen] = useState(false);

  // console.log(data);
  const columnLayout: IGrid.Column[] = [
    // {
    // //   dataField: 'id',
    // //   headerText: '번호',
    // //   width: '4%',
    // //   minWidth: 50,
    //   // labelFunction: function (
    //   //   _rowIndex,
    //   //   _columnIndex,
    //   //   value,
    //   //   _headerText,
    //   //   _item,
    //   //   _dataField,
    //   //   _cItem,
    //   // ) {
    //   //   return value - _rowIndex;
    //   // },
    // },
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex;
      },
    },
    {
      dataField: 'areaName',
      headerText: '부문',
      width: '5%',
      minWidth: 75,
    },
    {
      dataField: 'stat_type',
      headerText: '구분',
      width: '5%',
      minWidth: 75,
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        return item.areaName ||
          item.branchName ||
          item.chgs_station_id ||
          item.chgs_name ||
          item.chgs_address
          ? value
          : null;
      },
    },
    {
      dataField: 'branchName',
      headerText: '지사',
      width: '8%',
      minWidth: 100,
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   return value ? branchText(value) : '경기남부';
      // },
    },
    {
      dataField: 'status',
      headerText: '운영',
      width: '4%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        if (
          !(
            item.areaName ||
            item.branchName ||
            item.chgs_station_id ||
            item.chgs_name ||
            item.chgs_address
          )
        )
          return '';
        if (value === 'INACTIVE') {
          return '정지';
        }
        return '운영';
      },
    },
    // {
    //   dataField: 'chgs_station_id',
    //   headerText: '충전소 ID',
    //   width: '8%',
    //   minWidth: 100,
    // },
    {
      dataField: 'chgs_name',
      headerText: '충전소명',
      width: '8%',
      minWidth: 100,
    },
    {
      dataField: 'chgs_address',
      headerText: '주소',
      width: '10%',
      minWidth: 250,
    },
    {
      dataField: 'chg_charger_id',
      headerText: '충전기 ID',
      width: '7%',
      minWidth: 100,
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   return value ?? '1012-경기1';
      // },
    },
    {
      dataField: 'reportDate',
      headerText: '신고일자',
      width: '7%',
      minWidth: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = dayjs(value).format('YYYY-MM-DD');
        return formattedValue;
      },
    },
    {
      dataField: 'troubleTitle',
      headerText: '카테고리',
      width: '8%',
      minWidth: 150,
    },
    // {
    //   dataField: 'troubleDetail',
    //   headerText: '내용',
    //   width: '10%',
    //   minWidth: 150,
    // },
    {
      dataField: 'statusReport',
      headerText: '상태',
      width: '3%',
      minWidth: 50,
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case 'ACCEPTED':
            return '접수';
          case 'REPORTED':
            return '신고';
          case 'INPROGRESS':
            return '처리중';
          case 'COMPLETED':
            return '완료';
          default:
            return '';
        }
      },
    },
    // {
    //   dataField: 'chgs_operator_manager',
    //   headerText: '현장담당자',
    //   width: '5%',
    //   minWidth: 50,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     return value ?? '김철수';
    //   },
    // },
    {
      dataField: 'accountId',
      headerText: '유저 ID',
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   return value ?? 'userId';
      // },
    },
    {
      dataField: 'userName',
      headerText: '이름',
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   return value ?? '이철수';
      // },
    },
    {
      dataField: 'userPhone',
      headerText: '전화번호',
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   return value ?? '010-1234-5678';
      // },
    },

    // {
    //   dataField: 'failue',
    //   headerText: '고장여부',
    //   width: '3%',
    //   minWidth: 150,
    //   labelFunction(_rowIndex, _columnIndex, value) {
    //     switch (value) {
    //       case 'N':
    //         return '정상';
    //       case 'Y':
    //         return '고장';
    //       default:
    //         return '';
    //     }
    //   },
    // },
    // {
    //   dataField: 'modelName',
    //   headerText: '모댈명',
    // },
    // {
    //   dataField: 'maxKw',
    //   headerText: '속도',
    // },
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
    //       setTroubleReportId(event.item.id);
    //       setIsEditOpen(true);
    //     },
    //   },
    // },
  ];
  const gridProps: IGrid.Props = {
    height: '100%',
    width: '100%',
    fillColumnSizeMode: false,
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    selectionMode: 'multipleRows',
    showRowCheckColumn: true,
  };

  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = TRGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/trouble?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&status=${queryState.status}`;

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
    if (!loading && data !== null) {
      const grid = TRGrid.current as AUIGrid;
      //  grid.showAjaxLoader();
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setTroubleReportId(event.item.id);
          setIsEditOpen(true);
        },
      );
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            setCheckRowId((value: any) => [...value, event.item.id]);
          }
          if (!event.checked) {
            setCheckRowId((value: any) => {
              const newCheckRowId = value.filter(
                (item: any) => item !== event.item.id,
              );
              return newCheckRowId;
            });
          }
        },
      );
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          if (event.checked) {
            const dataItems = grid?.getGridData() as Array<{ id: number }>;
            setCheckRowId(dataItems.map((item) => item.id));
          } else {
            setCheckRowId([]);
          }
        },
      );
      // 그리드 수직스크롤 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.VScrollChange,
        (event: IGrid.VScrollChangeEvent) => {
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
      const data2 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // 그리드 데이터 세팅
      grid.setGridData(data2);
      // grid.removeAjaxLoader();
    }
  }, [loading, data]);

  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      troubleIds: checkRowId.map(String),
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/v1/trouble/delete-batch`,
          data: dataToSend,
        },
        setState,
        // (error) => {
        //   if (error) {
        //     alert(error);
        //   }
        // },
      );
      setCheckRowId([]);
    }
  }
  function handleDeleteRow() {
    if (checkRowId.length === 0) {
      alert('대상을 선택하세요.');
    } else {
      void onDeleteRow();
    }
  }
  return (
    <GridContainer height="calc(100vh - 15.7rem)">
      <GridButton
        label="고장 신고 관리 목록"
        myGrid={TRGrid}
        onDelete={handleDeleteRow}
      ></GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={TRGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <TroubleReportDetail
        state={state}
        setState={setState}
        setTroubleReportId={setTroubleReportId}
        troubleReportId={troubleReportId}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
      />
    </GridContainer>
  );
};
export default TroubleReportGridTable;
