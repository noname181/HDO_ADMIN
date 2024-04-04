import Tabs from 'components/common/Tab/Tabs';
import UnexportedPaymentGrid from 'components/Charger/UnexportedPayment/UnexportedPaymentGrid';
const UnexportedPayment = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="미출차 결제 내역" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <UnexportedPaymentGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default UnexportedPayment;
