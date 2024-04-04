import Tabs from 'components/common/Tab/Tabs';
import UnitPriceGrid from 'components/Charger/UnitPrice/UnitPriceGrid';

const UnitPrice = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="단가테이블" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <UnitPriceGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
export default UnitPrice;
