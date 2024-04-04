// import { type QueryStateInterface } from 'interfaces/ICharger';
import { useState, type Dispatch, type SetStateAction } from 'react';
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
  refetch?: () => void;
  setCheckRowId: any;
}
const ReviewGridHeader = ({
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
  const [contentInput, setcontentInput] = useState('');
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'input',
      label: '내용',
      value: contentInput,
      onChange(e: any) {
        handleQueryChange('content', e.target.value);
        setcontentInput(e.target.value);
      },
    },
  ];
  function reloadData() {
    setQueryState({
      ...queryState,
      content: '',
    });
    setcontentInput('');
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
              placeholder={item?.placeholder}
              listData={item?.listData}
            />
          );
        })}
      </GridHeader>
    </DefaultDiv>
  );
};

export default ReviewGridHeader;
