import Tabs from 'components/common/Tab/Tabs';
import CodeLookUpGrid from 'components/master/codelookup/CodeLookUpGrid';
import ParameterGrid from 'components/master/parameter/ParameterGrid';
import ErrorCodeGrid from 'components/master/ErrorCode/ErrorCodeGrid';
import ChargerModelGrid from 'components/master/chargerModel/ChargerModelGrid';
import UpdateFileGrid from 'components/master/UpdateFileManage/UpdateFileGrid';

export const CodeLookUpPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="공통코드 관리" />
        {/* <Tabs.Trigger value="2" text="Parameter" />
        <Tabs.Trigger value="3" text="ErrorCode" />
        <Tabs.Trigger value="4" text="충전기 모델" />
        <Tabs.Trigger value="5" text="업데이트" /> */}
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <CodeLookUpGrid />
        </Tabs.Panel>
        {/* <Tabs.Panel value="2">
          <ParameterGrid />
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <ErrorCodeGrid />
        </Tabs.Panel>
        <Tabs.Panel value="4">
          <ChargerModelGrid />
        </Tabs.Panel>
        <Tabs.Panel value="5">
          <UpdateFileGrid />
        </Tabs.Panel> */}
      </Tabs.Content>
    </Tabs>
  );
};

export default CodeLookUpPage;
