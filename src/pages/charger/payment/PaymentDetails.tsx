import Tabs from 'components/common/Tab/Tabs';
import PaymentDetailsGrid from 'components/Charger/PaymentDetails/PaymentDetailsGrid';

const PaymentDetails = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="결제내역" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <PaymentDetailsGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default PaymentDetails;
