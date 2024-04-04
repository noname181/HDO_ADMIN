import { Tabs } from 'components/common/Tab/Tabs';
import TemplateGrid from './TemplateGrid';

export const Template = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="템플릿 관리" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <TemplateGrid />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
