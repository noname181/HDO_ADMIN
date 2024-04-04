import Tabs from 'components/common/Tab/Tabs';
import ParameterGrid from 'components/master/parameter/ParameterGrid';

const ParameterPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="Parameter 관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ParameterGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default ParameterPage;
