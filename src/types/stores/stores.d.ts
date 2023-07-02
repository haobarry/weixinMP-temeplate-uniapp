/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

interface Auth {
  token: string;
  phoneNumber: string;
  apiUrl: string;
  staticUrl: string;
  apiUrl_dev: string;
  staticUrl_dev: string;
  apiUrl_test: string;
  staticUrl_test: string;
  customerServiceUrl: string;
  corpId: string;
  phoneInfo: UniApp.GetSystemInfoResult | null;
}

interface Shopping {
  buyShopp: SkuItem[];
  buyGoods: SkuItem[];
  total: number;
  failedSku: SkuItem[];
  stock: number,
  toast: boolean,
  detailsToast: boolean,
  delShow: boolean
}

interface ScanningCode {
  list: { [key: string]: API.CommoditySo };
  orderId: string;
  accessKey: string;
  qr: string;
  tmp: { [key: string]: API.CommoditySo }
}

