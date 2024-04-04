import Tabs from 'components/common/Tab/Tabs';
// import ChargingStationGrid from 'components/Charger/StationManage/ChargingStationGrid';
import ChargerGrid from 'components/Charger/ChargerManage/ChargerGrid';
// import { StationMap } from 'components/Charger/StationManage/map/StationMap';

const ChargerPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전기 관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ChargerGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default ChargerPage;
