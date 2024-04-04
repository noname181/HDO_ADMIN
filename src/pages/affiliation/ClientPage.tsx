import Tabs from 'components/common/Tab/Tabs';
import ClientGrid from 'components/Affiliation/ClientManage/ClientGrid';

const ClientPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="고객사 관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ClientGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default ClientPage;
