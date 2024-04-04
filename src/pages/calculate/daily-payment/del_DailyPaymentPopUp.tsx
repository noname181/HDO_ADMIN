import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import {
  StyledSelectInput,
  StyledSelect,
  StyledInputDate,
} from 'components/common/test/Styled.ant';

import { Modal } from 'components/common/Modal/Modal';
import {
  DefaultDiv,
  Spinner,
  AUIGridContainer,
  GridHeader,
  GridRefetch,
  type GridHeaderItemProps,
  GridHeaderItem,
  GridButton,
} from 'styles/style';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import { hdoInstance } from 'apis/hdoInstance';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
import { Input } from 'components/common/Input/Input';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}
const DailyPaymentPopUp = ({ isModalOpen, setIsModalOpen }: ModalProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [areaNo, setAreaNo] = useState('');
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    division: '',
    startDate: '',
    endDate: '',
    area: '',
    branch: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
  }: UseGetListResponse<IDailyPayment> = useGetListWt({
    url: `/v1/DailyPayment?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&division=${queryState.division}&select=${queryState.searchKey}&search=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&area=${queryState.area}&branch=${queryState.branch}`,
  });

  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '구분',
      value: queryState.division,
      onChange(e: any) {
        handleQueryChange('class', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '직영점',
          value: '직영점',
        },
        {
          label: '자영/가맹',
          value: '자영/가맹',
        },
      ],
    },
  ];
  function reloadData() {
    setQueryState({
      ...queryState,
    });
    if (refetch) {
      refetch();
    }
  }
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refetch) {
      refetch();
    }
  };
  const myGrid = useRef<AUIGrid>(null);
  const myGrid2 = useRef<AUIGrid>(null);
  // console.log(data);
  const HandleResendERP = () => {
    setAlertModal({
      ...alertModal,
      open: true,
      type: 'alert',
      title: 'Alert',
      content: `ERP로 재송신 하시겠습니까?`,
      okText: '확인',
      onCancel() {},
      onOk() {},
    });
  };
  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'd1',
      headerText: '번호',
      width: '4%',
      minWidth: 50,
      style: 'text-center',

      //   labelFunction: function (
      //     _rowIndex,
      //     _columnIndex,
      //     value,
      //     _headerText,
      //     _item,
      //     _dataField,
      //     _cItem,
      //   ) {
      //     return value - _rowIndex;
      //   },
    },
    {
      dataField: 'd2',
      headerText: '수금일자',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
    },
    {
      dataField: 'd3',
      headerText: '부문',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
    },

    {
      dataField: 'd4',
      headerText: '지사',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
    },

    {
      dataField: 'd5',
      headerText: '충전소 명',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
    },

    {
      dataField: 'd6',
      headerText: '충전소 ID',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
    },

    {
      dataField: 'd8',
      headerText: '이체건수',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
    },
    {
      dataField: 'd7',
      headerText: '총 이체금액',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
    },
    {
      dataField: 'd9',
      headerText: '송신 결과 코드',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
    },

    {
      dataField: 'edit',
      headerText: 'ERP 재전송',
      width: '8%',
      minWidth: 50,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '재시도',
        onClick: function (event) {
          HandleResendERP();
        },
      },
    },
    {
      dataField: 'd10',
      headerText: 'ERP전송 처리결과',
      style: 'red',
      width: '8%',
      minWidth: 100,
    },
    {
      dataField: 'edit',
      headerText: '처리결과조회',
      width: '8%',
      minWidth: 50,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '결과조회',
        onClick: function (event) {},
      },
    },
  ];
  const columnLayout2: IGrid.Column[] = [
    {
      dataField: 'd1',
      headerText: '총 이제 금액',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
    },

    {
      dataField: 'd2',
      headerText: '총 이체건수',
      width: '8%',
      minWidth: 100,
      style: 'text-center',
    },

    {
      dataField: 'd3',
      headerText: '펌뱅킹 정산 결과',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      renderer: {
        type: IGrid.RendererKind.TemplateRenderer,
        aliasFunction: function (
          rowIndex,
          columnIndex,
          value,
          headerText,
          item,
        ) {
          return value;
        },
      },
      labelFunction: function (rowIndex, columnIndex, value, headerText, item) {
        const grid = myGrid.current as AUIGrid;
        grid.bind(
          IGrid.EventKind.CellDoubleClick,
          (event: IGrid.CellDoubleClickEvent) => {
            // setModalPGData(event?.item?.salesDate);
          },
        );
        return `<div style="display:flex;justify-content:center">999<div style="color:red;">(3)</div></div>`;
      },
    },

    {
      dataField: 'd4',
      headerText: 'ERP전송 결과',
      style: 'text-center',
      width: '8%',
      minWidth: 100,
      renderer: {
        type: IGrid.RendererKind.TemplateRenderer,
        aliasFunction: function (
          rowIndex,
          columnIndex,
          value,
          headerText,
          item,
        ) {
          return value;
        },
      },
      labelFunction: function (rowIndex, columnIndex, value, headerText, item) {
        const grid = myGrid.current as AUIGrid;
        grid.bind(
          IGrid.EventKind.CellDoubleClick,
          (event: IGrid.CellDoubleClickEvent) => {
            // setModalPGData(event?.item?.salesDate);
          },
        );
        return `<div style="display:flex;justify-content:center">999<div style="color:red;">(3)</div></div>`;
      },
    },
  ];
  // 그리드 속성 정의
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
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
    showRowCheckColumn: false,
  };
  const gridProps2: IGrid.Props = {
    width: '100%',
    height: 100,
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
    showRowCheckColumn: false,
  };
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/v1/DailyPayment?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&division=${queryState.division}&select=${queryState.searchKey}&search=${queryState.searchVal}&startDate=${queryState.startDate}&endDate=${queryState.endDate}&area=${queryState.area}&branch=${queryState.branch}`;

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
    // if (!loading && data !== null) {
    const grid = myGrid.current as AUIGrid;
    const grid2 = myGrid2.current as AUIGrid;

    // 그리드 ready 이벤트 바인딩
    grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
      // console.log(event);
    });

    // 셀더블클릭 이벤트 바인딩
    grid.bind(
      IGrid.EventKind.CellDoubleClick,
      (event: IGrid.CellDoubleClickEvent) => {},
    );
    // 그리드 수직스크롤 이벤트 바인딩
    // grid.bind(
    //   IGrid.EventKind.VScrollChange,
    //   (event: IGrid.VScrollChangeEvent) => {
    //     const rowCount = grid.getRowCount();
    //     if (rowCount === totalCount) {
    //       grid.unbind(IGrid.EventKind.VScrollChange);
    //       return;
    //     }
    //     if (event.position === event.maxPosition) {
    //       void requestAddData();
    //     }
    //   },
    // );
    grid.bind(
      IGrid.EventKind.RowCheckClick,
      (event: IGrid.RowCheckClickEvent) => {
        // if (event.checked) {
        //   setCheckRowId((value: any) => [...value, event.item.id]);
        // }
        // if (!event.checked) {
        //   setCheckRowId((value: any) => {
        //     const newCheckRowId = value.filter(
        //       (item: any) => item !== event.item.id,
        //     );
        //     return newCheckRowId;
        //   });
        // }
      },
    );
    grid.bind(
      IGrid.EventKind.RowAllChkClick,
      (event: IGrid.RowAllChkClickEvent) => {
        // if (event.checked) {
        //   const dataItems = grid?.getGridData() as Array<{ id: number }>;
        //   setCheckRowId(dataItems?.map((item) => item.id));
        // } else {
        //   setCheckRowId([]);
        // }
      },
    );
    const data3 = data?.map((item: any) => ({
      ...item,
      totalCount: totalCount,
    }));
    // fake data
    const datafake = [];

    datafake.push({
      d1: '24,310,000',
      d2: '1,309',
      d3: '1,309(1)',
      d4: '40(4)',
    });

    const datafake2 = [];
    for (let i = 30; i > 0; i--) {
      datafake2.push({
        d1: i,
        d2: '2023-09-10',
        d3: '중부',
        d4: '서울',
        d5: '현대',
        d6: '01',
        d7: '8,310,000',
        d8: '1,142',
        d9: '성공',
        d10: '실패',
      });
    }

    // 그리드 데이터 세팅
    grid2?.setGridData(datafake);
    grid?.setGridData(datafake2);
    // }
  }, [loading, data]);
  return (
    <Modal
      open={isModalOpen}
      title="일수금 관리 상세"
      close={handleCloseModal}
      style={{ width: '1550px' }}
    >
      <DefaultDiv>
        <GridHeader between>
          <DefaultDiv>
            <GridRefetch refetch={refetch} reload={reloadData} />
            <GridHeader container grid>
              <StyledSelectInput>
                <StyledSelect
                  value={queryState.searchKey}
                  onChange={(value) => {
                    // console.log(value);
                    setQueryState({
                      ...queryState,
                      searchKey: value as string,
                    });
                  }}
                >
                  <Select.Option value="">전체</Select.Option>
                  <Select.Option value="aa">충전소명</Select.Option>
                  <Select.Option value="bb">충전소 ID</Select.Option>
                </StyledSelect>
                <Input
                  value={queryState.searchVal}
                  onChange={(event) => {
                    setQueryState({
                      ...queryState,
                      searchVal: event.target.value,
                    });
                  }}
                  onKeyDown={handleKeyPress}
                />
              </StyledSelectInput>
              <AreaSelectList
                value={queryState.area}
                onChange={(e: any) => {
                  setAreaNo(e);
                  setQueryState({
                    ...queryState,
                    area: e,
                    branch: '',
                  });
                }}
              />
              <BranchSelectList
                value={queryState.branch}
                areaNo={areaNo}
                onChange={(e: any) => {
                  setQueryState({
                    ...queryState,
                    branch: e,
                  });
                }}
              />
              <StyledInputDate iNumber={2}>
                <label>날짜</label>
                <div>
                  <DatePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    placeholder="YYYY-MM-DD"
                    value={
                      queryState?.startDate
                        ? dayjs(queryState?.startDate)
                        : null
                    }
                    onChange={(value) => {
                      // console.log(dayjs(value).format('YYYY-MM-DD'));
                      setQueryState({
                        ...queryState,
                        startDate: value
                          ? dayjs(value).format('YYYY-MM-DD')
                          : '',
                      });
                    }}
                  />
                </div>
                <div>
                  <DatePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    placeholder="YYYY-MM-DD"
                    value={
                      queryState?.endDate ? dayjs(queryState?.endDate) : null
                    }
                    onChange={(value) => {
                      // console.log(dayjs(value).format('YYYY-MM-DD'));
                      setQueryState({
                        ...queryState,
                        endDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                      });
                    }}
                  />
                </div>
              </StyledInputDate>
              {gridHeaderData.map((item, index) => {
                return (
                  <GridHeaderItem
                    key={index}
                    type={item.type}
                    label={item.label}
                    value={item.value}
                    onChange={item.onChange}
                    placeholder={item?.placeholder}
                    listData={item?.listData}
                  />
                );
              })}
            </GridHeader>
          </DefaultDiv>
        </GridHeader>
        {/* <GridButton label="매출 내역" myGrid={myGrid}></GridButton> */}

        <AUIGridContainer isTableButton={true}>
          {state.isLoading && <Spinner />}
          <div style={{ height: '100px' }}>
            <AUIGrid
              ref={myGrid2}
              columnLayout={columnLayout2}
              gridProps={gridProps2}
            />
          </div>
          <AUIGrid
            ref={myGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
      </DefaultDiv>
    </Modal>
  );
};

export default DailyPaymentPopUp;
export interface IDailyPayment {
  id: string;
}
