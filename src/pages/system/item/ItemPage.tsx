import Tab from 'components/common/Tab/Tab';
import { Item } from './Item';
import { Charger } from './Charger';

export const ItemPage = () => {
  return (
    <Tab
      tabs={[
        {
          id: 'item',
          label: '시스템 항목관리',
          content: <Item />,
        },
        {
          id: 'charger',
          label: '충전기  항목관리',
          content: <Charger />,
        },
      ]}
    />
  );
};
