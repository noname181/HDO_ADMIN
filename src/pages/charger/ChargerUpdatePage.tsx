import Tabs from 'components/common/Tab/Tabs';

import { SendQRGrid } from 'components/Charger/chargerUpdate/QR/SendQRGrid';
import { SendTermsGrid } from 'components/Charger/chargerUpdate/Terms/SendTermsGrid';
import { SendAdGrid } from 'components/Charger/chargerUpdate/AD/SendAdGrid';
import { SendFWGrid } from 'components/Charger/chargerUpdate/Fw/SendFwGrid';
export const ChargerUpdatePage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        {/* <Tabs.Trigger value="1" text="QR 전송" /> */}
        <Tabs.Trigger value="1" text="약관 전송" />
        {/* <Tabs.Trigger value="2" text="광고 전송" /> */}
        <Tabs.Trigger value="3" text="FW 업데이트" />
      </Tabs.List>
      <Tabs.Content>
        {/* <Tabs.Panel value="1">
          <SendQRGrid />
        </Tabs.Panel> */}
        <Tabs.Panel value="1">
          <SendTermsGrid />
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
          <SendAdGrid />
        </Tabs.Panel> */}
        <Tabs.Panel value="3">
          <SendFWGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
