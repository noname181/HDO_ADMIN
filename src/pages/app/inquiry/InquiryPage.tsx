import { createContext, useState } from 'react';
import { Inquiry } from './Inquiry';
import { Tabs } from 'components/common/Tab/Tabs';

export const InquiryPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="1:1문의" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <Inquiry />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
