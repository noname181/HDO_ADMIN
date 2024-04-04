import { Tabs } from 'components/common/Tab/Tabs';
import CallGrid from './Call/CallGrid';
import CounselGrid from './Counsel/CounselGrid';
import RefundGrid from './Refund/RefundGrid';

const Statistics = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="Call 통계" />
        <Tabs.Trigger value="2" text="상담 통계" />
        <Tabs.Trigger value="3" text="환불 통계" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <CallGrid />
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <CounselGrid />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <RefundGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default Statistics;
