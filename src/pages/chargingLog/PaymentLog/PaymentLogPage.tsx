import { Tabs } from 'components/common/Tab/Tabs';
import { PaymentLog } from './PaymentLog';

const PaymentLogPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="결제로그" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <PaymentLog />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default PaymentLogPage;
