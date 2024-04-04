import Tabs from 'components/common/Tab/Tabs';

import PermissionAdminGrid from 'components/Users/PermissionAdmin/PermissionAdminGrid';

const PermissionAdminPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="권한관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <PermissionAdminGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default PermissionAdminPage;
