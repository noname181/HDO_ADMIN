import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sidebarData } from 'constants/sidebar';
import {
  ArrowIcon,
  SidebarHeader,
  SidebarLogo,
  SidebarMenu,
  SidebarMenuIcon,
  SidebarMenuItem,
  SidebarMenuTitle,
  SidebarWrapper,
  SubMenu,
  SubMenuTitle,
} from './styled';

import { useRecoilState } from 'recoil';
import { userAuthState } from 'recoil/authState';
import { addListPermission, handleCheckAllRules } from 'utils/permission';
interface SubMenuProps {
  menuId: string;
  title: string;
  link: string;
  status?: any;
}

interface SidebarProps {
  isOpen: boolean;
}

// 사이드바 컴포넌트
export const Sidebar = ({ isOpen }: SidebarProps) => {
  const [{ user }] = useRecoilState(userAuthState);
  const [permissionsData, setPermissionsData] = useState<any>();
  const location = useLocation();
  const navigate = useNavigate();
  const disableDomain = 'https://evnu.oilbank.co.kr';
  const [hideTestPage, setHideTest] = useState<boolean>(true);
  const queryParams = new URLSearchParams(location.search);
  const gubunParam = queryParams.get('gubun');
  // Get the current domain
  const currentDomain = window.location.origin;
  useEffect(() => {
    if (user?.role) {
      const tempArr = addListPermission(user?.role);
      setPermissionsData(tempArr);
      // console.log('left menu render');
    }
  }, [user]);
  useEffect(() => {
    if (currentDomain !== disableDomain) {
      setHideTest(false);
    }
  }, [currentDomain]);
  const [selectedMenu, setSelectedMenu] = useState(-1);
  // const selectedMenuRef = useRef(selectedMenu);

  // useEffect(() => {
  //   selectedMenuRef.current = selectedMenu;
  // }, [selectedMenu]);

  // useEffect(() => {
  //   return () => {
  //     console.log('unmount 시 출력', selectedMenuRef.current);
  //   };
  // }, []);

  // if (
  //   location.pathname ===
  //   subMenu.find((item) => item.link === location.pathname)?.link
  // ) {
  //   setSelectedMenu(index);
  // }

  // check if current is cs-home detail and form changed or not.
  const shouldAllowNavigation = (): boolean => {
    // console.log(location.pathname.replace(/\/\d+$/, ''));
    // logic to allow navigation
    // console.log(localStorage.getItem('formChanged') === 'true');
    if (
      location.pathname.replace(/\/\d+$/, '') === '/cs-home' &&
      localStorage.getItem('formChanged') === 'true'
    ) {
      return false;
    } else {
      return true;
    }
  };

  // if cs-home detail page changed form show alert
  // if click ok button action leave page
  // if click cancel button keep current page
  const navigateWithGuard = (path: string) => {
    if (shouldAllowNavigation()) {
      navigate(path);
    } else {
      const confirmed = window.confirm(
        '변경사항이 있을 수 있습니다. 이동하시겠습니까?',
      );
      if (confirmed) {
        navigate(path);
        localStorage.setItem('formChanged', 'false');
      }
    }
  };
  // 메뉴 클릭 시 상태 변경
  const handleMenuClick = (menuIndex: number, item: any) => {
    // console.log(item);
    if (selectedMenu === menuIndex) {
      // 이미 선택된 메뉴를 클릭한 경우 하위 메뉴를 닫음
      setSelectedMenu(-1);
    } else {
      setSelectedMenu(menuIndex);
    }

    // const menuItem = sidebarData[menuIndex];
    // !menuItem.children
    if (item.link) {
      // item.children이 없는 경우 "/"로 이동
      // navigate(item.link);
      navigateWithGuard(item.link);
    }
  };
  const isHidePage = (menuId: string) => {
    if (
      // menuId === 'charger-history' ||
      menuId === 'client' ||
      menuId === 'csDashboard' ||
      menuId === 'statistics'
    ) {
      return true;
    } else {
      return false;
    }
  };
  // // 서브 메뉴 렌더링
  const renderSubMenu = (subMenu: SubMenuProps[], subM: any[]) => {
    // eslint-disable-next-line array-callback-return
    return subMenu?.map((item: any) => {
      if (subM?.length > 0) {
        const pers = subM[0]?.permissions?.filter(
          (pers: any) => pers.name === item.title,
        );
        // handleCheckAllRules(pers?.rules);
        if (pers?.length > 0 && handleCheckAllRules(pers[0]?.rules)) {
          // console.log('ok');
          return (
            <li key={item.menuId}>
              {!isHidePage(item.menuId) ? (
                <SubMenuTitle
                  // to={item.link}
                  selected={
                    item.link === location.pathname.replace(/\/\d+$/, '') ||
                    (item.link === '/cs-home' &&
                      location.pathname.replace(/\/\d+$/, '') ===
                        '/cs-consultation')
                  }
                  onClick={() => {
                    handleSubMenuClick(item.link);
                  }}
                  status={item?.status}
                >
                  {item.title}
                </SubMenuTitle>
              ) : !hideTestPage ? (
                <SubMenuTitle
                  // to={item.link}
                  selected={
                    item.link === location.pathname.replace(/\/\d+$/, '')
                  }
                  onClick={() => {
                    handleSubMenuClick(item.link);
                  }}
                  status={item?.status}
                >
                  {item.title}
                </SubMenuTitle>
              ) : (
                <></>
              )}
            </li>
          );
        }
      }
    });
  };

  // // 서브 메뉴 클릭 시 상태 변경
  const handleSubMenuClick = (link: string) => {
    const menuItem = sidebarData.find((item) =>
      item.children?.some((subMenu) => subMenu.link === link),
    );
    // 선택된 메뉴의 하위 메뉴를 클릭한 경우 상태 변경하지 않음

    if (menuItem) {
      const menuIndex = sidebarData.indexOf(menuItem);
      if (selectedMenu !== menuIndex) {
        return;
      } else {
        setSelectedMenu(menuIndex);
      }
    }

    // item.children이 없는 경우 "/"로 이동
    if (link) {
      navigateWithGuard(link);
    }
  };

  // 메뉴 아이템 렌더링
  const renderMenuItems = () => {
    return sidebarData.map((item, index) => {
      const hasSubMenu = item.children !== null;
      const isCollapsed = selectedMenu === index;
      // perrmissions
      // console.log(item.title);
      const subM = permissionsData?.filter(
        (pers: any) => pers.name === item.title,
      );
      let showMenu = false;
      // console.log(subM);
      if (subM?.length > 0) {
        const checkPermission = subM[0]?.permissions?.filter(
          (itemP: any) =>
            itemP.rules.read === true ||
            itemP.rules.write === true ||
            itemP.rules.delete === true,
        );
        if (checkPermission?.length > 0) {
          showMenu = true;
        }
        // console.log(checkPermission);
      }

      return (
        <div key={item.menuId}>
          {showMenu && (
            <SidebarMenuItem
              key={item.menuId}
              isCollapsed={isCollapsed}
              hasSubMenu={hasSubMenu}
              default={item.defaultIcon}
              active={item.activeIcon}
            >
              <SidebarMenuTitle
                isCollapsed={isCollapsed}
                onClick={() => {
                  handleMenuClick(index, item);
                }}
                status={item?.status}
              >
                <div>
                  <SidebarMenuIcon />
                  {item.title}
                </div>
                {hasSubMenu && (
                  <ArrowIcon
                    isCollapsed={isCollapsed}
                    src="/assets/img/icon/icon-arrow-up-rounded-a.png"
                    alt="Arrow"
                  />
                )}
              </SidebarMenuTitle>
              {hasSubMenu && (
                <SubMenu>{renderSubMenu(item.children, subM)}</SubMenu>
              )}
            </SidebarMenuItem>
          )}
        </div>
      );
    });
  };

  return (
    <SidebarWrapper isOpen={isOpen}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarMenu>{renderMenuItems()}</SidebarMenu>
    </SidebarWrapper>
  );
};
