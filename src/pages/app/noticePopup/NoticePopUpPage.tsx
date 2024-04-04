import { createContext, useState } from 'react';
import { NoticePopUp } from './NoticePopUp';
import { type OrganizationInterface } from 'interfaces/ICommon';
import { Tabs } from 'components/common/Tab/Tabs';

interface NoticePopUpContextType {
  NoticePopUpData: OrganizationInterface | '';
  setNoticePopUpData: React.Dispatch<
    React.SetStateAction<OrganizationInterface | ''>
  >;
}

const NoticePopUpContextState: NoticePopUpContextType = {
  NoticePopUpData: '',
  setNoticePopUpData: () => {},
};
export const NoticePopUpContext = createContext(NoticePopUpContextState);

export const NoticePopUpPage = () => {
  return (
    <Tabs defaultValue="1">
      <Tabs.List absolute>
        <Tabs.Trigger value="1" text="공지 팝업" />
      </Tabs.List>
      <Tabs.Content>
        <Tabs.Panel value="1">
          <NoticePopUp />
        </Tabs.Panel>
      </Tabs.Content>
    </Tabs>
  );
};
