/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { defineStore } from "pinia";
import wxLog from "@/utils/wxLog";
import { doAuth, getAgentNodesList } from "@/common/api";
import useUserStore from "./users";
import useAgentNodeStore from "./agentNode";
import { base64Decode } from "@/utils/EnCodeBase64";

const userStore = useUserStore();
const agentNodeStore = useAgentNodeStore();

export default defineStore("auth-store", {
  state: () => {
    return {
      token: "",
      apiUrl: "https://api.blocgo.com/",
      staticUrl: "https://static.blocgo.com/",
      apiUrl_dev: "https://api.backend.lan-dev.k8s.blocgo.tech/",
      staticUrl_dev: "https://static.backend.lan-dev.k8s.blocgo.tech/",
      apiUrl_test: "https://api.backend.lan-test.k8s.blocgo.tech/",
      staticUrl_test: "https://static.backend.lan-test.k8s.blocgo.tech/",
    };
  },
  getters: {
    getToken(state) {
      return state.token;
    },
  },
  actions: {
    //判断是否授权定位 再跳转
    setLocationAuth() {
      //获取定位权限 无定位权限无法使用
      uni.getSetting({
        success: ({ authSetting }) => {
          if (typeof authSetting["scope.userLocation"] === "undefined") {
            console.log(">>>没有授权过定位");
            uni.authorize({
              scope: "scope.userLocation",
              success: () => {
                //  授权成功
                this.isAgentUser();
              },
              fail: (err) => {
                // 授权失败  errMsg: "authorize:fail auth deny"
                uni.showToast({
                  title: "获取定位权限失败,无法使用小程序",
                  icon: "none",
                  duration: 2000,
                  complete: () => {
                    setTimeout(() => {
                      uni.reLaunch({
                        url: "/pages/my/no-authorized/index",
                      });
                    }, 2000);
                  },
                });
              },
            });
          } else if (!authSetting["scope.userLocation"]) {
            console.log(">>>授权过但是拒绝");
            uni.showModal({
              title: "",
              content: "您未开启地理位置授权,请授权后使用",
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting();
                } else {
                  uni.showToast({
                    title: "获取定位权限失败,无法使用小程序",
                    icon: "none",
                    duration: 2000,
                    complete: () => {
                      setTimeout(() => {
                        uni.reLaunch({
                          url: "/pages/my/no-authorized/index",
                        });
                      }, 2000);
                    },
                  });
                }
              },
            });
          } else {
            //  授权了 执行跳转
            this.isAgentUser();
          }
        },
      });
    },
    //判断是否属于管中用户 执行跳转
    isAgentUser() {
      if (agentNodeStore.getAgentId.length) {
        uni.switchTab({ url: "/pages/my/index" });
      } else {
        getAgentNodesList({ user_id: userStore.id })
          .then(({ data }) => {
            if (data.length) {
              ({
                id: agentNodeStore.agentId,
                name: agentNodeStore.agentName,
                point_balance: agentNodeStore.agentPointBalance,
                member: agentNodeStore.currentUserInfo,
              } = { ...data[0] });
              uni.switchTab({ url: "/pages/my/index" });
            } else {
              uni.redirectTo({ url: "/pages/my/no-authorized/index" });
            }
          })
          .catch((err) => {
            //一般是token过期
            this.token = "";
            this.userLogin();
          });
      }
    },
    //登录验证逻辑
    userLogin() {
      //有token或id 直接获取管中
      if (this.token.length) {
        this.setLocationAuth();
        return;
      }
      //没有jwt 开始login
      uni.login({
        success: (res) => {
          doAuth({ code: res.code })
            .then((result) => {
              try {
                if (result.jwt) {
                  const [head, payload] = result.jwt.split(".");
                  //小程序废弃
                  // const arrbuf = wx.base64ToArrayBuffer(payload)
                  // const uint8Array = new Uint8Array(arrbuf);
                  // const decodedPayload = String.fromCharCode.apply(null, uint8Array as any);
                  // ({ id: userStore.id } = { ...JSON.parse(decodedPayload) as { id: string } })

                  const decodedPayload = base64Decode(payload);
                  const ids = decodedPayload.match(/(?<="id":")[^"]*(?=")/) as string[];
                  userStore.id = ids[0];
                  this.token = result.jwt;
                  this.setLocationAuth(); // 查看定位权限 然后进入
                }
              } catch (e) {
                uni.showToast({
                  title: "登录失败，请重新进入小程序",
                });
              }
            })
            .catch((err) => {
              console.log("🎈 doAuth >>>", err);
              //新用户 没有openid
              if (err.data.errno === 10001) {
                uni.showToast({
                  title: "请先注册信息",
                  duration: 1500,
                  complete: function () {
                    uni.redirectTo({ url: `/pages/user-auth/userRegister?active_key=${err.data.data.active_key}` });
                  },
                });
              } else {
                uni.showToast({
                  icon: "error",
                  title: "登录失败" + err.data.errno || err.errMsg || "错误",
                });
              }
            });
        },
        fail: (fail) => {
          wxLog.error(`doOAuth fail:${JSON.stringify(fail)}`);
          uni.showToast({
            title: "登录失败，请重新进入小程序",
            icon: "error",
          });
        },
      });
    },
    setApiUrlToDev() {
      this.apiUrl = this.apiUrl_dev;
      this.staticUrl = this.staticUrl_dev;
    },
    setApiUrlToTest() {
      this.apiUrl = this.apiUrl_test;
      this.staticUrl = this.staticUrl_test;
    },
  },
  persist: {
    enabled: true,
    strategies: [{ paths: ["token", "apiUrl", "staticUrl"] }],
  },
});
