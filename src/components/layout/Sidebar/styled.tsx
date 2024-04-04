import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const SidebarWrapper = styled.aside<{ isOpen: boolean }>`
  background-color: var(--sidebar-bg-color);
  width: var(--sidebar-width);
  z-index: 10;
  height: 100%;
  border-radius: 10px;
  ${(props) =>
    !props.isOpen &&
    css`
      display: none;
    `}
`;
const SidebarHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 40px 0px 20px;
  gap: 10px;
  width: 100%;
  height: 100px;
`;

const SidebarLogo = styled.div`
  background-image: url('/assets/img/logo.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 128.11px;
  height: 21.08px;
`;

const SidebarMenu = styled.ul`
  width: var(--sidebar-width);
  padding: 0;
  overflow-y: auto;
  height: calc(100% - 120px);
  /* width */
  &::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #bbb;
  }
`;

const SidebarMenuTitle = styled.div<{
  isCollapsed?: boolean;
  status?: any;
}>`
  position: relative;
  color: ${(props) =>
    props.isCollapsed ? 'var(--white)' : 'var(--dark-default)'};
  background-color: ${(props) =>
    props.isCollapsed ? 'var(--blue-500)' : ' var(--white)'};
  border-radius: ${(props) =>
    props.isCollapsed ? '0px 20px 20px 0px' : '0px'};
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 10px 20px;
  width: 100%;
  height: 50px;
  font-weight: 500;
  font-size: 15px;
  line-height: 17px;
  cursor: pointer;
  > div {
    gap: 8px;
    display: flex;
    align-items: center;
  }
  // &:before,
  // &:after {
  //   position: absolute;
  //   height: 10px;
  //   width: 10px;
  //   background-color: orange;
  //   display: none;
  //   border-radius: 50%;
  //   font-size: 7px;
  //   color: #fff;
  //   line-height: 10px;
  //   text-align: center;
  // }
  // &:before {
  //   content: 'F';
  //   right: 12px;
  // }
  // &:after {
  //   content: 'B';
  //   right: 0px;
  // }

  ${(props) => {
    switch (props?.status?.fe) {
      case 'not-started':
        return css`
          &:before {
            background-color: orange;
            display: block;
          }
        `;
      case 'doing':
        return css`
          &:before {
            background-color: blue;
            display: block;
          }
        `;
      case 'complete':
        return css`
          &:before {
            background-color: green;
            display: block;
          }
        `;
      case 'error':
        return css`
          &:before {
            background-color: red;
            display: block;
          }
        `;
      default:
        break;
    }
  }}
  ${(props) => {
    switch (props?.status?.be) {
      case 'not-started':
        return css`
          &:after {
            background-color: orange;
            display: block;
          }
        `;
      case 'doing':
        return css`
          &:after {
            background-color: blue;
            display: block;
          }
        `;
      case 'complete':
        return css`
          &:after {
            background-color: green;
            display: block;
          }
        `;
      case 'error':
        return css`
          &:after {
            background-color: red;
            display: block;
          }
        `;
      default:
        break;
    }
  }}
`;

const SidebarMenuIcon = styled.span`
  width: 18px;
  height: 18px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
`;

const ArrowIcon = styled.span<{
  isCollapsed?: boolean;
  src: string;
  alt: string;
}>`
  background-image: ${(props) =>
    `url(${
      props.isCollapsed
        ? '/assets/img/icon/icon-arrow-up-rounded-a.png'
        : '/assets/img/icon/icon-arrow-up-rounded-d.png'
    })`};
  background-size: 20px;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  transform: ${(props) => (props.isCollapsed ? `rotate(-90deg)` : `none`)};
  transition: all 0.3s ease-in-out;
`;

const SubMenu = styled.ul`
  // position: absolute;
  width: 100%;
  background-color: #fff;
  // border-bottom: 2px solid var(--gray-200);
  // z-index: 10;
  padding-left: 36px;
`;

const SubMenuTitle = styled.div<{
  selected: boolean;
  status?: any;
}>`
  cursor: pointer;
  position: relative;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  display: block;
  padding: 10px;
  border-left: 2px solid var(--gray-200);
  color: var(--dark-default);
  text-decoration: none;
  height: 50px;
  display: flex;
  align-items: center;
  &:hover {
    border-left: 2px solid var(--blue-200);
    color: var(--blue-200);
  }
  // &:before,
  // &:after {
  //   position: absolute;
  //   height: 10px;
  //   width: 10px;
  //   background-color: orange;
  //   display: block;
  //   border-radius: 50%;
  //   font-size: 7px;
  //   color: #fff;
  //   line-height: 10px;
  //   text-align: center;
  // }
  // &:before {
  //   content: 'F';
  //   right: 12px;
  // }
  // &:after {
  //   content: 'B';
  //   right: 0px;
  // }
  ${(props) => {
    switch (props?.status?.be) {
      case 'not-started':
        return css`
          &:after {
            background-color: orange;
            display: block;
          }
        `;
      case 'doing':
        return css`
          &:after {
            background-color: blue;
            display: block;
          }
        `;
      case 'complete':
        return css`
          &:after {
            background-color: green;
            display: block;
          }
        `;
      case 'error':
        return css`
          &:after {
            background-color: red;
            display: block;
          }
        `;
      default:
        break;
    }
  }}
  ${(props) => {
    switch (props?.status?.fe) {
      case 'not-started':
        return css`
          &:before {
            background-color: orange;
            display: block;
          }
        `;
      case 'doing':
        return css`
          &:before {
            background-color: blue;
            display: block;
          }
        `;
      case 'complete':
        return css`
          &:before {
            background-color: green;
            display: block;
          }
        `;
      case 'error':
        return css`
          &:before {
            background-color: red;
            display: block;
          }
        `;
      default:
        break;
    }
  }}

  ${(props) => {
    if (props.selected) {
      return css`
        border-left: 2px solid var(--blue-200);
        color: var(--blue-200);
      `;
    }
  }}
`;

const SidebarMenuItem = styled.li<{
  isCollapsed?: boolean;
  hasSubMenu: boolean;
  default: string;
  active: string;
}>`
  position: relative;
  list-style: none;
  &:hover > div {
    color: var(--white);
    background-color: var(--blue-500);
    border-radius: 0px 20px 20px 0px;
  }
  & ${SidebarMenuIcon} {
    background-image: ${(props) =>
      `url(${props.isCollapsed ? props.active : props.default})`};
  }
  &:hover ${SidebarMenuIcon} {
    background-image: ${(props) => `url(${props.active})`};
  }
  &:hover ${ArrowIcon} {
    background-image: url('/assets/img/icon/icon-arrow-up-rounded-a.png');
  }
  & ul {
    display: ${(props) => (props.isCollapsed ? 'block' : 'none')};
  }
`;

export {
  SidebarHeader,
  SidebarLogo,
  SidebarMenu,
  SidebarMenuIcon,
  SidebarMenuItem,
  SidebarMenuTitle,
  SidebarWrapper,
  SubMenu,
  SubMenuTitle,
  ArrowIcon,
};
