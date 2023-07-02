/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

interface HttpRequestOption extends RequestParams {
  data?: string | Object | ArrayBuffer;     //数据
  header?: HttpHeaderType;                      //请求头
  responseType?: 'text' | 'arraybuffer';    //响应的数据类型
}

declare type RequestParams = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'PATCH';
  params?: object;
  verify: boolean;
  showLoad?: boolean;
}

declare type HttpHeaderType = {
  'content-type'?: 'application/json' | 'multipart/form-data';
  'Authorization'?: string;
}


//接口请求参数

declare namespace ApiParams {

  type UserRegister = {
    username: string;
    code: string;
    active_key: string;
    aes_iv: string;
    encrypted_data: string;
  }

  type SpotSkus = {
    //upc 或者 name
    text?: string;
    agent_node_id: string;
    page?: number;
  }

  type SpotOrdersList = {
    agent_node_id: string;
    status?: "created" | "unpaid" | "completed" | "cancelled";
    salesman_id?: string;
    page?: number;
    time?: string;
  }

  type SpotOrderAmount = {
    agent_node_id: string;
    start_time?: number;
    end_time?: number | string;
    salesman_id?: string;
  }

  type CreateSpotOrder = {
    lon: number;
    lat: number;
    agent_node_id: string;
    items: {
      sku_id: string;
      quantity: string;
    }[]
  }

  type CreateProcurementOrder = {
    agent_node_id: string;
    pay_point: '0' | '1';
    receiver_address_id: string;
    items: {
      sku_id: string;
      quantity: string;
    }[]
  }
}