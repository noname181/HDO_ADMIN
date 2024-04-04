// import { type QueryStateInterface } from 'interfaces/ICharger';
import { type Dispatch, type SetStateAction } from 'react';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';

import { StyledInputDate } from 'components/common/test/Styled.ant';
import { DatePicker, Select as Select2 } from 'antd';
import dayjs from 'dayjs';
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
      value: queryState.division,
      onChange(e: any) {
        handleQueryChange('division', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: 'HDO 회원',
          value: 'USER',
        },
        {
          label: '충전소',
          value: 'STATION',
        },
        {
          label: '주유소',
          value: 'SITE',
        },
        {
          label: '매출정산',
          value: 'KICC',
        },
        {
          label: '수금',
          value: 'DEPOSIT',
        },
      ],
    },
    {
      type: 'radio',
      label: '상태',
      value: queryState.status,
      onChange(e: any) {
        handleQueryChange('status', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '성공',
          value: 'S',
        },
        {
          label: '실패',
          value: 'N',
        },
      ],
    },
  ];

  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter' && refetch) {
  //     refetch();
  //   }
  // };

  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reload} />
      <GridHeader container grid>
        <StyledInputDate iNumber={2}>
          <label>배치 일</label>
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

export default BannerEventGridHeader;
