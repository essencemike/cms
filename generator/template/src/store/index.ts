/**
 * 在这里引入所有的 store modules
 */
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';

export default {
  modules: {
    app,
    user,
    permission,
  },
};
