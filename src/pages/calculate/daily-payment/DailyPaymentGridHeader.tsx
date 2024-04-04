import { type QueryStateInterface } from 'interfaces/ICharger';
import { DefaultDiv, GridHeader, GridRefetch } from 'styles/style';
import { StyledInputDate } from 'components/common/test/Styled.ant';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const DailyPaymentGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
}: QueryStateInterface<any>) => {
  // const handleQueryChange = (field: string, value: any) => {
  //   setQueryState({
  //     ...queryState,
  //     [field]: value,
  //   });
  // };
  // const gridHeaderData: GridHeaderItemProps[] = [
  //   {
  //     type: 'radio',
  //     label: '구분',
  //     value: queryState.class,
  //     onChange(e: any) {
  //       handleQueryChange('class', e.target.value);
  //     },
  //     listData: [
  //       {
  //         label: '전체',
  //         value: '',
  //       },
  //       {
  //         label: 'EV',
  //         value: 'aa',
  //       },
  //       {
  //         label: '직영점',
  //         value: 'bb',
  //       },
  //     ],
  //   },
  //   {
  //     type: 'radio',
  //     label: '전체',
  //     value: queryState.paymentMethod,
  //     onChange(e: any) {
  //       handleQueryChange('paymentMethod', e.target.value);
  //     },
  //     listData: [
  //       {
  //         label: '전체',
  //         value: '',
  //       },
  //       {
  //         label: '회원',
  //         value: 'cc',
  //       },
  //       {
  //         label: '비회원',
  //         value: 'dd',
  //       },
  //     ],
  //   },
  // ];

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
          <label>날짜</label>
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
      </GridHeader>
    </DefaultDiv>
  );
};

export default DailyPaymentGridHeader;
