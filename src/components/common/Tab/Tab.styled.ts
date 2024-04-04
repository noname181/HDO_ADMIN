import styled, { css } from 'styled-components';

export const TabContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  height: calc(100% - 54px);
`;

export const TabHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
