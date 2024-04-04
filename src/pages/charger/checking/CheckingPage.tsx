import Tab from 'components/common/Tab/Tab';

import { CgDetail } from './CgDetail';
import { PayDetail } from './PayDetail';

export const CheckingPage = () => {
  return (
    <Tab
      tabs={[
        {
          id: 'HDOAdmin',
          label: 'HDO 관리자',
          content: <CgDetail />,
        },
        {
          id: 'admin',
          label: '외부관리자',
          content: <PayDetail />,
        },
      ]}
    />
  );
};
