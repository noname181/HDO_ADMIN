import { SettlementDetail } from './SettlementDetail';
import { Tabs } from 'components/common/Tab/Tabs';

export const SettlementDetailPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="일 매출 상세" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <SettlementDetail />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
