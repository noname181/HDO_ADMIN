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
import { Select } from 'antd';

import { Modal, ModalFooter } from 'components/common/Modal/Modal';
import {
  DefaultDiv,
  Spinner,
  AUIGridContainer,
  GridHeader,
  GridRefetch,
} from 'styles/style';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import { hdoInstance } from 'apis/hdoInstance';
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListAll, useGetListWt } from 'hooks/useGetListWt';
import { AreaSelectList, BranchSelectList } from 'utils/codelookup';
import { Input } from 'components/common/Input/Input';
import { type StationInterface } from 'interfaces/ICharger';
import { Button } from 'components/common/Button/Button';
import { DRow } from '../style';

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  dataChargingStation: any;
  setDataChargingStation: Dispatch<SetStateAction<any>>;
}
const SearchChargingStation = ({
  isModalOpen,
  setIsModalOpen,
  dataChargingStation,
  setDataChargingStation,
}: ModalProps) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [areaNo, setAreaNo] = useState('');
  const [rowSelected, setRowSelected] = useState<{
    chgs_id: number | '';
    chgs_station_id: string;
    chgs_name: string;
  }>();
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
    searchKey: string;
    searchVal: string;
    area: string;
    branch: string;
  }
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  // const today = `${year}-${month}-${day}`;
  const [queryState, setQueryState] = useState<PaymentDetailsInterface>({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    area: '',
    branch: '',
  });
  // 충전소 데이터 조회
  const { loading, data, refetch, totalCount } =
    useGetListAll<StationInterface>({
      location: '/charging-station',
      url:
        `/charging-stations-manage?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}` +
        `&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}` +
        `&area=${queryState.area}&branch=${queryState.branch}`,
    });
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
      labelFunction(_rowIndex, _columnIndex, value) {
        return value - _rowIndex;
      },
    },
    {
      dataField: 'areaName',
      headerText: '부문',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        if (!value && item?.category === 'EV_DIV') {
          return 'EV사업팀';
        } else {
          return value;
        }
      },
    },
    {
      dataField: 'branchName',
      headerText: '지사',
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value, headerText, item) {
        if (!value && item?.category === 'EV_DIV') {
          return 'EV사업팀';
        } else {
          return value;
        }
      },
    },
    {
      dataField: 'stat_type',
      headerText: '구분',
      style: 'text-center',
    },

    {
      dataField: 'status',
      headerText: '운영',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        if (value === 'INACTIVE') {
          return '정지';
        }
        return '운영';
      },
    },
    {
      dataField: 'chgs_station_id',
      headerText: '충전소 ID',
      style: 'text-center',
    },
    {
      dataField: 'chgs_name',
      headerText: '충전소명',
      width: '8%',
      minWidth: 180,
      style: 'text-center',
    },
    {
      dataField: 'address',
      headerText: '주소',
      width: '10%',
      minWidth: 250,
      style: 'text-center',
      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '-';
      },
    },
    {
      dataField: 'cntCharger',
      headerText: '충전기 수량',
      style: 'text-center',

      labelFunction(_rowIndex, _columnIndex, value) {
        return value ?? '0';
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
      `/charging-stations-manage?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}` +
      `&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}` +
      `&area=${queryState.area}&branch=${queryState.branch}`;

    const accessToken = localStorage.getItem('accessToken') ?? '';

    if (!accessToken) return;

    const axios = hdoInstance();
    axios(url, {
      headers: {
        Authorization: accessToken,
        Location: '/charging-station',
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

      grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
        if (event.item) {
          setRowSelected({
            chgs_id: event.item.chgs_id,
            chgs_station_id: event.item.chgs_station_id,
            chgs_name: event.item.chgs_name,
          });
        }
      });

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
      grid.setGridData(data2);
    }
  }, [loading, data]);

  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      area: '',
      branch: '',
    });
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
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refetch) {
      refetch();
    }
  };
  const handleOk = () => {
    if (rowSelected) {
      setDataChargingStation(rowSelected);
    }

    handleCloseModal();
  };
  return (
    <Modal
      open={isModalOpen}
      title="충전소 검색"
      close={handleCloseModal}
      style={{ width: '1550px' }}
    >
      <DefaultDiv>
        <GridHeader between>
          <DefaultDiv>
            <GridHeader container grid>
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
                  <Select.Option value="ACTIVE">이용</Select.Option>
                  <Select.Option value="INACTIVE">중지</Select.Option>
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
                    rpp: 50,
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
                    rpp: 50,
                  });
                }}
              />
              <DRow style={{ justifyContent: 'flex-end' }}>
                <Button onClick={search} minWidth="100px">
                  검색
                </Button>
              </DRow>
            </GridHeader>
          </DefaultDiv>
        </GridHeader>

        <AUIGridContainer isTableButton={true} style={{ height: 500 }}>
          {state.isLoading && <Spinner />}
          <AUIGrid
            ref={myGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
      </DefaultDiv>
      <ModalFooter
        okText="선택"
        closeText="취소"
        close={handleCloseModal}
        onOk={handleOk}
      />
    </Modal>
  );
};

export default SearchChargingStation;
