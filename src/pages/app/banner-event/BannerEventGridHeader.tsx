// import { type QueryStateInterface } from 'interfaces/ICharger';
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { Select } from 'components/common/Select/Select';
import { Input } from 'components/common/Input/Input';
import { StyledInputDate } from 'components/common/test/Styled.ant';
interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setCheckRowId: any;
}
const BannerEventGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  setCheckRowId,
}: QueryStateInterface<any>) => {
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refetch) {
      refetch();
    }
  };
  const [titleInput, settitleInput] = useState('');
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'input',
      label: '제목',
      value: titleInput,
      onChange(e: any) {
        handleQueryChange('title', e.target.value);
        settitleInput(e.target.value);
      },
      onKeyDown: handleKeyPress,
    },
  ];
  function reloadData() {
    setQueryState({
      ...queryState,
      title: '',
    });
    settitleInput('');
    if (refetch) {
      refetch();
    }
    setCheckRowId([]);
  }
  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reloadData} />
      <GridHeader container grid>
        {/* <StyledInputDate>
          <Select
            // label=""
            options={[
              { label: '전체', value: '' },
              { label: '제목', value: '제목' },
              { label: '작성자', value: '작성자' },
            ]}
            onChange={(value) => {}}
          />
          <Input onChange={(value) => {}} />
        </StyledInputDate> */}
        {gridHeaderData.map((item, index) => {
          return (
            <GridHeaderItem
              key={index}
              type={item.type}
              label={item.label}
              value={item.value}
              onChange={item.onChange}
              onKeyDown={item?.onKeyDown}
              placeholder={item?.placeholder}
              listData={item?.listData}
            />
          );
        })}
      </GridHeader>
    </DefaultDiv>
  );
};

export default BannerEventGridHeader;
