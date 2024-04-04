import { Review } from './Review';
import { Tabs } from 'components/common/Tab/Tabs';

export const ReviewPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="리뷰" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <Review />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
