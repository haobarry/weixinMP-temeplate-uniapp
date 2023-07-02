/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

//现场订单状态
export enum SpotOrderStatus {
  created = '已创建',
  unpaid = '待支付',
  scanned = '已扫码',
  completed = '已完成',
  cancelled = '已取消',
}

//角色
export enum Roles {
  super_admin = '负责人',
  admin = '管理员',
  accountant = '财务',
  salesman = '业务员',
  buyer = '采购',
}

//采购订单状态
export enum ProcurementOrderStatus {
  created = '已创建',
  paid = '待收货',
  completed = '已完成',
  cancelled = '已取消',
}


//请求返回错误状态码内容
export enum ResCodeMap {
  // 200: '成功返回请求的数据。',
  // 201: '新建或修改数据成功。',
  // 202: '一个请求已经进入后台排队（异步任务）。',
  // 204: '删除数据成功。',

  '错误400' = 400,
  '401权限错误' = 401,
  '用户访问是被禁止的。' = 403,
  '错误404' = 404,
  '请求的格式不可得。' = 406,
  '请求的资源被永久删除' = 410,
  '发生一个验证错误。' = 422,
  '500服务器发生错误' = 500,
  '502接口错误。' = 502,
  '503服务不可用。',
  '504超时',

}
