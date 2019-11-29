export function scrollTop(el: HTMLElement | Window, from: number = 0, to: number, duration: number = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }

  const difference = Math.abs(from - to);
  const steps = Math.ceil(difference / duration * 50);

  function scroll(start: number, end: number, step: number, endCallback?: any) {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      (el as HTMLElement).scrollTop = d;
    }

    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, steps);
}

export function offsetTop(container: HTMLElement | Element | any, selected: HTMLElement | Element | any) {
  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  const top = selected.offsetTop + offsetParents.reduce((prev, curr) => (prev + curr.offsetTop), 0);
  return top - 100;
}

export function assert(condition: any, msg: string) {
  if (!condition) throw new Error(`[APP] ${msg}`);
}
