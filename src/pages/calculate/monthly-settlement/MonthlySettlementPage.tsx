import { MonthlySettlement } from './MonthlySettlement';
import { Tabs } from 'components/common/Tab/Tabs';

export const MonthlySettlementPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="월정산관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <MonthlySettlement />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
