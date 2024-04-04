import { Tabs } from 'components/common/Tab/Tabs';
import { LogHistory } from './LogHistory';

const LogHistoryPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="유저 데이터 로그" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <LogHistory />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default LogHistoryPage;
