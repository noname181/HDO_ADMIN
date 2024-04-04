import Tabs from 'components/common/Tab/Tabs';
import PoinyHistoryGrid from 'components/AddedService/Point/PointHistoryGrid';
const Point = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="포인트" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <PoinyHistoryGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default Point;
