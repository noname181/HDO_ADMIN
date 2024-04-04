import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  GridRefetch,
  type GridHeaderItemProps,
} from 'styles/style';
import { Button } from 'components/common/Button/Button';
import { Input } from 'components/common/Input/Input';
import {
  StyledSelectInput,
  StyledSelect,
  StyledInputDate,
  StyledFormItem,
} from 'components/common/test/Styled.ant';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
// import { hdoInstance } from 'apis/hdoInstance';
import { LabelWrap } from 'components/common/Form/Form';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useEffect } from 'react';

export const NonMemberGridHeader = ({
  queryState,
  setQueryState,
  sendContents,
  refetch,
  reload,
}: any) => {
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'select',
      label: '액션',
      value: queryState.update,
      onChange(e: any) {
        handleQueryChange('update', e?.target?.value);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        {
          label: '취소',
          value: 'tyetw',
        },
        {
          label: '환불',
          value: 'aaaa',
        },
        {
          label: '결제',
          value: 'bbbb',
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
      <GridRefetch refetch={refetch} reload={reload} />
      <GridHeader container>
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
            <Select.Option value="">전체</Select.Option>
            <Select.Option value="1">전화번호</Select.Option>
            <Select.Option value="2">충전기 ID</Select.Option>
            <Select.Option value="3">충전소 명</Select.Option>
          </StyledSelect>
          <Input
            value={queryState.searchVal}
            onChange={(event) => {
              setQueryState({
                ...queryState,
                searchVal: event.target.value,
              });
            }}
          />
        </StyledSelectInput>
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
        <div style={{ width: 400 }}>
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
        </div>
      </GridHeader>
    </DefaultDiv>
  );
};
