import Tabs from 'components/common/Tab/Tabs';
import ChargingStationGrid from 'components/Charger/ChargingStation/ChargingStationGrid';
// import ChargerGrid from 'components/Charger/ChargerManage/ChargerGrid';
// import { StationMap } from 'components/Charger/StationManage/map/StationMap';
import { useLocation } from 'react-router-dom';

const ChargingStationPage = () => {
  const location = useLocation();

  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전소" />
        {/* <Tabs.Trigger value="2" text="충전기 관리" /> */}
        {/* <Tabs.Trigger value="3" text="충전소 모니터링" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ChargingStationGrid location={location} />
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
          <ChargerGrid />
        </Tabs.Panel> */}
        {/* <Tabs.Panel value="3">
          <StationMap />
        </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};

export default ChargingStationPage;
