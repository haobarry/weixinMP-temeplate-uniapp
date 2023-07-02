/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { defineStore } from 'pinia';

export default defineStore('device-store', {
  state: () => {
    return {
      windowHeight: 0,
      windowWidth: 0,
      deviceBrand: '',
      deviceModel: '',
    };
  },
  getters: {
    getHeight(state) {
      return state.windowHeight
    },
    getWidth(state) {
      return state.windowWidth
    },
  },
  actions: {
    savaInfo() {
      uni.getSystemInfo({
        success: ({ windowHeight, windowWidth, deviceBrand, deviceModel }) => {
          this.windowHeight = windowHeight;
          this.windowWidth = windowWidth;
          this.deviceBrand = deviceBrand ?? '';
          this.deviceModel = deviceModel ?? '';
        }
      })
    }
  }

});
