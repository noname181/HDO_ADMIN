import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
import { Input } from 'components/common/Input/Input';
import {
  StyledInputDate,
  StyledSelectInput,
  StyledSelect,
} from 'components/common/test/Styled.ant';
import { DatePicker, Select } from 'antd';
import { Button } from 'components/common/Button/Button';
import dayjs from 'dayjs';

const MobileUserGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
  setIsRegistCoporation,
  setIsEditDeliveryInfo,
}: any) => {
  // const handleQueryChange = (field: string, value: any) => {
  //   setQueryState({
  //     ...queryState,
  //     [field]: value,
  //   });
  // };

  // const gridHeaderData: GridHeaderItemProps[] = [
  //   {
  //     type: 'select',
  //     label: '구분',
  //     value: queryState.category,
  //     onChange(e: any) {
  //       handleQueryChange('category', e);
  //     },
  //     listData: [
  //       {
  //         label: '전체',
  //         value: '',
  //       },
  //       {
  //         label: '일반',
  //         value: 'DEF',
  //       },
  //       {
  //         label: '법인',
  //         value: 'BIZ',
  //       },
  //       {
  //         label: '제휴',
  //         value: 'ALLNC',
  //       },
  //       {
  //         label: '그룹',
  //         value: 'GRP',
  //       },
  //     ],
  //   },
  // ];

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
            <Select.Option value="ALL">전체</Select.Option>
            {/* <Select.Option value="ORGNAME">소속명</Select.Option> */}
            <Select.Option value="NAME">이름</Select.Option>
            <Select.Option value="ACCOUNTID">유저 ID</Select.Option>
            <Select.Option value="PHONE">전화번호</Select.Option>
            <Select.Option value="EMAIL">이메일</Select.Option>
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
        {/* {gridHeaderData.map((item, index) => {
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
        })} */}
        {queryState.category === 'BIZ' && (
          <StyledInputDate>
            <div style={{ width: '90px' }}>
              <Button
                size="md"
                color="primary"
                w100={true}
                onClick={() => {
                  setIsEditDeliveryInfo(true);
                }}
              >
                RF 발급
              </Button>
            </div>
            <div style={{ width: '90px' }}>
              <Button
                size="md"
                color="primary"
                w100={true}
                onClick={() => {
                  setIsEditDeliveryInfo(true);
                }}
              >
                퇴사처리
              </Button>
            </div>{' '}
            <div style={{ width: '90px' }}>
              <Button
                size="md"
                color="primary"
                w100={true}
                onClick={() => {
                  setIsRegistCoporation(true);
                }}
              >
                등록
              </Button>
            </div>{' '}
            <div style={{ width: '90px' }}>
              <Button size="md" color="primary" w100={true}>
                일괄등록
              </Button>
            </div>
          </StyledInputDate>
        )}
      </GridHeader>
    </DefaultDiv>
  );
};

export default MobileUserGridHeader;
