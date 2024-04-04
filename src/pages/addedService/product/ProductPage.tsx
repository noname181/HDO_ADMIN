import { createContext, useState } from 'react';
import Tab from 'components/common/Tab/Tab';
import { Product } from './Product';
import { type OrganizationInterface } from 'interfaces/ICommon';

export const ProductPage = () => {
  return (
    <Tab
      tabs={[
        {
          id: 'product',
          label: '부가서비스',
          content: <Product />,
        },
      ]}
    />
  );
};
