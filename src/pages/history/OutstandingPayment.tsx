import Tabs from 'components/common/Tab/Tabs';
import OutstandingPaymentGrid from 'components/History/OutstandingPayment/OutstandingPaymentGrid';
const OutstandingPayment = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="미결제 내역" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <OutstandingPaymentGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default OutstandingPayment;
