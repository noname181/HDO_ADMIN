import Tabs from 'components/common/Tab/Tabs';
import PaymentHistoryGrid from 'components/Charger/PaymentHistory/PaymentHistoryGrid';
// import UnexportedPaymentGrid from '../unexportedPayment/UnexportedPayment';
// import { Reservation } from '../../addedService/reservation/Reservation';

const PaymentHistory = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전 결제 내역" />
        {/* <Tabs.Trigger value="2" text="예약내역" />
        <Tabs.Trigger value="3" text="결제내역" />
        <Tabs.Trigger value="4" text="미출차 결제 내역" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <PaymentHistoryGrid />
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
          <Reservation />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <PaymentHistoryGrid />
        </Tabs.Panel>
        <Tabs.Panel value="4">
          <UnexportedPaymentGrid />
        </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};
export default PaymentHistory;
