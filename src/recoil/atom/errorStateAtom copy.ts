import { atom } from 'recoil';

export const errorStateAtom = atom<string>({
  key: 'errorStateAtom',
  default: '',
});
