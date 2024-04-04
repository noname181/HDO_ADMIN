import Tabs from 'components/common/Tab/Tabs';

import ExternalAdminGrid from 'components/Users/externalAdmin/ExternalAdminGrid';

const ExternalAdminPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="외부 관리자" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ExternalAdminGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default ExternalAdminPage;
