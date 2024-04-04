import Tabs from 'components/common/Tab/Tabs';

import { NonMemberGrid } from 'components/ChargingLog/NonMembers/NonMembersGrid';
import { HDOManagerGrid } from 'components/ChargingLog/HDOManager/HDOManagerGrid';
import { MobileMemberGrid } from 'components/ChargingLog/MobileMember/MobileMemberGrid';
import { PartnersGrid } from 'components/ChargingLog/Partners/PartnersGrid';

export const ChargingLogPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        {/* <Tabs.Trigger value="1" text="비회원" />
        <Tabs.Trigger value="2" text="모바일 회원" /> */}
        <Tabs.Trigger value="1" text="협력업체" />
        <Tabs.Trigger value="2" text="HDO 관리자" />
      </Tabs.List>
      <Tabs.Content>
        {/* <Tabs.Panel value="1">
          <NonMemberGrid />
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <MobileMemberGrid />
        </Tabs.Panel> */}
        <Tabs.Panel value="1">
          <PartnersGrid />
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <HDOManagerGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
