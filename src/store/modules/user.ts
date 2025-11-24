import { defineStore } from 'pinia';
import { store } from '@/store';
import { clearAuthCache, getToken, getUser, setAuthCache } from '@/utils/auth';
import { TOKEN_KEY, USER_INFO_KEY } from '@/enums';
import { loginWithPassword, getTailorProfile } from '@/api/app';
import type { LoginParams, TailorProfile } from '@/api/interface';
// import type { UserInfo } from '#/store';

export const useUserStore = defineStore({
  id: 'app-user',

  state: () => ({
    token: getToken(),
    user: getUser() as TailorProfile,
  }),
  getters: {
    isAdmin(): boolean {
      return this.user?.role === 1;
    },
  },
  actions: {
    async login(loginModel: LoginParams) {
      try {
        const loginRes: any = await loginWithPassword(loginModel);
        const token =
          loginRes?.token || loginRes?.Result?.token || loginRes?.access_token || loginRes?.Result?.access_token;
        if (!token) throw new Error('登录失败：未返回 token');
        this.setToken(`Bearer ${token}`);

        // const profileRes: any = await getTailorProfile();
        // const userResult = profileRes?.Result ?? profileRes;
        // this.setUser(userResult);
        // return userResult;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    setToken(token: string) {
      this.token = token;
      setAuthCache(TOKEN_KEY, token);
    },

    setUser(user: any) {
      this.user = user;
      setAuthCache(USER_INFO_KEY, user);
    },

    logout() {
      clearAuthCache();
      window.location.reload();
    },
    // 临时绕过权限校验，后续接入后端权限再开启
    judgeAuth(_menu: string) {
      return true;
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
