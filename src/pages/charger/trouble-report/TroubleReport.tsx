import Tabs from 'components/common/Tab/Tabs';
import { TroubleReportGrid } from './TroubleReportGrid';

const TroubleReport = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="고장 신고 관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <TroubleReportGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default TroubleReport;
