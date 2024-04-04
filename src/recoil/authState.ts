import { atom, selector } from 'recoil';
import { type User } from 'interfaces/ICommon';

interface UserAuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export const userAuthState = atom<UserAuthState>({
  key: 'userAuthState',
  default: {
    isAuthenticated: false,
    user: null,
  },
});

export const isLoggedInState = selector<boolean>({
  key: 'isLoggedInState',
  get: ({ get }) => {
    const authState = get(userAuthState);
    return authState.isAuthenticated;
  },
});
