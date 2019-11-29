import moment from 'moment';

export const convertStartTime = (time: Date) => {
  if (!time) return;
  return moment(time).startOf('day').valueOf();
};

export const convertEndTime = (time: Date) => {
  if (!time) return;
  return moment(time).endOf('day').valueOf();
};

export function countDown(beforeFn: any, AfterFn: any, fn: any, defaultTime?: number): void {
  let time = 60 || defaultTime;
  _sendCode();
  fn && fn();
  function _sendCode() {
    if (time === 0) {
      time = 60;
      beforeFn && beforeFn();
      return;
    } else {
      AfterFn && AfterFn(time);
      time--;
    }
    setTimeout(function() {
      _sendCode();
    }, 1000);
  }
}
