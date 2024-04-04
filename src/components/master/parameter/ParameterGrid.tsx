import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import * as IGrid from 'aui-grid';
import AUIGrid from 'AUI/AUIGrid-React/AUIGridReact';

import {
  DefaultDiv,
  GridContainer,
  GridHeader,
  GridRefetch,
  Spinner,
  GridButton,
  AUIGridContainer,
} from 'styles/style';
import { useGetListWt } from 'hooks/useGetListWt';

import { type ConfigInterface } from 'interfaces/Test/IConfig';
import { Input } from 'components/common/Input/Input';
import {
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import ParameterEdit from './Model/ParameterEdit';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { Select } from 'antd';
const ParameterGrid = () => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const [id, setId] = useState<number | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryState, setQueryState] = useState<{
    category: string;
    search: string;
  }>({
    category: '',
    search: '',
  });
  // const [checkRowId, setCheckRowId] = useState<number[]>([]);
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
  });
  const { loading, data, refetch } = useGetListWt<ConfigInterface>({
    url: `/config?category=${queryState.category}&search=${queryState.search}`,
  });
  const reload = () => {
    setQueryState({ category: '', search: '' });
    refetch();
  };
  const parameterGrid = useRef<AUIGrid>(null);

  const columnLayout: IGrid.Column[] = [
    {
      dataField: 'id',
      headerText: '번호',
      visible: false,
      style: 'text-center',
    },
    {
      dataField: 'divCode',
      headerText: '분류코드',
      width: '15%',
      style: 'text-center',
    },
    {
      dataField: 'cfgVal',
      headerText: '값',
      width: '7%',
      style: 'text-center',
    },
    {
      dataField: 'divComment',
      headerText: '설명',
      style: 'text-center',
      editRenderer: {
        type: IGrid.EditRendererKind.InputEditRenderer,
        maxlength: 140,
      },
    },
    {
      dataField: 'updatedAt',
      headerText: '수정일',
      width: '10%',
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
        return dayjs(value).format('YYYY-MM-DD');
      },
    },
    {
      dataField: 'createdAt',
      headerText: '생성일',
      width: '10%',
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
        return dayjs(value).format('YYYY-MM-DD');
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
    //       handleOpenModal();
    //       setId(event.item.id);
    //     },
    //   },
    // },
  ];

  const gridProps: IGrid.Props = {
    width: '100%',
    height: '100%',
    fillColumnSizeMode: true,
    headerHeights: [40],
    editable: false, // 편집 가능 여부
    showRowNumColumn: false,
    noDataMessage: '출력할 데이터가 없습니다.',
    rowHeight: 40,
    notBeginEventNewRowsOnPaste: false,
    uneditableNewRowsOnPaste: true,
    softRemoveRowMode: false,
    enableSorting: false,
    selectionMode: 'multipleRows',
  };

  useEffect(() => {
    if (!loading && data !== null) {
      // 그리드 ready 이벤트 바인딩
      const grid = parameterGrid.current as AUIGrid;
      grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
        // console.log(event);
      });
      grid.bind(
        IGrid.EventKind.CellDoubleClick,
        (event: IGrid.CellDoubleClickEvent) => {
          handleOpenModal();
          setId(event.item.id);
        },
      );
      grid.setGridData(data);
    }
  }, [loading, data]);
  useEffect(() => {
    if (state.isSuccess) {
      setAlertModal({
        ...alertModal,
        open: true,
        type: 'success',
        title: '알림',
        content: '완료되었습니다.',
      });
      refetch();
      setState({
        ...state,
        isSuccess: false,
      });
    }
  }, [state]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      refetch();
    }
  };
  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reload} />
      <GridHeader container grid>
        {/* <GridHeaderItem
          type="input"
          label="분류코드"
          value={queryState.divCode}
          onChange={(e: any) => {
            setQueryState({
              divCode: e.target.value,
            });
          }}
          placeholder="분류코드를 검색해주세요"
        /> */}

        <StyledSelectInput>
          <StyledSelect
            value={queryState.category}
            onChange={(value) => {
              setQueryState({
                ...queryState,
                category: value as string,
              });
            }}
          >
            <Select.Option value="">전체</Select.Option>
            <Select.Option value="divCode">분류코드</Select.Option>
            <Select.Option value="divComment">설명</Select.Option>
          </StyledSelect>
          <Input
            name="searchParameter"
            value={queryState.search}
            onChange={(event) => {
              // console.log(event.target.value);
              setQueryState({
                ...queryState,
                search: event.target.value,
              });
            }}
            onKeyDown={handleKeyPress}
          />
        </StyledSelectInput>
      </GridHeader>
      <GridContainer height="calc(100vh - 15.7rem)">
        <GridButton
          label="Parameter 관리"
          myGrid={parameterGrid}
          // onDelete={handleDeleteRow}
        ></GridButton>
        <AUIGridContainer isTableButton={true}>
          {loading && <Spinner />}
          <AUIGrid
            ref={parameterGrid}
            columnLayout={columnLayout}
            gridProps={gridProps}
          />
        </AUIGridContainer>
        <ParameterEdit
          state={state}
          setState={setState}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          id={id}
          setId={setId}
        />
      </GridContainer>
    </DefaultDiv>
  );
};

export default ParameterGrid;
