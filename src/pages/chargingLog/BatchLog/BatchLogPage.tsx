import { Tabs } from 'components/common/Tab/Tabs';
import { BatchLog } from './BatchLog';

const BatchLogPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="배치 로그" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <BatchLog />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default BatchLogPage;
