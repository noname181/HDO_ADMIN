import { Tabs } from 'components/common/Tab/Tabs';
import { ContractorGrid } from 'components/Affiliation/ContractorManage/ContractorGrid';

const ContractorPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="협력사 관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ContractorGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default ContractorPage;
