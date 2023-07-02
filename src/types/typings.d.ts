/*
 * Copyright (c) 2022. Shanxi Kuaiqu Weinong Network Technology Co.; Ltd. All Rights Reserved.
 * Unauthorized copying of this file; via any medium is strictly prohibited.
 * Proprietary and confidential.
 */


type Result<T = unknown> = {
  errno: number;
  msg: string;
  jwt?: string;
  data: T;
  waterfall?: Waterfall;
}

type Waterfall = {
  pullable: boolean;
  current?: number;
};

type UserInfo = {
  id: string;
  username: string;
  phone_number: string;
  avatar: string;
  created_at: string;
  id_number: string;
  invitation_code: string;
  location_id: string;
  nickname: string;
  point_balance: string;
  rmb_balance: string;
  updated_at: string;
}

type AgentNodesListResult = {
  id: string;
  address: string;
  company: string;
  created_at: string;
  created_by: string;
  income_ratio: string;
  legal_person: string;
  location: string;
  location_id: number;
  latitude: string;
  longitude: string;
  member: Member;
  members: Member[];
  name: string;
  point_balance: string;
  service_location: {
    id: number;
    name: string;
  }
  service_location_id: number
  status: string;
  updated_at: string;
}

type AgentNodesDetail = {
  address: string;
  company: string;
  created_at: string;
  created_by: string;
  id: string;
  income_ratio: string;
  latitude: string;
  legal_person: string;
  location: string;
  location_id: number;
  longitude: string;
  name: string;
  point_balance: string;
  service_location: string;
  service_location_id: number;
  status: "activated";
  updated_at: string;
  creator: {
    created_at: string;
    created_by: number;
    id: string;
    id_number: null;
    phone_number: string;
    remark: string;
    roles: string;
    status: "activated";
    super_admin: boolean;
    updated_at: string;
    username: string;
  };
  bank_accountes: BankAccounte[];
  receiver_addresses: ReceiverAddress[];
  members: Member[];
  member: Member;
}

type BankAccounte = {
  agent_node_id: string;
  bank_name: string;
  card_number: string;
  created_at: string;
  created_by: string;
  default: boolean;
  id: string;
  name: string;
  updated_at: string;
}

type ReceiverAddress = {
  address: string;
  agent_node_id: string;
  province: string;
  city: string;
  county: string;
  created_at: string;
  created_by: string;
  default: boolean;
  id: string;
  name: string;
  phone_number: string;
  updated_at: string;
}

type Member = {
  avatar: string;
  created_at: string;
  created_by: number;
  id: string;
  id_number: string;
  invitation_code: string;
  last_login_at: null | string;
  location_id: number;
  nickname: string;
  phone_number: string;
  point_balance: string;
  rmb_balance: string;
  roles: Role[];
  updated_at: string;
  user_id: string;
  username: string;
}

type Role = 'super_admin' | 'admin' | 'accountant' | 'salesman' | 'buyer';

type SpotOrderState = 'created' | 'unpaid' | 'completed' | 'cancelled';

type SpotSkus = {
  id: string;
  name: string;
  min_sale_unit?: string;
  sequence?: string;
  entry_image: string;
  upc?: number;
  psc?: number;
  spu_categories?: {
    1: string;
    2: string;
    3: string;
  };
  min_purchase_unit: string;
  measurement_unit: string;
  purchase_price_id?: string;
  purchase_price: string;
  selling_price_id?: string;
  selling_price?: string;
  sku_location_id?: string;
  count: number;//购物车数量
  checked?: boolean;//选中
}

type SpotOrdersListItem = {
  id: string;
  dot_id: string;
  created_by: string;
  agent_node_id: string;
  original_amount: string;
  cny_amount: string;
  status: SpotOrderState;
  cny_ratio: string;
  created_at: string;
  updated_at: string;
  point_amount: string;
  salesman_id: string;
  on_spot: boolean;
  actual_amount: string;
  number_label: number;
  payer_id: string;
  period_id: null;
  share_info: null;
  sum_quantity: number;
  items: {
    sku_id: string;
    id: string;
    order_id: string;
    quantity: string;
    original_amount: string;
    entry_image: string;
    actual_amount: string;
    actual_quantity: string;
    price_id: string;
    sku_supplier_id: string;
    sorted: boolean;
    stock_order_item_id: string;
    purchase_price: string;//单价
    min_purchase_unit: string;//最小进货量
    measurement_unit: string;//单位
  }[];
}

type SpotOrderDetail = {
  id: string;
  dot_id: string;
  created_by: string;
  agent_node_id: string;
  actual_amount: string;
  cny_amount: string;
  original_amount: string;
  point_amount: string;
  status: string;
  cny_ratio: string;
  created_at: string;
  updated_at: string;
  skus: SpotOrderSKU[];
  salesman_id: string;
  salesman: string;
  dot_name: string;
  on_spot: boolean;
}

type SpotOrderSKU = {
  actual_amount: string;
  entry_image: string;
  id: string;
  measurement_unit: string;
  name: string;
  purchase_price: string;
  quantity: string;
}

type CreateSpotOrdersResult = {
  "id": string;
  "dot_id": string;
  "created_by": string;
  "agent_node_id": string;
  "original_amount": string;
  "cny_amount": string;
  "status": SpotOrderState;
  "cny_ratio": string;
  "created_at": string;
  "updated_at": string;
  "point_amount": string;
  "skus": SpotOrderSKU[];
  "salesman_id": string;
  "on_spot": boolean;
}


type ProcurementOrdersSku = {
  id: string;
  name: string;
  min_sale_unit: string;
  sequence: string;
  entry_image: string;
  upc: number;
  psc: number;
  spu_categories: {
    1: string;
    2: string;
    3: string;
  };
  market_price: string;
  measurement_unit: string;
  agent_node_price: string;
  agent_node_price_id: string;
  min_shop_unit: string;
  count: number;//购物车数量
  checked?: boolean;//选中
}


type ProcurementOrder = {
  actual_amount: string;
  agentNode: {
    id: string;
    name: string;
  };
  cny_amount: string;
  created_at: number;
  creator: {
    id: string;
    username: string;
    phone_number: string;
  };
  id: string;
  point_amount: string;
  status: 'created' | 'paid' | 'completed' | 'cancelled';
  updated_at: number;
  items: ProcurementOrderSku[];
}


type ProcurementOrderSku = {
  actual_amount: string;
  agent_node_price: string;
  entry_image: string;
  id: string;
  measurement_unit: string;
  name: string;
  quantity: string;
  upc: string;
}


type PayImmediately = {
  orderId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
  appId: string;
}

type AccountDetail = {
  agent_node_id: string;
  bank_name: string;
  card_number: string;
  created_at: string;
  created_by: string;
  default: boolean;
  id: string;
  name: string;
  updated_at: string;
}

type PointHistoryItem = {
  id: string;
  agent_node_id: string;
  order_id: string;
  order_type: string;
  bill_id: string;
  currency: string;
  change_amount: string;
  after_amount: string;
  type: 'dot_paid_order' | 'pay_point';
  created_at: string;
  updated_at: string;
  spot: string;
}