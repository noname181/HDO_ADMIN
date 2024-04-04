import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';
import * as IGrid from 'aui-grid';
import dayjs from 'dayjs';

import {
  type UpdateStateInterface,
  type StateInterface,
} from 'interfaces/ICommon';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { hdoInstance } from 'apis/hdoInstance';
import {
  AUIGridContainer,
  GridButton,
  GridContainer,
  Spinner,
} from 'styles/style';
import { Button } from 'components/common/Button/Button';
import { AddData } from './AddData';
interface CouponGridTableProps {
  loading: boolean;
  data: any;
  state: StateInterface;
  setState: React.Dispatch<React.SetStateAction<StateInterface>>;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setCouponId: Dispatch<SetStateAction<number | ''>>;
  totalCount: number | null;
  queryState: any;
  setQueryState: React.Dispatch<React.SetStateAction<any>>;
}

export const CouponGrid = ({
  loading,
  data,
  state,
  setState,
  setIsEditOpen,
  setCouponId,
  totalCount,
  queryState,
  setQueryState,
}: CouponGridTableProps) => {
  const couponGrid = useRef<AUIGrid>(null);
  const [couponData, setCouponData] = useState('');
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
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
      dataField: 'number',
      headerText: '쿠폰 번호',
      style: 'text-center',
    },
    {
      dataField: 'information',
      headerText: '쿠폰 정보',
      style: 'text-center',
    },

    {
      dataField: '',
      headerText: '회원명',
      style: 'text-center',

      labelFunction(
        _rowIndex,
        _columnIndex,
        value,
        _headerText,
        _item,
        _dataField,
        _cItem,
      ) {
        return _item?.createdBy?.name;
      },
    },
    {
      dataField: 'isUsed',
      headerText: '사용여부',
      style: 'text-center',
    },
    {
      dataField: 'd7',
      headerText: '사용처',
      style: 'text-center',
    },
    {
      dataField: 'division',
      headerText: '구분',
      style: 'text-center',
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      style: 'text-center',

      width: 100,
      labelFunction(_rowIndex, _columnIndex, value) {
        const formattedValue = dayjs(value).format('YYYY-MM-DD');
        return formattedValue;
      },
    },
    {
      dataField: 'edit',
      headerText:
        '<img src="./assets/img/icon/icon-options.png" style="vertical-align:middle;width: 16px;height:auto;">',
      width: '4%',
      minWidth: 50,
      renderer: {
        type: IGrid.RendererKind.IconRenderer,
        iconWidth: 18,
        iconHeight: 18,
        iconTableRef: {
          default: './assets/img/icon/icon-edit.png',
        },
        onClick: function (event) {
          setIsEditOpen(true);
          setCouponId(event.item.id);
        },
      },
    },
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
  // 데이터 요청 function
  const requestAddData = async () => {
    const grid = couponGrid.current as AUIGrid;

    setQueryState({
      ...queryState,
      page: queryState.page++,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `/coupon?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&number=${queryState.couponNumber}`;

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
      const grid = couponGrid.current as AUIGrid;

      // 그리드 ready 이벤트 바인딩
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      // 셀더블클릭 이벤트 바인딩
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          setCouponData(event.item);
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
      const data3 = data.map((item: any) => ({
        ...item,
        totalCount: totalCount,
      }));
      // 그리드 데이터 세팅
      grid.setGridData(data3);
    }
  }, [loading, data]);

  return (
    <>
      <GridContainer height="calc(100vh - 15.7rem)">
        <GridButton label="쿠폰발행" myGrid={couponGrid}>
          {/* <Button
      size="md"
      color="reset"
      icon="/assets/img/icon/icon-trash.png"
      alt="비활성"
    >
      취소
    </Button> */}
          <Button
            size="md"
            color="primary"
            icon="/assets/img/icon/icon-add-w.png"
            alt="등록"
            onClick={handleOpenModal}
          >
            등록
          </Button>
          {/* <AddData state={state} setState={setState} /> */}
        </GridButton>
        <AUIGridContainer isTableButton={true}>
          {loading && <Spinner />}
          <AUIGrid
            ref={couponGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
        <AddData
          state={state}
          setState={setState}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </GridContainer>
    </>
  );
};
