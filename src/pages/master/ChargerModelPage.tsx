import Tabs from 'components/common/Tab/Tabs';
import ChargerModelGrid from 'components/master/chargerModel/ChargerModelGrid';

export const CodeLookUpPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전기 모델 관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ChargerModelGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default CodeLookUpPage;
