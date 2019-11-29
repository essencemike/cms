import { GetterTree, MutationTree, ActionTree } from 'vuex';
import * as TYPES from '@/constants';
import { removeToken, setUser } from '@/utils';

export interface UserState {
  nickname?: string;
  username: string;
  token: string;
  userCode: string;
  roles: string | string[] | any[];
  appId: string;
}

const userState: UserState = {
  nickname: '',
  username: '',
  userCode: '',
  token: '',
  roles: '',
  appId: '',
};

const getters: GetterTree<UserState, any> = {
  nickname: (state) => state.nickname,
  username: (state) => state.username,
  userCode: (state) => state.userCode,
  token: (state) => state.token,
  roles: (state) => state.roles,
  appId: (state) => state.appId,
};

const mutations: MutationTree<UserState> = {
  [TYPES.SET_USER](state, user) {
    state.nickname = user.nickname;
    state.username = user.username;
    state.userCode = user.userCode;
    state.token = user.webToken;
    state.roles = user.roles;
    state.appId = user.woAppId;

    setUser(user);
  },

  setToken(state, token) {
    state.token = token;
  },
};

const actions: ActionTree<UserState, any> = {
  removeToken({ commit }) {
    return new Promise((resolve) => {
      commit('setToken', '');
      removeToken();
      resolve();
    });
  },
};

export default {
  state: userState,
  mutations,
  getters,
  actions,
};
