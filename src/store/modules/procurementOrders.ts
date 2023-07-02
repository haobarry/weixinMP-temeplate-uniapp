/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { defineStore } from "pinia";
import bigJs from "big.js";
import { createProcurementOrders, payProcurementOrders } from "@/common/api";

export default defineStore("procurement-order-store", {
  state: () => {
    return {
      procureOrdersCart: [] as ProcurementOrdersSku[],
      procureCartTotalCount: 0,
      selectedSkusTotalPrice: 0,
    };
  },
  getters: {
    getProcureOrdersCart(state) {
      return state.procureOrdersCart;
    },
    getProcureOrdersTotalCount(state) {
      state.procureCartTotalCount = state.procureOrdersCart.reduce((total, i) => total + i.count, 0);
      return state.procureCartTotalCount;
    },
    getSelectedSkusTotalPrice(state) {
      //获取所选择的sku总价
      let y = new bigJs(0.0);
      state.procureOrdersCart.forEach((i) => {
        if (i.checked) {
          y = y.plus(bigJs(i.min_shop_unit).times(i.agent_node_price).times(i.count).round(2));
        }
      });
      return y.toNumber();
    },
    getIsSkuAllChecked(state) {
      //判断是否全部选中
      return state.procureOrdersCart.every((i) => i.checked === true);
    },
  },
  actions: {
    //sku 抢操作
    addToCart(sku: ProcurementOrdersSku, callback?: (isMax: boolean) => void) {
      if (this.procureOrdersCart.some((item) => item.id === sku.id)) {
        this.cartPlus(sku.id, (isMax) => {
          if (isMax) {
            callback && callback(true);
            return;
          }
        });
      } else {
        if (!sku.hasOwnProperty("checked")) sku.checked = true;
        sku.count++;
        this.procureOrdersCart.push(sku);
      }
      callback && callback(false);
    },
    //购物车内 加操作
    cartPlus(skuId: string, callback?: (isMax: boolean) => void) {
      let _index = this.procureOrdersCart.findIndex((item) => item.id === skuId);
      if (this.procureOrdersCart[_index].count >= 9999) {
        //大于9999 执行回调函数false
        callback && callback(true);
        return;
      }
      this.procureOrdersCart[_index].count++;
    },
    //购物车内 减操作
    cartMinus(skuId: string) {
      let _index = this.procureOrdersCart.findIndex((item) => item.id === skuId);
      if (this.procureOrdersCart[_index].count === 1) {
        return true;
      } else {
        this.procureOrdersCart[_index].count--;
      }
    },
    //购物车内删除sku
    deleteSku(skuId: string, ckFun: () => void) {
      let _index = this.procureOrdersCart.findIndex((item) => item.id === skuId);
      this.procureOrdersCart.splice(_index, 1);
      ckFun();
    },
    //sku数字框直接输入数字的操作
    cartSkuCountInputChange(skuId: string, count: number) {
      let _index = this.procureOrdersCart.findIndex((item) => item.id === skuId);
      if (+count > 9999) {
        this.procureOrdersCart[_index].count = 9999;
      } else this.procureOrdersCart[_index].count = count;
    },
    //勾选sku
    handelCheckSku(sku: ProcurementOrdersSku) {
      let _index = this.procureOrdersCart.findIndex((item) => item.id === sku.id);
      this.procureOrdersCart[_index].checked = !this.procureOrdersCart[_index].checked;
    },
    //购物车内全选操作
    handelAllCheckSku(checked: boolean) {
      this.procureOrdersCart.forEach((i) => (i.checked = checked));
    },
    //查询sku在购物车中的数量,并同步数量
    syncSkuInCartCount(skus: ProcurementOrdersSku[]) {
      try {
        for (let sku of skus) {
          let index = this.procureOrdersCart.findIndex((s) => s.id === sku.id);
          if (index !== -1) {
            sku.count = this.procureOrdersCart[index].count;
          } else {
            sku.count = 0;
            delete sku.checked;
          }
        }
        return skus;
      } catch (e) {
        console.error(e);
      }
    },
    //(勾选商品)到订单确认页面
    toConfirmOrderPage() {
      try {
        //使用eventChannel 传送数据
        uni.navigateTo({
          url: `/pages/procurement-orders/confirmOrders`,
          animationType: "none",
          // events: {},
          // success: (res) => {
          //   res.eventChannel.emit('sendSkus', checkedSkus)
          // }
        });
      } catch (e) {
        console.error(e);
      }
    },
    //创建订单并支付
    handelCreateProcurementOrder(agentId: string, addressId: string, usePoint = false) {
      try {
        //创建提交订单参数
        let params: ApiParams.CreateProcurementOrder = {
          agent_node_id: agentId,
          items: [],
          pay_point: usePoint ? "1" : "0",
          receiver_address_id: addressId,
        };
        this.procureOrdersCart
          .filter((i) => i.checked)
          .forEach((p) => {
            params.items.push({
              sku_id: p.id,
              quantity: bigJs(p.count).times(p.min_shop_unit).toString(),
            });
          });
        createProcurementOrders(params)
          .then(({ data }) => {
            if (data && data.appId) {
              console.log("采购订单 创建成功>>>", data);
              // 吊起支付
              uni.requestPayment({
                provider: "wxpay",
                orderInfo: data.orderId,
                timeStamp: data.timeStamp,
                nonceStr: data.nonceStr,
                package: data.package,
                signType: data.signType,
                paySign: data.paySign,
                success: () => {
                  uni.showToast({
                    title: "支付成功",
                  });
                },
                fail: (err) => {
                  //requestPayment:fail cancel\
                  uni.showToast({
                    title: "取消了支付",
                  });
                },
                complete: () => {
                  //清除已选择的sku
                  this.procureOrdersCart = this.procureOrdersCart.filter((i) => !i.checked);
                  uni.navigateTo({
                    url: `/pages/procurement-orders/procurementOrderDetail?orderId=${data.orderId}&createPage=${true}`,
                    animationType: "none",
                  });
                },
              });
            }
          })
          .catch((err) => {
            uni.showToast({
              icon: "error",
              title: "订单创建出现失败",
            });
          });
      } catch (e) {
        console.error(e);
      }
    },
    //  已创建的采购订单支付
    rePayProcurementOrders(orderId: string, ckFun: () => void) {
      payProcurementOrders(orderId).then(({ data }) => {
        if (data) {
          uni.requestPayment({
            provider: "wxpay",
            orderInfo: data.orderId,
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: () => {
              ckFun && ckFun();
            },
            fail: (err) => {
              //requestPayment:fail cancel\
              uni.showToast({
                title: "取消了支付",
              });
            },
          });
        }
      });
    },
  },
});
