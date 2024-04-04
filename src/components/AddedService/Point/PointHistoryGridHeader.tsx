import { useEffect, useState } from 'react';
import { type QueryStateInterface } from 'interfaces/ICharger';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { StyledInputDate } from 'components/common/test/Styled.ant';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';

const PointHistoryGridHeader = ({
  queryState,
  setQueryState,
  refetch,
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
      label: '포인트 유형',
      value: queryState.pType,
      onChange(e: any) {
        handleQueryChange('pType', e.target.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '사용',
          value: 'use',
        },
        {
          label: '미사용',
          value: 'earn',
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
  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} />
      <GridHeader container grid>
        <StyledInputDate iNumber={2}>
          <label>생성일</label>
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
export default PointHistoryGridHeader;
