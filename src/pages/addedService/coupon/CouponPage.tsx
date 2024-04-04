import { createContext, useState } from 'react';
import Tab from 'components/common/Tab/Tab';
import { Coupon } from './Coupon';
import { type OrganizationInterface } from 'interfaces/ICommon';
import Tabs from 'components/common/Tab/Tabs';

export const CouponPage = () => {
  const [searchCoupon, setsearchCoupon] = useState<boolean>(false);
  return (
    <>
      {/* // <Tab
    //   onSearch={() => {
    //     setsearchCoupon(!searchCoupon);
    //   }}
    //   onClick={() => {
    //     setsearchCoupon(!searchCoupon);
    //   }}
    //   tabs={[
    //     {
    //       id: 'coupon',
    //       label: '쿠폰',
    //       content: <Coupon search={searchCoupon} />,
    //     },
    //   ]}
    // /> */}
      <Tabs defaultValue="1">
        <Tabs.List absolute>
          <Tabs.Trigger value="1" text="쿠폰" />
        </Tabs.List>
        <Tabs.Content>
          <Tabs.Panel value="1">
            <Coupon />
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </>
  );
};
