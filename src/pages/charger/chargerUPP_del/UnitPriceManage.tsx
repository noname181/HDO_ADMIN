import Tab from 'components/common/Tab/Tab';
import { UnitPriceTable } from './UnitPriceTable';
// import { PricePreSet } from './PricePreSet';

export const UnitPriceManage = () => {
  return (
    <Tab
      tabs={[
        {
          id: 'unit-price-table',
          label: '단가테이블',
          content: <UnitPriceTable />,
        },
        // {
        //   id: 'price-pre-set',
        //   label: '단가 Pre-Set',
        //   content: <PricePreSet />,
        // },
      ]}
    />
  );
};
