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
import {
  StyledInputDate,
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { DatePicker, Select as Select2 } from 'antd';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
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
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'radio',
      label: '액션',
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
          label: '로그인',
          value: 'SUCCESS',
        },
        {
          label: '개인정보',
          value: 'INFO',
        },
        {
          label: '엑셀 다운로드',
          value: 'EXCEL_DOWNLOAD',
        },
      ],
    },
  ];
  const validateFromEndDate = () => {
    if (queryState?.startDate !== '' && queryState?.endDate !== '') {
      const from = new Date(queryState?.startDate);
      const end = new Date(queryState?.endDate);
      // console.log(from);
      // console.log(end);
      if (from.getTime() > end.getTime()) {
        setAlertModal({
          ...alertModal,
          open: true,
          type: 'error',
          title: 'Error',
          content: '시작일이 완료일보다 미래로 설정할 수 없습니다.',
        });
        setQueryState({
          ...queryState,
          startDate: '',
          endDate: '',
        });
        // console.log('Day 1 is after Day 2.');
      }
    }
  };
  useEffect(() => {
    validateFromEndDate();
  }, [queryState.startDate, queryState?.endDate]);

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
              // console.log(value);
              setQueryState({
                ...queryState,
                searchKey: value,
              });
            }}
          >
            <Select2.Option value="all">전체</Select2.Option>
            <Select2.Option value="id">회원 ID</Select2.Option>
            <Select2.Option value="name">회원 명</Select2.Option>
            <Select2.Option value="ip">Ip</Select2.Option>
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

        <StyledInputDate iNumber={2}>
          <label>로그 발생일자</label>
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
