import { useEffect, useRef, useState } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import 'AUI/AUIGrid/style.css';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
import { closed, category } from 'utils/test/FilterSwitch';
import ContractorRegister from 'components/Affiliation/ContractorManage/Modal/ContractorRegister';
import ContractorEdit from './Modal/ContractorEdit';
import { deleteBatchApi } from 'apis/deleteBatchApi';
import { hdoInstance } from 'apis/hdoInstance';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

export const ContractorGridTable = ({
  loading,
  data,
  state,
  setState,
  totalCount,
  queryState,
  setQueryState,
  setCheckRowId,
  checkRowId,
  typeUser,
}: any) => {
  // AlertModal
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [contractorData, setContractorData] = useState('');
  const myGrid = useRef<AUIGrid>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'totalCount',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      labelFunction: function (
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return value ? value - _rowIndex : '';
      },
    },
    {
      dataField: 'closed',
      headerText: '상태',
      width: 80,
      labelFunction(_rowIndex, _columnIndex, value) {
        return closed(value);
      },
    },
    {
      dataField: 'category',
      headerText: '구분',
      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        return category(value);
      },
    },
    {
      dataField: 'name',
      headerText: '소속명',
      width: 150,
    },
    {
      dataField: 'contactName',
      headerText: '담당자명',
      width: 150,
    },
    {
      dataField: 'contactPhoneNo',
      headerText: '전화',
      width: 120,
      // labelFunction(_rowIndex, _columnIndex, value) {
      //   // 전화번호 마스킹 처리 로직
      //   const dash = value?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      //   return dash;
      // },
    },
    {
      dataField: 'contactEmail',
      headerText: '이메일',
    },
    {
      dataField: 'address',
      headerText: '주소',
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      width: 160,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
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
    //       setContractorData(event.item);
    //       setIsModalOpen(true);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    height: '100%',
    width: '100%',
    rowIdField: 'id', // rowIdField 지정
    rowIdTrustMode: true, // rowId 값 신뢰 여부
    fillColumnSizeMode: true,
    enableColumnResize: false,
    headerHeights: [40],
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    selectionMode: 'multipleRows',
    showRowCheckColumn: true,
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/orgs?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&cate=${queryState.cate}&closed=${queryState.closed}&name=${queryState.name}&contact=${queryState.contact}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        // console.log('result::', result);

        const data2 = result?.data?.result?.map((item: any) => ({
          ...item,
          totalCount: result?.data?.totalCount,
        }));
        // console.log(data);
        grid.appendData(data2);
      })
      .catch((error) => {
        console.log(error);
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error?.errorCode ?? 'api 호출 에러 : 콘솔창 확인',
          content: error?.message ?? 'api 호출 에러 : 콘솔창 확인',
        });
      });
  };
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      // grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      //   // console.log(event);
      // });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setContractorData(event.item);
          setIsModalOpen(true);
        },
      );
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            // console.log(event.item);
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
      const data2 = data?.map((item: any) => ({
        ...item,
        totalCount,
      }));
      // console.log(data2);
      // 그리드 데이터 세팅
      grid.setGridData(data2);
    }
  }, [loading, data]);

  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      orgIds: checkRowId,
    };
    const isConfirmed = window.confirm('정말로 삭제할까요?');
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/org/delete-batch`,
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
        label="협력사 목록"
        myGrid={myGrid}
        onDelete={typeUser !== 'AS' ? handleDeleteRow : undefined}
      >
        {typeUser !== 'AS' && (
          <ContractorRegister
            state={state}
            setState={setState}
            typeUser={typeUser}
          />
        )}
      </GridButton>
      <AUIGridContainer isTableButton={true}>
        {loading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
      <ContractorEdit
        state={state}
        setState={setState}
        contractorData={contractorData}
        setContractorData={setContractorData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </GridContainer>
  );
};

export default ContractorGridTable;
