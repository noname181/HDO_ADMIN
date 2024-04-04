import Tabs from 'components/common/Tab/Tabs';
import ErrorCodeGrid from 'components/master/ErrorCode/ErrorCodeGrid';

const ErrorCodePage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="ErrorCode 조회" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <ErrorCodeGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default ErrorCodePage;
