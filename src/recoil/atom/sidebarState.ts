import { atom } from 'recoil';

// 사이드바 접힌 메뉴 상태
export const sidebarOpenState = atom<boolean>({
  key: 'sidebarOpenState',
  default: true,
});

// 사이드바 선택된 메뉴 상태
export const sidebarMenuState = atom<number>({
  key: 'sidebarMenuState',
  default: -1,
});
