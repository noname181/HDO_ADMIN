import Tabs from 'components/common/Tab/Tabs';

import HDOAdminGrid from 'components/Users/HDOAdmin/HDOAdminGrid';

const HDOAdminPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="HDO 관리자" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <HDOAdminGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default HDOAdminPage;
