import { useState } from 'react';
import {
  TabContent,
  TabHeader,
  TabItem,
  TabLink,
  TabNav,
  TabPane,
} from './Tab.styled';
import { Button } from '../Button/Button';

interface TabProp {
  id: string;
  label: string;
  content: React.ReactNode;
}
interface TabProps {
  tabs: TabProp[];
  hideSearchButton?: boolean;
  hasAddButton?: boolean;
  onSearch?: () => void;
  onClick?: () => void;
}

export const Tab = ({
  tabs,
  hideSearchButton,
  hasAddButton,
  onClick,
  onSearch,
}: TabProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <TabHeader>
        <TabNav>
          {tabs.map((tab) => (
            <TabItem key={tab.id}>
              <TabLink
                active={activeTab === tab.id}
                onClick={() => {
                  handleTabClick(tab.id);
                }}
              >
                {tab.label}
              </TabLink>
            </TabItem>
          ))}
        </TabNav>
        {hasAddButton ? (
          <Button
            size="md"
            color="secondary"
            icon="/assets/img/icon/icon-add-w.png"
            alt="search"
          />
        ) : (
          <div
            style={{
              display: 'flex',
            }}
          >
            {!hideSearchButton && (
              <>
                <Button
                  size="md"
                  color="sub"
                  icon="assets/img/icon/icon-reset-blue.png"
                  onClick={onClick}
                />
                <div
                  style={{
                    width: 10,
                  }}
                ></div>
                <Button
                  size="md"
                  color="secondary"
                  icon="/assets/img/icon/icon-search-blue.png"
                  alt="search"
                  onClick={onSearch}
                />
              </>
            )}
          </div>
        )}
      </TabHeader>
      <TabContent>
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <TabPane key={tab.id} active={activeTab === tab.id}>
                {tab.content}
              </TabPane>
            ),
        )}
      </TabContent>
    </>
  );
};

export default Tab;
