import { Tabs } from 'components/common/Tab/Tabs';
import { MessageLog } from './MessageLog';
import { KakaoMessageLog } from './kakao/KakaoMessageLog';

const MessageLogPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="문자 내역관리" />
        <Tabs.Trigger value="2" text="알림톡 내역관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <MessageLog />
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <KakaoMessageLog />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default MessageLogPage;
