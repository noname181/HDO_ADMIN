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
import { StyledInputDate } from 'components/common/test/Styled.ant';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
interface QueryStateInterface<T> {
  queryState: T;
  setQueryState: Dispatch<SetStateAction<T>>;
  addData?: () => void;
  refetch?: () => void;
  reload?: () => void;
  setCheckRowId: any;
}
const NoticePopUpGridHeader = ({
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
    {
      type: 'radio',
      label: '유형',
      value: queryState.type,
      onChange(e: any) {
        handleQueryChange('type', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: 'WEB',
          value: 'WEB',
        },
        {
          label: 'MOBILE',
          value: 'MOBILE',
        },
      ],
    },
    {
      type: 'radio',
      label: '노출여부',
      value: queryState.exposure,
      onChange(e: any) {
        handleQueryChange('exposure', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '노출',
          value: 'Y',
        },
        {
          label: '비노출',
          value: 'N',
        },
      ],
    },
  ];
  function reloadData() {
    setQueryState({
      ...queryState,
      title: '',
      exposure: '',
      startDate: '',
      endDate: '',
      type: '',
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
        <StyledInputDate iNumber={2}>
          <label htmlFor="">노출기간</label>

          <div>
            <DatePicker
              format="YYYY-MM-DD"
              picker="date"
              placeholder="YYYY-MM-DD"
              value={
                queryState?.startDate ? dayjs(queryState?.startDate) : null
              }
              onChange={(value) => {
                // console.log(dayjs(value).format('YYYY-MM-DD'));
                // console.log(value);
                setQueryState({
                  ...queryState,
                  startDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                });
              }}
            />
          </div>
          <div>
            <DatePicker
              format="YYYY-MM-DD"
              picker="date"
              placeholder="YYYY-MM-DD"
              value={queryState?.endDate ? dayjs(queryState?.endDate) : null}
              onChange={(value) => {
                // console.log(dayjs(value).format('YYYY-MM-DD'));
                setQueryState({
                  ...queryState,
                  endDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
                });
              }}
            />
          </div>
        </StyledInputDate>
      </GridHeader>
    </DefaultDiv>
  );
};

export default NoticePopUpGridHeader;
