import { Settlement } from './Settlement';
import { Tabs } from 'components/common/Tab/Tabs';

export const SettlementPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="일 매출" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <Settlement />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
