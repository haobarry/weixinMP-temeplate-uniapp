<template>
  <view class="zb-flex-row top-container zb-ali-center">
    <view @click="navTo">
      <text>{{ usersStore.getUserName }}</text>
    </view>
    <view class="zb-flex-row zb-ali-center">
      <uni-icons type="right" class="icon" @click="navTo" />
      <BarcodeCanvas :width="464" :height="106" :code-number="usersStore.getUserId" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useStores } from '@/store'
import BarcodeCanvas from '@/components/BarcodeCanvas.vue'
import { onReady } from '@dcloudio/uni-app'
import { getUserDetail } from '@/services/api'

const { usersStore } = useStores()
const navTo = () => uni.navigateTo({ url: './myInfo' })

onReady(async () => {
  try {
    const userRes = await getUserDetail(usersStore.id);
    ({
      username: usersStore.name,
      phone_number: usersStore.phoneNumber
    } = { ...userRes.data })
  } catch (e) {
    console.error(e)
    uni.showToast({ icon: 'none', title: '获取用户信息失败' })
  }

})
</script>

<style scoped lang="scss">
.top-container {
  margin: 24rpx;

  &>view:first-child {
    margin-right: auto;
  }

  .icon {
    padding: 0 13rpx;
  }

  & text {
    font-size: 44rpx;
    word-break: break-all;
  }
}

.barcode {
  /*margin-left: auto;*/
  width: 464rpx;
  height: 106rpx;
}
</style>