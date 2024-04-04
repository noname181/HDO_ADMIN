import Tabs from 'components/common/Tab/Tabs';
import StationGrid from 'components/Affiliation/StationManage/StationGrid';
import { ContractorGrid } from 'components/Affiliation/ContractorManage/ContractorGrid';
import ClientGrid from 'components/Affiliation/ClientManage/ClientGrid';

const StationPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="사업장 관리" />
        {/* <Tabs.Trigger value="2" text="협력사" />
        <Tabs.Trigger value="3" text="고객사" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <StationGrid />
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
          <ContractorGrid />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <ClientGrid />
        </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};

export default StationPage;
