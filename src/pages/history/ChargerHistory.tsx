import Tabs from 'components/common/Tab/Tabs';
import ChargerHistoryGrid from 'components/History/ChargerHistory/ChargerHistoryGrid';

const ChargerHistory = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전내역" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ChargerHistoryGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default ChargerHistory;
