import { createContext, useState } from 'react';
import Tab from 'components/common/Tab/Tab';
import { Stats } from './Stats';
import { type OrganizationInterface } from 'interfaces/ICommon';
import Tabs from 'components/common/Tab/Tabs';

export const StatsPage = () => {
  return (
    // <Tab
    //   tabs={[
    //     {
    //       id: 'stats',
    //       label: '통계',
    //       content: <Stats />,
    //     },
    //   ]}
    // />
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="통계" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <Stats />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
