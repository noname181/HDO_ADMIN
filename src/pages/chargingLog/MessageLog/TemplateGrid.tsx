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
  StyledFormItem,
  StyledInput,
} from 'components/common/test/Styled.ant';
import { Select } from 'antd';

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
import { type UseGetListResponse } from 'interfaces/IUseGetData';
import { useGetListWt } from 'hooks/useGetListWt';
import { Input } from 'components/common/Input/Input';
import { Button } from 'components/common/Button/Button';

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}
const TemplateGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  });

  interface PaymentDetailsInterface {
    rpp: number; // 1page data 조회 갯수
    page: number; // rpp에 따른 조회 페이지 번호
    odby: 'DESC' | 'ASC'; // 정렬순서 default DESC 내림차순 <-> ASC 오름차순
    searchKey: string;
    searchVal: string;
    category: string;
  }

  const [queryState, setQueryState] = useState<PaymentDetailsInterface>({
    rpp: 50,
    page: 1,
    odby: 'DESC',
    searchKey: '',
    searchVal: '',
    category: '',
  });
  const {
    loading,
    error,
    data,
    refetch,
    totalCount,
    dataAll,
  }: UseGetListResponse<PaymentDetailsInterface> = useGetListWt({
    url: `/v1/test/test/details?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&searchVal=${queryState.searchVal}&category=${queryState.category}`,
  });
  const myGrid = useRef<AUIGrid>(null);
  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
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
      dataField: 'd1',
      headerText: '카테고리',
      width: '4%',
      minWidth: 70,
    },

    {
      dataField: 'd2',
      headerText: '내용',
      width: 'auto',
      minWidth: 150,
      style: 'text-left',
    },
    {
      dataField: 'd3',
      headerText: '설명',
      width: '4%',
      minWidth: 80,
      style: 'text-left',
    },

    {
      dataField: 'edit',
      headerText: '',
      width: '12%',
      minWidth: 150,
      renderer: {
        type: IGrid.RendererKind.ButtonRenderer,
        labelText: '선택',
        onClick: function (event) {},
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
    const url = `/v1/test/test/details?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&searchKey=${queryState.searchKey}&category=${queryState.category}`;

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
      });
  };
  useEffect(() => {
    // if (!loading && data !== null) {
    const grid = myGrid.current as AUIGrid;

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

    const data2 = data?.map((item: any) => ({
      ...item,
      totalCount,
    }));

    // console.log(data2);
    // 그리드 데이터 세팅
    const datafake = [];

    for (let i = 30; i > 0; i--) {
      datafake.push({
        d1: '결제',
        d2: '상담사 공유 스크립트 3 입니다. 세 번째 상담 내용을 작성해 주세요 오늘 작성 : 2023.11.05 script3',
        d3: '이벤트 안내 문구',
      });
    }
    grid.setGridData(datafake);
    // }
  }, [loading, data]);
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 1,
      odby: 'DESC',
      searchKey: '',
      searchVal: '',
      category: '',
    });
    refetch();
  };
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
          label: '공지',
          value: '공지',
        },
        {
          label: '안내',
          value: '안내',
        },
        {
          label: '결제',
          value: '결제',
        },
      ],
    },
  ];

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
  return (
    <DefaultDiv>
      {/* <GridRefetch refetch={refetch} reload={reload} /> */}

      <GridHeader between>
        {/* <StyledSelectInput>
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
            <Select.Option value="test">test</Select.Option>
          </StyledSelect>
          <Input
            style={{ width: '100%' }}
            value={queryState.searchVal}
            onChange={(event) => {
              setQueryState({
                ...queryState,
                searchVal: event.target.value,
              });
            }}
            onKeyDown={handleKeyPress}
          />
        </StyledSelectInput> */}
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
        <div></div>
        <StyledFormItem name="test">
          <StyledInput style={{ width: '270px' }} />
        </StyledFormItem>
        <Button>검색</Button>
      </GridHeader>

      <AUIGridContainer isTableButton={true} style={{ height: '282px' }}>
        {state.isLoading && <Spinner />}
        <AUIGrid
          ref={myGrid}
          columnLayout={columnLayout}
          gridProps={gridProps}
        />
      </AUIGridContainer>
    </DefaultDiv>
  );
};

export default TemplateGrid;
