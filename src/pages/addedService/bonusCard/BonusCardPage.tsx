// import { createContext, useState } from 'react';
// import Tab from 'components/common/Tab/Tab';
// import { type OrganizationInterface } from 'interfaces/ICommon';
import { Tabs } from 'components/common/Tab/Tabs';

import { BonusCard } from './BonusCard';
// import PoinyHistoryGrid from 'components/AddedService/Point/PointHistoryGrid';
// import { CarWash } from '../carWash/CarWash';
// import { Coupon } from '../coupon/Coupon';
// import { Stats } from '../stats/Stats';

export const BonusCardPage = () => {
  return (
    // <Tab
    //   tabs={[
    //     {
    //       id: '/bonus-card',
    //       label: '멤버쉽',
    //       content: <BonusCard />,
    //     },
    //   ]}
    // />
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="멤버쉽" />
        {/* <Tabs.Trigger value="2" text="포인트" />
        <Tabs.Trigger value="3" text="세차권" />
        <Tabs.Trigger value="4" text="쿠폰" />
        <Tabs.Trigger value="5" text="통계" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <BonusCard />
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
          <PoinyHistoryGrid />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <CarWash />
        </Tabs.Panel>
        <Tabs.Panel value="4">
          <Coupon />
        </Tabs.Panel>
        <Tabs.Panel value="5">
          <Stats />
        </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};
