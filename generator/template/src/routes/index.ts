/**
 * 在这里配置路由信息
 * 路由中 meta 除了原生参数外可配置的参数:
 * meta: {
 *  hidden: (false) 设为true后在左侧菜单不会显示该页面选项
 *  title: '' i18n 国际化
 *  alwaysShow: (false) 设为true后，无论children有几个都显示父页面，设为false后，只有children大于1个的时候才显示父页面
 *  activeMenu: '' 当菜单隐藏时， 设置他的高亮菜单
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  href: '' 设置此链接后，点击将打开新的页面
 * }
 */
import Layout from '@/views/Layout/Layout.vue';

// 不作为 Layout 组件的子页面展示的页面单独写，如下：
export const login = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/Login/Login.vue'),
};

export const appRouter = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/orderEntry',
  // },
  // {
  //   path: '/orderEntry',
  //   component: Layout,
  //   redirect: '/orderEntry/index',
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'OrderEntry',
  //       component: () => import('@/views/OrderEntry/index.vue'),
  //       meta: { title: 'orderEntry', icon: 'fa-home' },
  //     },
  //   ],
  // },
  // {
  //   path: '/myOrder',
  //   component: Layout,
  //   redirect: '/myOrder/index',
  //   name: 'Order',
  //   meta: { title: 'myOrder', icon: 'fa-file-text-o' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'MyOrder',
  //       component: () => import('@/views/MyOrder/List.vue'),
  //       meta: { title: 'myOrder', icon: 'fa-file-text-o' },
  //     },
  //     {
  //       path: 'detail/:id',
  //       name: 'OrderDetail',
  //       component: () => import('@/views/MyOrder/Detail.vue'),
  //       hidden: true,
  //       meta: { title: 'checkOrder', activeMenu: '/myOrder/index' },
  //     },
  //     {
  //       path: 'editOrder/:id',
  //       name: 'EditOrder',
  //       component: () => import('@/views/OrderEntry/index.vue'),
  //       hidden: true,
  //       meta: { title: 'editOrder', activeMenu: '/myOrder/index' },
  //     },
  //     {
  //       path: 'entryCustomerInfo/:id',
  //       name: 'EntryCustomerInfo',
  //       component: () => import('@/views/CustomerData/index.vue'),
  //       hidden: true,
  //       meta: { title: 'customerDataEntry', activeMenu: '/myOrder/index' },
  //     },
  //     {
  //       path: 'editCustomerInfo/:id',
  //       name: 'EditCustomerInfo',
  //       component: () => import('@/views/CustomerData/index.vue'),
  //       hidden: true,
  //       meta: { title: 'modifyCustomerData', activeMenu: '/myOrder/index' },
  //     },
  //     {
  //       path: 'customerInfo/:id',
  //       name: 'CustomerInfo',
  //       component: () => import('@/views/CustomerData/Detail.vue'),
  //       hidden: true,
  //       meta: { title: 'checkCustomerData', activeMenu: '/myOrder/index' },
  //     },
  //     {
  //       path: '/miniProgramDetail/:id',
  //       name: 'MiniProgramDetail',
  //       component: () => import('@/views/CheckMiniProgram/index.vue'),
  //       hidden: true,
  //       meta: { title: 'viewApplet', activeMenu: '/myOrder/index' },
  //     },
  //   ],
  // },
  // { path: '*', redirect: '/orderEntry', hidden: true },
];

export default [
  ...appRouter,
  login,
];
