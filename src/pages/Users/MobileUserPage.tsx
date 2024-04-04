import Tabs from 'components/common/Tab/Tabs';

import MobileUserGrid from 'components/Users/MobileUser/MobileUserGrid';
import HDOAdminGrid from 'components/Users/HDOAdmin/HDOAdminGrid';
import ExternalAdminGrid from 'components/Users/externalAdmin/ExternalAdminGrid';

const MobileUserPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="모바일 회원" />
        {/* <Tabs.Trigger value="2" text="HDO관리자" />
        <Tabs.Trigger value="3" text="외부관리자" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <MobileUserGrid />
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
          <HDOAdminGrid />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <ExternalAdminGrid />
        </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};

export default MobileUserPage;
