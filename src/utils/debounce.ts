/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

/**
 * @desc 函数防抖
 * @param func 目标函数
 * @param wait 延迟执行毫秒数 默认800
 * @param immediate true - 立即执行， false - 延迟执行
 */

let stimer: any = null

export function debounce(fn: any, delay = 600, immediate = true) {
  if (immediate){
    let callNow = !stimer;
    stimer = setTimeout(() => {
      stimer = null;
    }, delay);
    if (callNow) fn();
  } else {
    if (stimer != null){
      clearTimeout(stimer)
      stimer = null
    }
    stimer = setTimeout(fn, delay)
  }
}


/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 使用表时间戳，在时间段开始的时候触发 2 使用表定时器，在时间段结束的时候触发
 */
export const throttle = (func: () => any, wait = 1000, type = 1) => {
  let previous = 0;
  return () => {
    if (type === 1){
      let now = Date.now();
      if (now - previous > wait){
        func();
        previous = now;
      }
    } else if (type === 2){
      if (!stimer){
        stimer = setTimeout(() => {
          stimer = null;
          func()
        }, wait)
      }
    }
  }
}
