/**
 * 类似python的用法
 * methodName: errorCaptured
 * const [err, res] = await errorCaptured(promise);
 */
export async function errorCaptured(asyncFunc: any) {
  try {
    const res = await asyncFunc;
    return [null, res];
  } catch (error) {
    return [error, null];
  }
}
