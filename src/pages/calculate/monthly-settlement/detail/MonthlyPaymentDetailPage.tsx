import { MonthlyPaymentDetail } from './MonthlyPaymentDetail';
import { Tabs } from 'components/common/Tab/Tabs';

export const MonthlyPaymentDetailPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="일수금 관리 상세" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <MonthlyPaymentDetail />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
