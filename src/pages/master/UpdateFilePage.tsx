import Tabs from 'components/common/Tab/Tabs';
import UpdateFileGrid from 'components/master/UpdateFileManage/UpdateFileGrid';

const UpdateFilePage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="충전기 전송파일 관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <UpdateFileGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};

export default UpdateFilePage;
