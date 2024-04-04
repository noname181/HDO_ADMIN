import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Modal } from 'components/common/Modal/Modal';
import {
  DefaultDiv,
  Spinner,
  AUIGridContainer,
  GridHeader,
  GridRefetch,
  GridHeaderItem,
  type GridHeaderItemProps,
} from 'styles/style';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import { hdoInstance } from 'apis/hdoInstance';
import dayjs from 'dayjs';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { category } from 'utils/stationUtils';
import PaymentDetailsGridHeader from 'components/Charger/PaymentDetails/PaymentDetailsGridHeader';
import ConsultantPayHistoryModel from './ConsultantPayHistoryModel';
import {
  StyledSelectInput,
  StyledSelect,
  StyledInputDate,
} from 'components/common/test/Styled.ant';
import { DatePicker, Select } from 'antd';
import { Input } from 'components/common/Input/Input';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
import { Button } from 'components/common/Button/Button';
import { DRow } from '../style';
interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}
export const SearchPaymentDetail = ({
  isModalOpen,
  setIsModalOpen,
}: ModalProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [areaNo, setAreaNo] = useState('');
  const [isConsultantPayHistory, setIsConsultantPayHistory] =
    useState<boolean>();
  const [payHisData, setPayHisData] = useState<any>();
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  interface PaymentDetailsInterface {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    member: '' | 'Y' | 'N';
    payType: '' | 'pnc' | 'qr' | '회원카드';
    method: string;
    searchKey: string;
    searchVal: string;
    area: string;
    branch: string;
    category: string;
    startDate: string;
    endDate: string;
  }
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const [queryState, setQueryState] = useState<PaymentDetailsInterface>({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    member: '',
    searchKey: '',
    searchVal: '',
    payType: '',
    method: '',
    area: '',
    branch: '',
    category: '',
    startDate: today,
    endDate: today,
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
    dataAll,
  }: UseGetListResponse<PaymentDetailsInterface> = useGetListWt({
    url:
      `/v1/payment/history/details?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}` +
      `&area=${queryState.area}&branch=${queryState.branch}&method=${queryState.method}&category=${queryState.category}&member=${queryState.member}&payType=${queryState.payType}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`,
  });
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const myGrid = useRef<AUIGrid>(null);
  const gridProps: IGrid.Props = {
    width: '100%',
    height: 500,
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
        return value ? value - _rowIndex : '-';
      },
    },
    {
      dataField: 'createdAt',
      headerText: '결제일',
      width: '8%',
      minWidth: 160,

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },

    {
      dataField: 'noti_type',
      headerText: '결제 상태',
      width: '8%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        switch (value) {
          case '10':
            return '결제';
          case '20':
            return '취소';
          default:
            return '-';
        }
      },
    },
    {
      dataField: 'sb_charger_memb',
      headerText: '구분',
      width: '8%',
      minWidth: 160,
      labelFunction(_rowIndex, _columnIndex, value) {
        return category(value?.chargingStation?.org?.category) ?? '-';
      },
    },
    // {
    //   dataField: '',
    //   headerText: '전화번호',
    //   width: '8%',
    //   minWidth: 160,
    // },
    {
      dataField: 'sb_charger_memb',
      headerText: '충전소명',
      width: '12%',
      minWidth: 150,
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_name ?? '-';
      },
    },

    {
      dataField: 'sb_charger_memb',
      headerText: '충전소 ID',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.chargingStation?.chgs_station_id ?? '-';
      },
    },
    {
      dataField: 'chargingLogs',
      headerText: '충전량',
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedPrice = new Intl.NumberFormat('en-US').format(
          value?.cl_kwh,
        );
        return value?.cl_kwh ? formattedPrice + 'kWh' : '-';
      },
    },
    {
      dataField: 'chargingLogs',
      headerText: '적용단가',
      width: '8%',
      minWidth: 100,

      labelFunction(_rowIndex, _columnIndex, value, _headerText, _item) {
        if (value?.appliedUnitPrice) {
          const formattedPrice = new Intl.NumberFormat('en-US').format(
            value?.appliedUnitPrice,
          );
          return formattedPrice + '원' ?? '-';
        } else return '-';
      },
    },
    {
      dataField: 'chargingLogs',
      headerText: '인증방법',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.useType ?? '-';
      },
    },
    {
      dataField: 'chargingLogs',
      headerText: '회원구분',
      // 분류
      labelFunction(_rowIndex, _columnIndex, value) {
        return value?.userNew?.accountId ? '회원' : '비회원';
      },
    },
    {
      dataField: 'card_no_noti10',
      headerText: '카드번호',
      width: '8%',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'issuer_nm_noti10',
      headerText: '카드사',
      width: '8%',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value;
      },
    },
    {
      dataField: 'amount',
      headerText: '결제 금액',
      width: '8%',
      minWidth: 150,
      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        var formattedPrice = 0;
        if (_item?.noti_type === '10') {
          formattedPrice = _item?.amount;
        } else if (_item?.noti_type === '20') {
          formattedPrice = _item?.mgr_amt;
        }
        return new Intl.NumberFormat('en-US').format(formattedPrice);
      },
    },
  ];
  const requestAddData = async () => {
    const grid = myGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url =
      `/v1/payment/history/details?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}` +
      `&area=${queryState.area}&branch=${queryState.branch}&method=${queryState.method}&category=${queryState.category}&member=${queryState.member}&payType=${queryState.payType}&startDate=${queryState.startDate}&endDate=${queryState.endDate}`;

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
        console.log(error);
      });
  };
  useEffect(() => {
    if (!loading && data !== null) {
      const grid = myGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {});

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
          setIsConsultantPayHistory(true);
          setPayHisData(event.item);
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

      const data2 = data?.map((item: any) => ({
        ...item,
        totalCount,
      }));
      // 그리드 데이터 세팅
      grid.setGridData(data2);
    }
  }, [loading, data]);
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      member: '',
      searchKey: '',
      searchVal: '',
      payType: '',
      method: '',
      area: '',
      branch: '',
      category: '',
      startDate: today,
      endDate: today,
    });
    setAreaNo('');
    refetch();
  };
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 1,
      odby: 'DESC',
    });
    refetch();
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '구분',
      value: queryState.category,
      onChange(e: any) {
        handleQueryChange('category', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '직영점',
          value: 'STT_DIR',
        },
        {
          label: '자영점',
          value: 'STT_FRN',
        },
        {
          label: 'EV사업팀',
          value: 'EV_DIV',
        },
      ],
    },
    {
      type: 'radio',
      label: '사용자분류',
      value: queryState.member,
      onChange(e: any) {
        handleQueryChange('member', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '회원',
          value: 'Y',
        },
        {
          label: '비회원',
          value: 'N',
        },
      ],
    },

    {
      type: 'radio',
      label: '인증방법',
      value: queryState.payType,
      onChange(e: any) {
        handleQueryChange('payType', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        // {
        //   label: '카드',
        //   value: '카드',
        // },
        {
          label: 'PnC',
          value: 'pnc',
        },
        {
          label: 'QR',
          value: 'qr',
        },
        {
          label: '회원카드',
          value: '회원카드',
        },
      ],
    },
  ];
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refetch) {
      refetch();
    }
  };
  return (
    <Modal
      open={isModalOpen}
      title="결제내역"
      close={handleCloseModal}
      style={{ width: '1550px' }}
    >
      <DefaultDiv style={{ paddingBottom: 20 }}>
        {/* <GridRefetch refetch={search} reload={reload} /> */}
        <GridHeader grid>
          <StyledSelectInput>
            <StyledSelect
              value={queryState.searchKey}
              onChange={(value) => {
                setQueryState({
                  ...queryState,
                  searchKey: value as string,
                });
              }}
            >
              <Select.Option value="">전체</Select.Option>
              <Select.Option value="chgs_station_id">충전소 ID</Select.Option>
              <Select.Option value="chgs_name">충전소명</Select.Option>
              <Select.Option value="address">주소</Select.Option>
              <Select.Option value="chg_charger_id">충전기 ID</Select.Option>
              <Select.Option value="manager">현장담당자</Select.Option>
              <Select.Option value="accountId">유저 ID</Select.Option>
              <Select.Option value="user_name">이름</Select.Option>
              <Select.Option value="receivePhoneNo">전화번호</Select.Option>
              <Select.Option value="modelName">모델 명</Select.Option>
              <Select.Option value="card_no">카드번호</Select.Option>
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
          <StyledInputDate iNumber={2}>
            <label>로그 발생일자</label>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                value={
                  queryState?.startDate ? dayjs(queryState?.startDate) : null
                }
                onChange={(value) => {
                  setQueryState({
                    ...queryState,
                    startDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                  });
                }}
              />
            </div>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                picker="date"
                placeholder="YYYY-MM-DD"
                value={queryState?.endDate ? dayjs(queryState?.endDate) : null}
                onChange={(value) => {
                  setQueryState({
                    ...queryState,
                    endDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                  });
                }}
              />
            </div>
          </StyledInputDate>
          <AreaSelectList
            value={queryState.area}
            onChange={(e: any) => {
              setAreaNo(e);
              setQueryState({
                ...queryState,
                area: e,
                branch: '',
                rpp: 50,
              });
            }}
          />
          <DRow style={{ justifyContent: 'flex-end' }}>
            <Button onClick={search} minWidth="100px">
              검색
            </Button>
          </DRow>
          <BranchSelectList
            value={queryState.branch}
            areaNo={areaNo}
            onChange={(e: any) => {
              setQueryState({
                ...queryState,
                branch: e,
                rpp: 50,
              });
            }}
          />
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

        <AUIGridContainer isTableButton={true} style={{ height: 500 }}>
          {state.isLoading && <Spinner />}
          <AUIGrid
            ref={myGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
        <ConsultantPayHistoryModel
          state={state}
          setState={setState}
          isConsultantPayHistory={isConsultantPayHistory}
          setIsConsultantPayHistory={setIsConsultantPayHistory}
          payHisData={payHisData}
          setPayHisData={setPayHisData}
        />
      </DefaultDiv>
    </Modal>
  );
};
