import { createContext, useState } from 'react';
import Tab from 'components/common/Tab/Tab';
import { BannerEvent } from './BannerEvent';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { Tabs } from 'components/common/Tab/Tabs';

interface BannerEventContextType {
  BannerEventData: OrganizationInterface | '';
  setBannerEventData: React.Dispatch<
    React.SetStateAction<OrganizationInterface | ''>
  >;
}

const BannerEventContextState: BannerEventContextType = {
  BannerEventData: '',
  setBannerEventData: () => {},
};
export const BannerEventContext = createContext(BannerEventContextState);

export const BannerEventPage = () => {
  const [searchBannerEvent, setsearchBannerEvent] = useState<boolean>(false);
  return (
    // <Tab
    //   onSearch={() => {
    //     setsearchBannerEvent(!searchBannerEvent);
    //   }}
    //   onClick={() => {
    //     setsearchBannerEvent(!searchBannerEvent);
    //   }}
    //   tabs={[
    //     {
    //       id: 'banner-event',
    //       label: '배너/이벤트',
    //       content: <BannerEvent search={searchBannerEvent} />,
    //     },
    //   ]}
    // />
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="배너/이벤트" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <BannerEvent />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
