/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */
/**
 *
 * @param {number} num
 * @param {number} separation  3是千分位，4是万分位  默认4
 * @returns {string}
 */
export function handlesSeparationNum(num: number | string, separation: number = 4) {
  if (typeof num === 'string') num = +num
  if (separation === 4) return String(num).replace(/\B(?=(\d{4})+(?!\d))/g, ',');
  if (separation === 3) return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
