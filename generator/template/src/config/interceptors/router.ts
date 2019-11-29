/**
 * 全局的路由拦截配置
 */
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { getToken, getUser } from '@/utils';
import { filterAsyncRoutes } from '@/utils/permission';
import { appRouter } from '@/routes';
import store from '@/plugins/store';
import { GENERATE_ROUTES } from '@/constants';
import { scrollTop } from '@/utils/tools';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login'];

export function routerBeforeEachFn(to: any, form: any, next: any) {
  // 显示进度条
  NProgress.start();

  // 这里可以做页面拦截， 也可以做权限处理
  // checkPermission(to, form);
  const token = getToken();
  if (token) {
    // 先过滤路由
    const user = getUser();
    const roles = (user.roles || []).map((u: any) => u.roleName);
    const accessRouter = filterAsyncRoutes(appRouter, roles);
    store.dispatch(GENERATE_ROUTES, accessRouter);

    // 如果存在 token，并且跳转的页面是登录页面，自动跳转到首页
    // 如果不是登录页，直接放过
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      next();
    }
  } else {
    // 如果不存在 token， 排除白名单页面，防止循环跳转，导致死循环
    if (whiteList.includes(to.path)) {
      next();
    } else {
      // 不是白名单里面的路由，又没有 token， 直接跳转到登录页面
      // 同时把要跳转的页面当成重定向的参数传递给登录页面
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
      NProgress.done();
    }
  }
}

export function routerAfterEachFn(to: any, form: any) {
  // 不保留滚动位置
  const el = document.querySelector('.app-main-wrapper');
  if (el) {
    setTimeout(() => {
      el.scrollTop = 0;
    }, 300);
  }
  NProgress.done();
}
