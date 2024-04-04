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
interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setCheckRowId: any;
}
const NoticeGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  setCheckRowId,
}: QueryStateInterface<any>) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && refetch) {
      refetch();
    }
  };
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
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
        {/* <Select
          // label=""
          options={[
            { label: '전체', value: '' },
            { label: '제목', value: '제목' },
            { label: '작성자', value: '작성자' },
          ]}
          onChange={(value) => {}}
        /> */}
      </GridHeader>
    </DefaultDiv>
  );
};

export default NoticeGridHeader;
