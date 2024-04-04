import { useEffect, useRef, useState } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import { useGetListWt } from 'hooks/useGetListWt';
import { alertModalState } from 'recoil/modalState';
import { useRecoilState } from 'recoil';
import { type CLUInterface } from 'interfaces/Test/ICodelookup';
import { DRow, DColumn, TableButtonContainer } from './styled';

import {
  DefaultDiv,
  GridContainer,
  Spinner,
  AUIGridContainer,
  GridButton,
} from 'styles/style';
import { hdoInstance } from 'apis/hdoInstance';
import CodeLookupEdit from './Model/CodeLookUpEdit';
import CodeLookUpRegister from './Model/CodeLookUpRegister';
import CodeLookUpDetailEdit from './Model/CodeLookUpDetailEdit';
import CodeLookUpDetailRegister from './Model/CodeLookUpDetailRegister';
import { TableButton } from 'components/common/Button/TableButton';
import { deleteBatchApi } from 'apis/deleteBatchApi';

const CodeLookUpGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [codeLookUpID, setCodeLookUpID] = useState<number | ''>('');
  const [codeLookUpID2, setCodeLookUpID2] = useState<number | ''>('');
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  // const [isBranch, setIsBranch] = useState(false);

  const [checkRowId, setCheckRowId] = useState<string[]>([]);
  const [checkRowId2, setCheckRowId2] = useState<number[]>([]);
  const [divCode, setDivCode] = useState<string>('');
  const [dataSubCode, setDataSubCode] = useState<any[]>([]);
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const [state2, setState2] = useState<{
    isLoading2: boolean;
    error2: any;
    isSuccess2: boolean;
  }>({
    isLoading2: false,
    error2: null,
    isSuccess2: false,
  });
  const { loading, error, data, refetch } = useGetListWt<CLUInterface>({
    url: `/codelookup/listDivcode`,
  });

  const codelookupGrid = useRef<AUIGrid>(null);
  const codelookupGrid2 = useRef<AUIGrid>(null);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'id',
      headerText: 'id',
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'divCode',
      headerText: '구분코드',
      cellMerge: true,
      style: 'text-center',
    },
    {
      dataField: 'divComment',
      headerText: '구분설명',
      cellMerge: true,
      style: 'text-center',
    },
    // {
    //   dataField: 'sequence',
    //   headerText: 'sequence',
    //   visible: false,
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
    //       handleOpenModal3();
    //       setDivCode(event.item.divCode);
    //       setCodeLookUpID(event.item.id);
    //     },
    //   },
    // },
  ];
  const columnLayout2: IGrid.Column[] = [
    {
      dataField: 'id',
      headerText: 'id',
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'descVal',
      headerText: '코드값',
      width: '7%',
      style: 'text-center',
    },
    {
      dataField: 'upperDivCode',
      headerText: '상위코드',
      visible: true,
    },
    {
      dataField: 'descInfo',
      headerText: '코드 값 설명',
      style: 'text-center',
      width: 'auto',
    },
    // {
    //   dataField: 'use',
    //   headerText: '사용여부',
    //   width: '7%',
    //   style: 'text-center',

    //   labelFunction(
    //     _rowIndex,
    //     _columnIndex,
    //     value,
    //     _headerText,
    //     _item,
    //     _dataField,
    //     _cItem,
    //   ) {
    //     if (value === false) {
    //       return '미사용';
    //     }
    //     if (value === true) {
    //       return '사용';
    //     }
    //     return value;
    //   },
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
    //       handleOpenModal4();
    //       setCodeLookUpID2(event.item.id);
    //     },
    //   },
    // },
  ];
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    // autoGridHeight: true,
    headerHeights: [40],
    // editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    // groupingMessage: '여기에 칼럼을 드래그하면 그룹핑이 됩니다.',
    rowHeight: 40,
    simplifySelectionEvent: true,
    showRowCheckColumn: true,
    selectionMode: 'multipleRows', // singleCell or multipleRows
    rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
      // if (item?.subCodeCount > 1 || item?.use) {
      // Disabled check box if subCode table have data
      if (item?.subCodeCount > 1 || item?.use) {
        return false;
      } else {
        return true;
      }
    },
    // enableCellMerge: true,
    // cellMergeRowSpan: true,
  };
  // 데이터 요청 function
  const requestAddData = async () => {
    // console.log('requestAddData');
    setState2({
      ...state2,
      isSuccess2: false,
      isLoading2: true,
    });
    // const grid2 = codelookupGrid2.current as AUIGrid;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/codelookup/${divCode}?isAll=true`;

    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((result) => {
        // console.log(result.data.result);
        // grid2.setGridData(result.data.result);
        setDataSubCode(result?.data?.result);
        setState2({
          ...state2,
          isSuccess2: false,
          isLoading2: false,
        });
      })
      .catch((error) => {
        setState2({
          ...state2,
          isSuccess2: false,
          isLoading2: false,
        });
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
      const grid = codelookupGrid.current as AUIGrid;
      // const grid2 = codelookupGrid2.current as AUIGrid;
      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // grid.setCheckedRowsByIds([40]);
      });
      grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
        // console.log(event);
        if (event.item) {
          const grid2 = codelookupGrid2.current as AUIGrid;
          setCodeLookUpID(event.item.id);
          setDivCode(event.item.divCode);
          if (event.item.divCode === 'BRANCH') {
            grid2.showColumnByDataField('upperDivCode');
          } else {
            grid2.hideColumnByDataField('upperDivCode');
          }
        }
      });
      grid.setSelectionMode('singleRow');
      grid.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          setCheckRowId2([]);
          if (event.checked) {
            // console.log(event.item);
            setCheckRowId((value) => [...value, event.item.divCode]);
          }
          if (!event.checked) {
            setCheckRowId((value) => {
              const newCheckRowId = value.filter(
                (item) => item !== event.item.divCode,
              );
              return newCheckRowId;
            });
          }
        },
      );
      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          handleOpenModal3();
          setDivCode(event.item.divCode);
          setCodeLookUpID(event.item.id);
        },
      );
      grid.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          setCheckRowId2([]);
          if (event.checked) {
            // const dataItems = grid?.getGridData() as Array<{ divCode: string }>;
            // setCheckRowId(dataItems.map((item) => item.divCode));
            const dataItems = grid?.getGridData() as Array<{
              divCode: string;
              subCodeCount: number;
            }>;
            // const dataItems2 = dataSubCode;
            const filteredDivCode = dataItems
              .filter((item) => item?.subCodeCount === 1)
              .map((item) => item?.divCode);
            setCheckRowId(filteredDivCode);
          } else {
            setCheckRowId([]);
          }
        },
      );
      // grid2.bind(
      //   IGrid.EventKind.RowCheckClick,
      //   (event: IGrid.RowCheckClickEvent) => {
      //     if (event.checked) {
      //       // console.log(event.item);
      //       setCheckRowId2((value) => [...value, event.item.id]);
      //     }
      //     if (!event.checked) {
      //       setCheckRowId2((value) => {
      //         const newCheckRowId2 = value.filter(
      //           (item) => item !== event.item.id,
      //         );
      //         return newCheckRowId2;
      //       });
      //     }
      //   },
      // );
      // grid2.bind(
      //   IGrid.EventKind.RowAllChkClick,
      //   (event: IGrid.RowAllChkClickEvent) => {
      //     if (event.checked) {
      //       console.log(dataSubCode);

      //       // const dataItems2 = dataSubCode;
      //       setCheckRowId2(dataSubCode?.map((item) => item.id));
      //     } else {
      //       setCheckRowId2([]);
      //     }
      //   },
      // );
      grid.setGridData(data);
      // grid.setCheckedRowsByValue('divCode', 'AREA');
    }
  }, [loading, data]);

  useEffect(() => {
    if (!loading && data !== null) {
      const grid2 = codelookupGrid2.current as AUIGrid;
      // 그리드 ready 이벤트 바인딩
      grid2.bind(
        IGrid.EventKind.RowCheckClick,
        (event: IGrid.RowCheckClickEvent) => {
          if (event.checked) {
            // console.log(event.item);
            setCheckRowId2((value) => [...value, event.item.id]);
          }
          if (!event.checked) {
            setCheckRowId2((value) => {
              const newCheckRowId2 = value.filter(
                (item) => item !== event.item.id,
              );
              return newCheckRowId2;
            });
          }
        },
      );
      grid2.bind(
        IGrid.EventKind.RowAllChkClick,
        (event: IGrid.RowAllChkClickEvent) => {
          if (event.checked) {
            // console.log(dataSubCode);
            const dataItems = grid2?.getGridData() as Array<{
              id: number;
              use: boolean;
            }>;
            // const dataItems2 = dataSubCode;
            const filteredIds = dataItems
              .filter((item) => !item?.use)
              .map((item) => item?.id);
            setCheckRowId2(filteredIds);
          } else {
            setCheckRowId2([]);
          }
        },
      );
      // 셀더블클릭 이벤트 바인딩
      grid2.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          handleOpenModal4();
          setCodeLookUpID2(event.item.id);
        },
      );
      grid2.setGridData(dataSubCode);
      // grid.setCheckedRowsByValue('divCode', 'AREA');
    }
  }, [loading, data, dataSubCode]);
  // 특정 칼럼 값으로 체크하기 (기존 더하기)

  useEffect(() => {
    if (divCode !== '') void requestAddData();
  }, [divCode]);

  const handleOpenModal3 = () => {
    setIsModalOpen3(true);
  };
  const handleOpenModal4 = () => {
    setIsModalOpen4(true);
  };

  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      setCodeLookUpID('');
      setDivCode('null');
      refetch();
      setState({
        ...state,
        isSuccess: false,
      });
      // console.log('render');
    }
  }, [state]);

  // console.log(checkRowId);
  async function onDeleteRow() {
    // console.log(checkRowId);
    const dataToSend = {
      listDivCode: checkRowId,
    };
    const isConfirmed = window.confirm(
      '공통코드는 시스템에 영향을 주는 데이터입니다. 정말 삭제하시겠습니까?',
    );
    if (isConfirmed) {
      await deleteBatchApi(
        {
          url: `/codelookup`,
          data: dataToSend,
        },
        setState,
        // (error) => {
        //   if (error) {
        //     alert(error);
        //   }
        // },
      ).catch((error) => {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: error.code,
          content: error.message,
        });
        console.log(error);
      });
      setCheckRowId([]);
    }
  }
  function handleDeleteRow() {
    if (checkRowId.length === 0) {
      // alert('대상을 선택하세요.');
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'error',
        title: '삭제',
        content: '대상을 선택하세요.',
      });
    } else {
      void onDeleteRow();
    }
  }
  async function onDeleteRow2() {
    // console.log(checkRowId2);
    const dataToSend2 = {
      subCodeIds: checkRowId2,
    };
    const isConfirmed2 = window.confirm(
      '공통코드는 시스템에 영향을 주는 데이터입니다. 정말 삭제하시겠습니까?',
    );
    if (isConfirmed2) {
      setState2({ isLoading2: true, error2: null, isSuccess2: false });
      const accessToken = localStorage.getItem('accessToken') ?? '';
      if (accessToken) {
        const axios = hdoInstance();
        axios
          .delete('/subcodelookup/delete-batch', {
            data: dataToSend2,
            headers: { Authorization: accessToken },
          })
          .then((_response) => {
            setAlertModal({
              ...alertModal,
              open: true,
              type: 'success',
              title: '알림',
              content: '완료되었습니다.',
            });
            setState2({ isLoading2: false, error2: null, isSuccess2: true });
          })
          .catch((err) => {
            setState2({
              isLoading2: false,
              isSuccess2: false,
              error2: err?.response?.data,
            });
          });
      } else {
        setState2({
          isLoading2: false,
          isSuccess2: false,
          error2: 'token이 유효하지 않습니다.',
        });

        // window.location.replace('/');
      }

      setCheckRowId2([]);
    }
  }
  function handleDeleteRow2() {
    if (checkRowId2.length === 0) {
      alert('대상을 선택하세요.');
    } else {
      void onDeleteRow2();
    }
  }
  // useEffect(() => {
  //   console.log(checkRowId);
  //   console.log(checkRowId2);
  //   console.log(codeLookUpID);
  // }, [checkRowId, checkRowId2, codeLookUpID]);
  async function reloadSubCodeLookup() {
    setState2({
      ...state2,
      isSuccess2: false,
    });
    if (divCode !== '') void requestAddData();
  }
  useEffect(() => {
    if (state2.isSuccess2 && !state2.isLoading2) {
      void reloadSubCodeLookup();
      // console.log('render');
    }
  }, [state2]);
  return (
    <DefaultDiv>
      {/* <GridRefetch refetch={refetch} /> */}
      <GridContainer height="calc(100vh - 9.8rem)" marginTop="54px">
        <DRow>
          <DColumn width="30%">
            <GridButton
              label="구분코드"
              myGrid={codelookupGrid}
              onDelete={handleDeleteRow}
            >
              <CodeLookUpRegister state={state} setState={setState} />
            </GridButton>

            <AUIGridContainer isTableButton={true}>
              {loading && <Spinner />}
              <AUIGrid
                ref={codelookupGrid}
                columnLayout={columnLayout}
                gridProps={gridProps}
              />
            </AUIGridContainer>
          </DColumn>
          <DColumn width="70%">
            <TableButtonContainer>
              {codeLookUpID && (
                <GridButton
                  label="상세코드"
                  myGrid={codelookupGrid2}
                  onDelete={handleDeleteRow2}
                >
                  <CodeLookUpDetailRegister
                    state2={state2}
                    setState2={setState2}
                    setCodeLookUpID={setCodeLookUpID}
                    codeLookUpID={codeLookUpID}
                    divCode={divCode}
                  />
                </GridButton>
              )}
            </TableButtonContainer>

            <AUIGridContainer isTableButton={true}>
              {state2.isLoading2 && <Spinner />}
              <AUIGrid
                ref={codelookupGrid2}
                columnLayout={columnLayout2}
                gridProps={gridProps}
              />
            </AUIGridContainer>
          </DColumn>
        </DRow>

        <CodeLookupEdit
          state={state}
          setState={setState}
          setCodeLookUpID={setCodeLookUpID}
          codeLookUpID={codeLookUpID}
          setIsModalOpen3={setIsModalOpen3}
          isModalOpen3={isModalOpen3}
          divCode={divCode}
          setDivCode={setDivCode}
        />
        <CodeLookUpDetailEdit
          state2={state2}
          setState2={setState2}
          setCodeLookUpID2={setCodeLookUpID2}
          codeLookUpID2={codeLookUpID2}
          setIsModalOpen4={setIsModalOpen4}
          isModalOpen4={isModalOpen4}
          divCode={divCode}
        />
      </GridContainer>
    </DefaultDiv>
  );
};

export default CodeLookUpGrid;
