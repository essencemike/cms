import axios from './axios';
import api from './api';

export default {
  install(Vue: any, options: any) {
    Object.defineProperty(Vue.prototype, '$api', {
      get() { return api; },
    });

    Object.defineProperty(Vue.prototype, '$axios', {
      get() { return axios; },
    });
  },
};
