import { scrollTop, offsetTop } from '@/utils/tools';

export function scrollToFirstError(form: any, fileds: any) {
  const formFields = form.fields;

  // 获取所有未通过验证的字段在form中的索引，去掉 -1（不存在）的字段索引
  const indexs = Object.keys(fileds).map((field) => formFields.findIndex((item: any) => item.prop === field))
    .filter((item: any) => item !== -1);

  if (indexs.length) {
    // 获取最小索引的字段所对应的 el
    const ele = formFields[Math.min(...indexs)].$el;
    // 获取元素的目标位置
    let from = 0;
    // 获取滚动元素
    const scrollEle = document.querySelector('.app-main-wrapper') as HTMLElement;
    // 获取滚动的原始位置
    if (scrollEle) {
      from = scrollEle.scrollTop;
    }
    const to = ele.offsetTop || offsetTop(scrollEle, ele);

    // 将此 DOM 滚动到顶部
    scrollTop(scrollEle || window, from, to, 500);
  }
}
