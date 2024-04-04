import { CarWashGrid } from 'components/AddedService/CarWash/CarWashGrid';
import Tabs from 'components/common/Tab/Tabs';

export const CarWashPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="세차권" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <CarWashGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
