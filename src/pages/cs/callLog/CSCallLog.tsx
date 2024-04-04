import CSCallMainGrid from './CSCallMainGrid';
import Tabs from 'components/common/Tab/Tabs';

const CSCallLog = () => {
  return (
    <>
      <Tabs defaultValue="1">
        <Tabs.List absolute>
          <Tabs.Trigger value="1" text="상담전화 로그" />
        </Tabs.List>
        <Tabs.Content>
          <Tabs.Panel value="1">
            <CSCallMainGrid />
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </>
  );
};

export default CSCallLog;
