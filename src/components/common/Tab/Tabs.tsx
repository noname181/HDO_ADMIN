import { createContext, useContext, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
interface TabsInterface {
  isFitted: boolean;
  selectedIndex: number | string | undefined;
  setSelectedIndex: React.Dispatch<
    React.SetStateAction<number | string | undefined>
  >;
  isModalOpen: boolean | undefined;
}

interface TabsProps {
  isFitted?: boolean | undefined;
  defaultValue?: number | string | undefined;
  children?: React.ReactNode;
  isModalOpen?: boolean;
}

export const TabsContext = createContext<TabsInterface>({
  isFitted: false,
  selectedIndex: '',
  setSelectedIndex: () => {},
  isModalOpen: false,
});

export const Tabs = ({
  defaultValue,
  isFitted = false,
  children,
  isModalOpen,
}: TabsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultValue);
  useEffect(() => {
    !isModalOpen && setSelectedIndex('1');
  }, [isModalOpen]);

  const providerValue = {
    isFitted,
    selectedIndex,
    setSelectedIndex,
    isModalOpen,
  };

  return (
    <TabsContext.Provider value={providerValue}>
      <TabContainer>{children}</TabContainer>
    </TabsContext.Provider>
  );
};

interface ListProps {
  absolute?: boolean;
  children?: React.ReactNode;
}

const List = ({ absolute = false, children }: ListProps) => {
  return (
    <TabHeader absolute={absolute}>
      <TabNav>{children}</TabNav>
    </TabHeader>
  );
};
interface TriggerProps2 {
  value: number | string;
  text: string;
}

const Close = () => {
  // const context = useContext(TabsContext);

  // useEffect(() => {
  //   !context.isModalOpen && context.setSelectedIndex('1');
  // }, [context.isModalOpen]);

  return <div></div>;
};
interface TriggerProps {
  value: number | string;
  text: string;
}

const Trigger = ({ value, text }: TriggerProps) => {
  const context = useContext(TabsContext);
  const isActive = context.selectedIndex === value;

  const onSelect = () => {
    // if (disabled) return; // disabled이면 early return
    context.setSelectedIndex(value);
  };

  return (
    <TabItem>
      <TabLink onClick={onSelect} active={isActive}>
        {text}
      </TabLink>
    </TabItem>
  );
};

const Content = ({ children }: ListProps) => {
  return <TabContent>{children}</TabContent>;
};

interface PanelProps {
  value: number | string;
  children?: React.ReactNode;
}

const Panel = ({ value, children }: PanelProps) => {
  const context = useContext(TabsContext);
  return context?.selectedIndex === value ? (
    <TabPane active={context.selectedIndex === value}>{children}</TabPane>
  ) : (
    <></>
  );
  // return <TabPane active={context.selectedIndex === value}>{children}</TabPane>;
};

Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Panel = Panel;
Tabs.Content = Content;
Tabs.Close = Close;
export default Tabs;

export const TabContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  height: calc(100% - 54px);
`;

export const TabHeader = styled.div<{ absolute?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 1000;
  ${(props) =>
    props.absolute &&
    css`
      position: absolute;
    `}
`;

export const TabNav = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
  border: none;
`;

export const TabItem = styled.li`
  /* 각 탭 항목의 스타일을 지정합니다. */
  & > a {
    display: block;
    margin-bottom: -1px;
    padding: 0px 10px;
    color: var(--gray-500);
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out;
    font-weight: 500;
    font-size: 16px;
    line-height: 38px;
    border: none;
    background-color: transparent;
    border-radius: 0;
  }
  & > a.active {
    color: var(--blue-200);
    border-bottom: 3px solid var(--blue-200);
  }
`;

export const TabLink = styled.button<{ active: boolean }>`
  padding: 0px 10px;
  color: var(--gray-500);
  font-weight: 500;
  font-size: 16px;
  font-family: 'Pretendard';
  line-height: 38px;
  border: none;
  background-color: transparent;
  border-radius: 0;
  cursor: pointer;
  ${(props) =>
    props.active &&
    css`
      color: var(--blue-200);
      border-bottom: 3px solid var(--blue-200);
    `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const TabContent = styled.div`
  width: 100%;
  height: calc(100% - 60px);
`;

export const TabPane = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100%;
  // overflow: hidden; Modal에서 사용시 hidden 적용으로 주석처리
  display: ${(props) => (props.active ? 'block' : 'none')};
`;
