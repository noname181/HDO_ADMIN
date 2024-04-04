import { Tabs } from 'components/common/Tab/Tabs';
import { ChargerStatusHistory } from './ChargerStatusHistory';
import { ChargerErrorHistory } from '../chargerErrorHistory/ChargerErrorHistory';
import { ChargerDiagnosticGrid } from 'pages/chargingLog/ChargerDiagnostic/ChargerDiagnosticGrid';
import { ConfigLog } from 'pages/chargingLog/ConfigLog/ConfigLog';

const ChargerStatusHistoryPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전기 상태로그" />
        <Tabs.Trigger value="2" text="충전기 오류로그" />
        <Tabs.Trigger value="3" text="충전기 진단정보" />
        {/* <Tabs.Trigger value="4" text="OCPP 로그" />
        <Tabs.Trigger value="5" text="백앤드 로그" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ChargerStatusHistory />
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <ChargerErrorHistory />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <ChargerDiagnosticGrid />
        </Tabs.Panel>
        {/* <Tabs.Panel value="4">
          <ConfigLog />
        </Tabs.Panel>
        <Tabs.Panel value="5">
          <ConfigLog />
        </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};

export default ChargerStatusHistoryPage;
