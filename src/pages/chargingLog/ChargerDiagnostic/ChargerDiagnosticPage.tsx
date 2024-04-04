import Tabs from 'components/common/Tab/Tabs';
import { ChargerDiagnosticGrid } from './ChargerDiagnosticGrid';
export const ChargerDiagnosticPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전기 진단정보" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ChargerDiagnosticGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
