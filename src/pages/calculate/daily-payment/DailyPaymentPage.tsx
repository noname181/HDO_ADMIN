import { DailyPayment } from './DailyPayment';
import { Tabs } from 'components/common/Tab/Tabs';

export const DailyPaymentPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="일 수금관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <DailyPayment />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
