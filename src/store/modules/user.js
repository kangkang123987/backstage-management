import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
};

const actions = {
  // user login// 用异步变同步操作，替换promise
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    if (result.code == 20000) {
      commit("SET_TOKEN", result.data.token);
      setToken(result.data.token);
    } else {
      return Promise.reject(new Error("fail"));
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token);
    if (result.code == 20000) {
      if (!result.data) {
        return reject("Verification failed, please Login again.");
      } else {
        const { name, avatar } = result.data;
        commit("SET_NAME", name);
        commit("SET_AVATAR", avatar);
      }
    } else {
      return Promise.reject(new Error("fail"));
    }
  },

  // user logout
  async logout({ commit, state }) {
    let result = await logout(state.token);
    if (result.code == 20000) {
      removeToken();
      resetRouter();
      commit("RESET_STATE");
    } else {
      return Promise.reject(new Error("fail"));
    }
  },

  // remove token
  async resetToken({ commit }) {
    let result = await removeToken();
    {
      if (result.code == 20000) {
        commit("RESET_STATE");
      } else {
        return Promise.reject(new Error("fail"));
      }
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
