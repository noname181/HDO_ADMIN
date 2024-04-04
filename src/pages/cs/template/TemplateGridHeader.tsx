import { Input, Select } from 'antd';
import {
  StyledSelect,
  StyledSelectInput,
} from 'components/common/test/Styled.ant';
import { type QueryStateInterface } from 'interfaces/ICharger';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
const TemplateGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
}: QueryStateInterface<any>) => {
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
      value: queryState.scriptType,
      onChange(e: any) {
        handleQueryChange('scriptType', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '문자',
          value: 'MES',
        },
        {
          label: '스크립트',
          value: 'COM',
        },
      ],
    },
    {
      type: 'radio',
      label: '카테고리',
      value: queryState.scriptCategory,
      onChange(e: any) {
        handleQueryChange('scriptCategory', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '결제',
          value: 'payment',
        },
        {
          label: '안내',
          value: 'info',
        },
        {
          label: '공지',
          value: 'announce',
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
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reload} />
      <GridHeader container grid>
        <StyledSelectInput>
          <StyledSelect
            value={queryState.searchKey}
            onChange={(value) => {
              setQueryState({
                ...queryState,
                searchKey: value,
              });
            }}
          >
            <Select.Option value="">전체</Select.Option>
            <Select.Option value="scrptContent">내용</Select.Option>
            <Select.Option value="scriptComment">설명</Select.Option>
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
  );
};
export default TemplateGridHeader;
