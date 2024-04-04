import { type QueryStateInterface } from 'interfaces/ICharger';
import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  type GridHeaderItemProps,
  GridRefetch,
} from 'styles/style';
const UnitPriceGridHeader = ({
  queryState,
  setQueryState,
  refetch,
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
      type: 'input',
      label: '단가이름',
      value: queryState.unitPriceSetName,
      onChange(e: any) {
        handleQueryChange('unitPriceSetName', e.target.value);
      },
    },
    // {
    //   type: 'radio',
    //   label: '사용여부',
    //   value: queryState.isUsed,
    //   onChange(e: any) {
    //     handleQueryChange('isUsed', e.target.value);
    //   },
    //   listData: [
    //     {
    //       label: '전체',
    //       value: '',
    //     },
    //     {
    //       label: '사용',
    //       value: 'true',
    //     },
    //     {
    //       label: '미사용',
    //       value: 'false',
    //     },
    //   ],
    // },
  ];
  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reload} />
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
export default UnitPriceGridHeader;
