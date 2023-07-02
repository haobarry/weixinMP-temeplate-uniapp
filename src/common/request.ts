/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

// 统一封装请求方法 请求拦截 和响应拦截

import { ResCodeMap } from '@/types/enums'
import authModules from '@/store/modules/auth';


// 请求拦截
const interceptor = (params: RequestParams) => {
  const authStore = authModules();
  //不显示加载loading
  if (typeof params.showLoad === 'undefined'){
    uni.showLoading({ title: "正在加载", mask: true })
  } else {
    params.showLoad && uni.showLoading({ title: "正在加载", mask: true })
  }

  let option = {} as HttpRequestOption;
  option.url = authStore.apiUrl + params.url;
  params.method && (option.method = params.method);
  option.data = params.params;

  //验证token
  if (params.verify){
    if (authStore.getToken.length){
      option.header = {
        Authorization: 'Bearer ' + authStore.getToken
      };
    } else {
      //小程序缓存中没有token 就提示跳转
      authStore.$reset()//重置authStore
      uni.showToast({
        title: '请登录',
        success() {
          uni.hideLoading();
          uni.redirectTo({ url: '/pages/user-auth/index' });
        }
      });
    }
  }


  return new Promise((resolve, reject) => {
    const requestTask =
      uni.request({
        ...option as UniApp.RequestOptions,
        success: function(res) {
          const { data, statusCode } = res
          //无需token 和返回正常
          if ([200, 201, 202, 204].includes(statusCode)){
            interceptorRes(res, resolve)
          } else {//需token 或 请求后服务器返回有错误的情况
            interceptorErr(res, reject)
          }
        },
        fail: function(err) {
          interceptorErr(err, reject)
        }
      });
  });
};


// 响应拦截成功的处理
const interceptorRes = (res: UniNamespace.RequestSuccessCallbackResult, resolve: any) => {
  const { data, statusCode } = res
  uni.hideLoading();
  resolve(data);
};

// 所有异常处理
const interceptorErr = (err: UniNamespace.GeneralCallbackResult | UniNamespace.RequestSuccessCallbackResult, reject: any) => {
  const authStore = authModules();
  uni.hideLoading();
  if ('statusCode' in err){//服务器返回的错误处理
    let { data, statusCode } = err as { data: any; statusCode: number }
    //token过期错误
    if (statusCode === 401 && data.errno === 40001){
      authStore.$reset()//重置authStore
      uni.showToast({
        title: '验证已过期，请重新登录',
        duration: 1500,
        complete() {
          uni.reLaunch({ url: '/pages/user-auth/index' })
        }
      });
    } else {
      if(statusCode === 401){
        console.log("不显示错误提示")
      }else {
        uni.showToast({
          title: `${ResCodeMap[statusCode]}`,
          duration: 1000,
          icon: 'none',
        })
      }
    }
  } else {//网络错误
    uni.showToast({
      title: err.errMsg
    });
  }
  reject(err);
};

//请求方法
export default function request(option: RequestParams): Promise<any> {
  return interceptor(option);
}
