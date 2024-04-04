import { Tabs } from 'components/common/Tab/Tabs';
import { ConfigLog } from './ConfigLog';

const ConfigLogPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="콘솔로그" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ConfigLog />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default ConfigLogPage;
