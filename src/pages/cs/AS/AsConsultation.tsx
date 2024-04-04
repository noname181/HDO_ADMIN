import Tabs from 'components/common/Tab/Tabs';
import AsConsultationGrid from './AsConsultationGrid';
const CSMain = () => {
  return (
    <>
      <Tabs defaultValue="1">
        <Tabs.List absolute>
          <Tabs.Trigger value="1" text="상담 내역 등록/ 수정" />
        </Tabs.List>
        <Tabs.Content>
          <Tabs.Panel value="1">
            <AsConsultationGrid />
          </Tabs.Panel>
        </Tabs.Content>
      </Tabs>
    </>
  );
};
export default CSMain;
