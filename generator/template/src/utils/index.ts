export const TOKEN_KEY = 'webToken';

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  return token || '';
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function setUser(user: any) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): any {
  const user = sessionStorage.getItem('user') || 'null';
  return JSON.parse(user);
}

/**
 * 设置 localStorage 过期时间
 * days 天数, 默认是 7 天
 */
export function setLocalStorage(key: any, value: any, days: number = 7) {
  const exp = new Date();
  const one = 24 * 60 * 60 * 1000;
  const data = JSON.stringify({
    value,
    expires: exp.getTime() + days * one,
  });

  localStorage.setItem(key, data);
}

export function removeLocalStorage(key: any) {
  localStorage.removeItem(key);
}

export function getLocalStorage(key: any) {
  try {
    const data = localStorage.getItem(key) || 'null';
    const o = JSON.parse(data);

    if (!o || o.expires < Date.now()) {
      removeLocalStorage(key);
      return null;
    } else {
      return o.value;
    }
  } catch (error) {
    // 兼容性
    console.warn(error);
    return localStorage[key];
  }
}
