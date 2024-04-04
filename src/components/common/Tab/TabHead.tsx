import { type ReactNode, useState } from 'react';
import { TabHeader, TabItem, TabLink, TabNav } from './Tab.styled';
import { type TabIDInterface, type StateTabProps } from 'interfaces/ICommon';
interface tabItems {
  id: string;
  label: string;
}

interface TabProps {
  tabItems: tabItems[];
  children?: ReactNode;
  tabState: TabIDInterface;
  setTabState: (param: any) => void;
}

export const TabHead = ({
  tabItems,
  children,
  tabState,
  setTabState,
}: TabProps) => {
  const handleTabClick = (tabId: string) => {
    setTabState({ id: tabId });
  };

  return (
    <>
      <TabHeader>
        <TabNav>
          {tabItems?.map((tab) => (
            <TabItem key={tab.id}>
              <TabLink
                active={tabState.id === tab?.id}
                onClick={() => {
                  handleTabClick(tab?.id);
                }}
              >
                {tab.label}
              </TabLink>
            </TabItem>
          ))}
        </TabNav>
        {children}
      </TabHeader>
    </>
  );
};

export default TabHead;
