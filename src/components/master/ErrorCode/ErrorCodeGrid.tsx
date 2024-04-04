import { useState, useEffect, useRef } from 'react';

import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import { useGetListWt } from 'hooks/useGetListWt';

import {
  AUIGridContainer,
  DefaultDiv,
  GridButton,
  GridContainer,
  GridHeader,
  GridHeaderItem,
  GridRefetch,
  Spinner,
} from 'styles/style';
import { Input } from 'components/common/Input/Input';
import {
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { Select } from 'antd';

const ErrorCodeGrid = () => {
  const [queryState, setQueryState] = useState({
    rpp: 50,
    page: 0,
    odby: 'DESC',
    searchKey: 'ALL',
    searchVal: '',
  });

  const { loading, error, data, refetch } = useGetListWt({
    url: `/error-codes?rpp=${queryState.rpp}&page=${queryState.page}&odby=${queryState.odby}&select=${queryState.searchKey}&search=${queryState.searchVal}`,
  });
  const search = () => {
    setQueryState({
      ...queryState,
      rpp: 50,
      page: 0,
      odby: 'DESC',
    });
    refetch();
  };
  const reload = () => {
    setQueryState({
      rpp: 50,
      page: 0,
      odby: 'DESC',
      searchKey: 'ALL',
      searchVal: '',
    });
    refetch();
  };
  const ErrorCodeGrid = useRef<AUIGrid>(null);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'errorCode',
      headerText: '에러코드',
      width: '10%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'errorMsg',
      headerText: '에러메세지',
      width: '30%',
      minWidth: 50,
      style: 'text-center',
    },
    {
      dataField: 'solution',
      headerText: '해결방안',
      width: '60%',
      minWidth: 50,
      style: 'text-center',
    },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    // autoGridHeight: true,
    headerHeights: [40], // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    selectionMode: 'multipleRows',
  };

  useEffect(() => {
    if (!loading && data !== null) {
      // 그리드 ready 이벤트 바인딩
      const grid = ErrorCodeGrid.current as AUIGrid;
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });

      grid.setGridData(data);
    }
  }, [loading, data]);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      search();
    }
  };
  return (
    <DefaultDiv>
      <GridRefetch refetch={search} reload={reload} />
      <GridHeader container grid>
        {/* <GridHeaderItem
          type="input"
          label="에러코드"
          value={queryState.errorCode}
          onChange={(e: any) => {
            setQueryState({
              errorCode: e.target.value,
            });
          }}
          placeholder="에러코드를 검색해주세요"
        /> */}
        <StyledSelectInput>
          {/* <Select
            // label=""
            options={[
              { label: '전체', value: '' },
              { label: '에러코드', value: '에러코드' },
              { label: '에러메시지', value: '에러메시지' },
              { label: '해결방안', value: '해결방안' },
            ]}
            onChange={(value) => {}}
          /> */}
          <StyledSelect
            value={queryState.searchKey}
            onChange={(value) => {
              setQueryState({
                ...queryState,
                searchKey: value as string,
              });
            }}
          >
            <Select.Option value="ALL">전체</Select.Option>
            <Select.Option value="CODE">에러코드</Select.Option>
            <Select.Option value="MSG">에러메시지</Select.Option>
            <Select.Option value="SOLUTION">해결방안</Select.Option>
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
      </GridHeader>
      <GridContainer height="calc(100vh - 15.7rem)">
        <GridButton label="ErrorCode 조회" myGrid={ErrorCodeGrid}></GridButton>
        <AUIGridContainer isTableButton={true}>
          {loading && <Spinner />}
          <AUIGrid
            ref={ErrorCodeGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
      </GridContainer>
    </DefaultDiv>
  );
};

export default ErrorCodeGrid;
