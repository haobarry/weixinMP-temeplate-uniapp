<template>
  <view class="top-container zb-flex-row zb-ali-center">
    <view @click="navTo('/pages/my/no-authorized/myInfo')">
      <text>{{ usersStore.getUserName }}</text>
    </view>
    <view class="zb-flex-row zb-ali-center">
      <uni-icons type="right" class="icon" />
      <BarcodeCanvas :width="464" :height="106" :code-number="usersStore.getUserId" />
    </view>
  </view>
  <view class="container">
    <view class="manage-center">
      <view class="manage-center-up zb-flex-row">
        <view>
          <view class="region" @click="navTo('/pages/my/agent-center/agentCenterDetail')">
            <view>{{ agentNodeStore.getAgentName }}</view>
            <uni-icons type="right" color="#FFFFFF"></uni-icons>
          </view>
          <view class="role-label" v-for="(role, index) in agentNodeStore.getCurrentUserInfo?.roles" :key="index"> {{
            Roles[role] }}
          </view>
        </view>
        <view>
          <view class="switch" @click="navTo('/pages/my/agent-center/agentCenterList')">⇌ 切换</view>
        </view>
      </view>
      <!--        内容区-->
      <view class="manage-center-down">
        <view v-if="isRoleShow('admin', 'super_admin')" class="content" @click="navTo('/pages/my/member/memberList')">
          <view class="content-name content-center">
            <view>成员</view>
            <uni-icons type="right" color="#A5A5A6"></uni-icons>
          </view>
          <view class="content-number">
            {{ agentNodeStore.getMembersLength > 1 ? agentNodeStore.getMembersLength + `个` : '待添加' }}
          </view>
        </view>
        <view v-if="isRoleShow('buyer', 'admin', 'super_admin')" class="content"
          @click="navTo('/pages/my/address/addressList')">
          <view class="content-name content-center">
            <view>收货地址</view>
            <uni-icons type="right" color="#A5A5A6"></uni-icons>
          </view>
          <view class="content-number">
            {{
              agentNodeStore.getReceiverAddresses.length === 0 ? `待添加` : agentNodeStore.getReceiverAddresses.length + `个`
            }}
          </view>
        </view>
        <view v-if="isRoleShow('accountant', 'admin', 'super_admin')" class="content"
          @click="navTo('/pages/my/account/accountList')">
          <view class="content-name content-center">
            <view>收款账户</view>
            <uni-icons type="right" color="#A5A5A6"></uni-icons>
          </view>
          <view class="content-number">
            {{ agentNodeStore.getBankAccountesLength === 0 ? `待添加` : agentNodeStore.getBankAccountesLength + `个` }}
          </view>
        </view>
      </view>

    </view>
    <!--    积分-->
    <view v-if="isRoleShow('accountant', 'admin', 'super_admin')" class="content-list-item"
      @click="navTo('/pages/my/pointsDetail')">
      <view class="content-left">
        <view class="content-name">积分详情</view>
        <text class="content-number">积分余额：{{ +agentNodeStore.getPoint }}</text>
      </view>
      <uni-icons type="right" color="#A5A5A6" />
    </view>
    <!--    现场订单-->
    <view v-if="isRoleShow('accountant', 'salesman', 'admin', 'super_admin')" class="content-list-item"
      @click="navTo('/pages/spot-orders/spotOrdersList')">
      <view class="content-left">
        <view class="content-name">创惠喵现场订单</view>
        <view class="content-number">本月成交金额：￥{{ thisMonth }}</view>
        <view class="content-number">上月成交金额：￥{{ lastMonth }}</view>
      </view>
      <uni-icons type="right" color="#A5A5A6" />
    </view>
    <!--    采购记录-->
    <view v-if="isRoleShow('accountant', 'buyer', 'admin', 'super_admin')" class="content-list-item"
      @click="navTo('/pages/procurement-orders/procurementOrdersList')">
      <view class="content-name content-left">采购记录</view>
      <uni-icons type="right" color="#A5A5A6" />
    </view>
  </view>
  <TabBar></TabBar>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onPullDownRefresh, onReady, onUnload } from '@dcloudio/uni-app'
import { useStores } from "@/store";
import BarcodeCanvas from "@/components/BarcodeCanvas.vue";
import { getSpotOrderAmount } from "@/services/api";
import { Roles } from '@/types/enums'
import TabBar from "@/components/TabBar.vue";


const { usersStore, agentNodeStore, authStore } = useStores()

const lastMonth = ref(0)
const thisMonth = ref(0)

//返回内容区显示与否
const isRoleShow = computed(() => (...role: Role[]) => {
  if (agentNodeStore.getCurrentUserInfo.roles) {
    return agentNodeStore.getCurrentUserInfo.roles.some(r => role.includes(r))
  }
})


//跳转页面
const navTo = (url: any) => {
  uni.navigateTo({ url: url })
}
//获取现场订单的金额
const getSpotAmount = () => {
  let now = new Date();
  let nowYear = now.getFullYear(); //当前年
  let nowMonth = now.getMonth();//当前月
  const thisMonthTime = new Date(nowYear, nowMonth, 1).getTime() / 1000
  const lastMonthTime = new Date(nowYear, nowMonth - 1, 1).getTime() / 1000

  getSpotOrderAmount({
    salesman_id: agentNodeStore.getCurrentUserIsAdminReturnUserId,
    agent_node_id: agentNodeStore.getAgentId,
    start_time: thisMonthTime,
    end_time: (Date.now() / 1000).toFixed(),
  }).then(({ data }) => {
    thisMonth.value = data.orignal_amount_num
  })

  getSpotOrderAmount({
    salesman_id: agentNodeStore.getCurrentUserIsAdminReturnUserId,
    agent_node_id: agentNodeStore.getAgentId,
    start_time: lastMonthTime,
    end_time: thisMonthTime,
  }).then(({ data }) => {
    lastMonth.value = data.orignal_amount_num
  })
}


onReady(async () => {
  await agentNodeStore.handelGetAgentDetail(() => {
    usersStore.name = agentNodeStore.getCurrentUserInfo.username
  })
  getSpotAmount()
});

//下拉刷新
onPullDownRefresh(() => {
  agentNodeStore.handelGetAgentDetail(() => {
    uni.stopPullDownRefresh()
  })
})

onLoad(() => {

  //接收是否更新管中详情的事件
  uni.$on('refresh-agent', () => {
    agentNodeStore.handelGetAgentDetail()
  })
})

onUnload(() => {
  uni.$off('refresh-agent')
})

</script>

<style scoped lang="scss">
.container {
  background: #F4F4F4;
  padding: 0 24rpx;
}

.top-container {
  margin: 24rpx;
  height: 106rpx;
  box-sizing: border-box;

  &>view:first-child {
    margin-right: auto;
  }

  .icon {
    padding: 0 13rpx;
    vertical-align: center;
  }

  & text {
    font-size: 44rpx;
    word-break: break-all;
  }
}

.barcode {
  //margin-left: auto;
  width: 464rpx;
  height: 106rpx;
}

.manage-center {
  width: 698rpx;
  background-color: #FF6D3F;
  border-radius: 24rpx;
  border: 2rpx solid #FF6D3F;
}

.manage-center-up {
  padding-bottom: 24rpx;

  &>view:first-child {
    word-break: break-all;
    flex-grow: 1;
  }

  &>view:last-child {
    flex-shrink: 0;
  }
}

.role-label {
  height: 42rpx;
  display: inline-block;
  border-radius: 24rpx;
  line-height: 42rpx;
  font-size: 28rpx;
  padding: 0 20rpx;
  border: 2rpx solid #FFFFFF;
  color: #FFFFFF;
  margin-left: 24rpx;
}

.region {
  font-size: 34rpx;
  font-weight: 500;
  margin: 24rpx;
  display: flex;
  flex: 1;
  color: #FFFFFF;
}

.switch {
  margin: 24rpx;
  color: #FF6B38;
  border: 2rpx solid #FF6B38;
  border-radius: 24rpx;
  padding: 0 12rpx;
  background: #FFFFFF;
}

.manage-center-down {
  display: flex;
  justify-content: space-around;
  background: #FFFFFF;
  border-radius: 24rpx;
}

.content {
  padding-top: 24rpx;
  text-align: center;
  width: 172rpx;
  margin-bottom: 26rpx;
}

.content-name {
  font-size: 34rpx;
  font-weight: 500;
}

.content-center {
  display: flex;
  justify-content: center;
}

.content-number {
  font-size: 28rpx;
  margin-top: 8rpx;
  color: #FF6B38;
}

.content-left {
  flex: 1;
}

.content-list-item {
  width: 655rpx;
  background-color: #FFFFFF;
  margin-top: 24rpx;
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
}
</style>