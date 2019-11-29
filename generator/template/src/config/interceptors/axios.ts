/**
 * 定义 axios request， response的拦截器
 */
import { AxiosError } from 'axios';
import { Message } from 'element-ui';
import { getToken, TOKEN_KEY } from '@/utils';
import store from '@/plugins/store';
import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE, __DEV__ } from '../base';
import { httpCode } from '../axios';
import { blobToJSON } from '@/utils/download';

enum responseCode {
  SUCCESS = 0,
  ERROR = 1,
  LOGOUT = -1,
}

const RESPONSE_STRATEGY: any = {
  // 业务成功，直接进入成功回调
  [responseCode.SUCCESS]: (res: any, response?: any) => res.data,
  // 请求失败
  [responseCode.ERROR]: (res: any, response?: any) => handleErrorMessage(res),
  // token 失效，需要重新登录
  [responseCode.LOGOUT]: (res: any, response?: any) => {
    store.dispatch('removeToken').then(() => {
      location.reload();
    });
    return;
  },
  default: (res: any, response?: any) => handleErrorMessage(res, response),
};

export function requestSuccessFn(config: any) {
  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  // 设置 Token 信息， 从 sessionStorage 中获取，（页面关闭 session 丢失， 用户需要再次登录， token失效没有意义，？？？？）
  config.headers[TOKEN_KEY] = getToken();

  if (!config.params) config.params = {};
  config.params.client = 'web';
  // config.params.client = 'web';

  if (__DEV__ && CONSOLE_REQUEST_ENABLE) {
    console.groupCollapsed(`请求拦截函数: ${config.url}`);
    console.info(`url: ${config.url}`);
    console.info('config: ', config);
    console.groupEnd();
  }

  return config;
}

export function requestFailFn(error: AxiosError) {
  // 自定义发送请求失败逻辑， 断网，请求发送监控等

  return Promise.reject(error);
}

export function responseSuccessFn(response: any) {
  // 自定义响应成功逻辑，全局拦截接口。根据不同业务做不同处理， 响应成功监控等
  /**
   * 假设请求体为：
   * {
   *  code: 0,
   *  message: '',
   *  data: null
   * }
   */
  if (__DEV__ && CONSOLE_RESPONSE_ENABLE) {
    console.groupCollapsed(`响应拦截函数: ${response.config.url}`);
    console.info(`url: ${response.config.url}`);
    console.info('data', response.data);
    console.info('response: ', response);
    console.groupEnd();
  }

  return handleResponse(response);
}

export async function handleResponse(response: any) {
  let resData = response.data;

  // 特殊情况下载文件没有按照约束的结构
  // 以及下载文件是登录失效的问题
  if (resData instanceof Blob) {
    if (resData.type !== 'application/json') {
      return resData;
    }

    resData = await blobToJSON(resData);
  }

  const code = +resData.code;

  // 如果业务失败，根据不同 code 做不同处理
  // 比如最常见的授权过期跳转登录
  // 特定弹窗
  // 跳转特定页面等
  // location.href = '';
  const strategy = RESPONSE_STRATEGY[code] || RESPONSE_STRATEGY.default;

  return strategy(resData, response);
}

function errorHandler(error: any) {
  if (!error) {
    return '未知错误';
  } else if (error.message) {
    // 后端直接返回的错误
    return error.message;
  } else if (error.status) {
    // 根据不同的状态码，返回不同的错误信息
    return httpCode[error.status];
  } else if (!error.response) {
    return '服务端连接失败';
  } else if (error.response.status) {
    // 根据不同的状态码，返回不同的错误信息
    return error.response.status;
  }

  return '未知错误';
}

function handleErrorMessage(error: any, response?: any) {
  const message = errorHandler(error);
  Message({
    type: 'error',
    message,
    showClose: true,
    duration: 3000,
  });

  // 业务中还会有一些特殊 code 逻辑， 可以在这里做统一处理，也可以下发到业务层
  if (response && !response.config.noShowDefaultError) {
    window.GLOBAL.vbus.$emit('global.error.show', message);
  }

  return Promise.reject(error);
}

export function responseFailFn(error: AxiosError) {
  // 响应失败， 可根据 error.message 和 error.response.status 来做监控处理
  const message = errorHandler(error);

  Message({
    type: 'error',
    message,
    showClose: true,
    duration: 3000,
  });

  return Promise.reject(error);
}
