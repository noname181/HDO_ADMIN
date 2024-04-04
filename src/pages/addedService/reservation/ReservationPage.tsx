import { createContext, useState } from 'react';
import Tab from 'components/common/Tab/Tab';
import { Reservation } from './Reservation';
import { type OrganizationInterface } from 'interfaces/ICommon';
import Tabs from 'components/common/Tab/Tabs';

export const ReservationPage = () => {
  return (
    // <Tab
    //   tabs={[
    //     {
    //       id: 'reservation',
    //       label: '예약내역',
    //       content: <Reservation />,
    //     },
    //   ]}
    // />
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="예약내역" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <Reservation />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
