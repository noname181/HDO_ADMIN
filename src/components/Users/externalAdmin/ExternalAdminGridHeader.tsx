import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  GridRefetch,
  type GridHeaderItemProps,
} from 'styles/style';

// import { Select } from 'components/common/Select/Select';
import { Input } from 'components/common/Input/Input';
import {
  StyledInputDate,
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { alertModalState } from 'recoil/modalState';
import { useEffect } from 'react';

const ExternalAdminGridHeader = ({
  queryState,
  setQueryState,
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
      label: '구분',
      value: queryState.category,
      onChange(e: any) {
        handleQueryChange('category', e);
      },
      listData: [
        {
          label: '전체',
          value: '',
        },
        // {
        //   label: '직영 충전소',
        //   value: 'STT_DIR',
        // },
        // {
        //   label: '자영 충전소',
        //   value: 'STT_FRN',
        // },
        {
          label: 'CS',
          value: 'CS',
        },
        {
          label: 'AS센터',
          value: 'AS',
        },
        {
          label: '법인',
          value: 'BIZ',
        },
        {
          label: '제휴',
          value: 'ALLNC',
        },
        // {
        //   label: '그룹',
        //   value: 'GRP',
        // },
      ],
    },
    // {
    //   type: 'input',
    //   label: '소속명',
    //   value: queryState.orgName,
    //   placeholder: '소속명을 입력해주세요',
    //   onChange(e: any) {
    //     handleQueryChange('orgName', e.target.value);
    //   },
    // },
    // {
    //   type: 'input',
    //   label: '이름',
    //   value: queryState.name,
    //   placeholder: '이름을 입력해주세요. (전체입력)',
    //   onChange(e: any) {
    //     handleQueryChange('name', e.target.value);
    //   },
    // },
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
          {/* <Select
            // label=""
            options={[
              { label: '전체', value: 'ALL' },
              { label: '소속명', value: 'ORGNAME' },
              { label: '이름', value: 'NAME' },
              { label: '이메일', value: 'ACCOUNTID' },
              { label: '전화', value: 'PHONE' },
            ]}
            onChange={(value) => {}}
          /> */}
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
            <Select.Option value="ALL">전체</Select.Option>
            <Select.Option value="ORGNAME">소속명</Select.Option>
            <Select.Option value="NAME">이름</Select.Option>
            <Select.Option value="ACCOUNTID">이메일</Select.Option>
            <Select.Option value="PHONE">전화</Select.Option>
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

export default ExternalAdminGridHeader;
