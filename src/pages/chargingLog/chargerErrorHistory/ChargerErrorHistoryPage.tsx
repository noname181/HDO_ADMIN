import { Tabs } from 'components/common/Tab/Tabs';
import { ChargerErrorHistory } from './ChargerErrorHistory';

const ChargerErrorHistoryPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전기 오류 로그" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ChargerErrorHistory />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default ChargerErrorHistoryPage;
