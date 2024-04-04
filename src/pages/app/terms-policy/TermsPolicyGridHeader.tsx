import { type ChangeEvent } from 'react';
import { DefaultDiv, GridHeader, GridRefetch } from 'styles/style';
// import { Select } from 'components/common/Select/Select';
import { Input } from 'components/common/Input/Input';
import {
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { Select } from 'antd';

interface TermsPolicyGridProps {
  setcateSelected: any;
  // optionSelect?: any;
  settitleInput: any;
  titleInput: any;
  refetch: () => void;
}

const TermsPolicyGridHeader = ({
  setcateSelected,
  settitleInput,
  titleInput,
  refetch,
  reload,
  queryState,
  setQueryState,
}: any) => {
  // function reloadData() {
  //   settitleInput('');
  //   setcateSelected('');

  //   if (refetch) {
  //     refetch();
  //   }
  // }
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
          {/* <Select
            options={[
              { label: '전체', value: '' },
              { label: '카테고리', value: '카테고리' },
              { label: '제목', value: '제목' },
            ]}
            onChange={(value) => {
              setcateSelected(value.value);
            }}
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
            <Select.Option value="CATEGORY">카테고리</Select.Option>
            <Select.Option value="TITLE">제목</Select.Option>
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
    </DefaultDiv>
  );
};

export default TermsPolicyGridHeader;
