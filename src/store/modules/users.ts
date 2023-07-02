/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { defineStore } from 'pinia';

export default defineStore('users-store', {
  state: () => {
    return {
      id: '',
      name: '',
      phoneNumber: '',
      homeTab: {
        iconPath: "/static/tab-bar/home.png",
        selectedIconPath: "/static/tab-bar/home-act.png",
        text: '首页',
        pagePath: "pages/home/index",
      },
      procurementTab: {
        iconPath: "/static/tab-bar/shoppingcart.png",
        selectedIconPath: "/static/tab-bar/shoppingcart-act.png",
        text: '采购',
        pagePath: "pages/procurement-orders/index",
      },
      financeTab: {
        iconPath: "/static/tab-bar/finance.png",
        selectedIconPath: "/static/tab-bar/finance-act.png",
        text: "财务",
        pagePath: "pages/finance/index",
      },
      myTab: {
        iconPath: "/static/tab-bar/my.png",
        selectedIconPath: "/static/tab-bar/my-act.png",
        text: '我的',
        pagePath: "pages/my/index",
      },
      tabBar: [] as any,
    };
  },
  getters: {
    getUserId(state) {
      return state.id
    },
    getUserName(state) {
      return state.name
    },
    getUserPhoneNumber(state) {
      return state.phoneNumber
    },
    getTabBar(state) {
      return state.tabBar
    }
  },
  actions: {
    setTabBarItems(roles: Role[]) {
      console.log('🎈 roles>>>', roles)
      this.tabBar = [];
      if (roles.includes('admin') || roles.includes('super_admin')){
        this.tabBar = [this.homeTab, this.procurementTab, this.myTab];
      } else {
        if (roles.includes('buyer')) this.tabBar.unshift(this.procurementTab);
        if (roles.includes('salesman')) this.tabBar.unshift(this.homeTab);
        this.tabBar.push(this.myTab);
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      paths: ['id', 'name', 'phoneNumber']
    }],
  }
});
