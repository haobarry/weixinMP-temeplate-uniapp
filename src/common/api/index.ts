import request from "@/common/request";

/**
 *用户登录验证
 * @param params
 * @returns
 */
export const doAuth = (params: { code: string }): Promise<Result<{ active_key?: string }>> =>
  request({
    url: `an/jwt`,
    method: "POST",
    verify: false,
    params,
  });
//用户注册包含手机号用户名
export const createUserInfo = (params: ApiParams.UserRegister): Promise<Result<UserInfo>> =>
  request({
    url: `an/user`,
    method: "POST",
    verify: false,
    params: params,
  });
//查询手机号码是否在管中平台可用 (更换手机号码用）
export const getIsPhoneNumberUsed = (params: { phone_number: string }): Promise<Result<boolean>> =>
  request({
    url: `an/user-exists`,
    verify: true,
    params: params,
  });
//用户更换手机号发送手机验证码
export const sendSmsNotify = (params: { phone_number: string }): Promise<Result> =>
  request({
    url: `sms-notify`,
    method: "POST",
    verify: false,
    params: params,
  });
//用户更换手机号验证短信验证码
export const authSmsNotify = (phone: string, params: { code: string }): Promise<Result> =>
  request({
    url: `codes/${phone}/verified`,
    method: "POST",
    verify: false,
    params: params,
  });
//获取使用者基础信息
export const getUserDetail = (id: string): Promise<Result<UserInfo>> =>
  request({
    url: `an/user/${id}`,
    method: "GET",
    verify: true,
  });
