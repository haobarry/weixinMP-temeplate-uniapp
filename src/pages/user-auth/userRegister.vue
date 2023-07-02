<template>
  <view class="name-input-view">
    <input :placeholder="placeholder" placeholder-style="color:#808080;" :class="{ 'name-input': true }" :value="inputName"
      @input="nameInput" />
  </view>
  <view class="zb-flex-row zb-ali-center reg-cry">
    <view @click="selected">
      <image v-if="!checked" src="@static/images/no-check.png" style="height:46rpx;width:46rpx" mode="aspectFit" />
      <image v-else src="@static/images/check.png" mode="aspectFit" style="height:46rpx;width:46rpx" />
    </view>
    <view>我已阅读并同意
      <text class="ny_text" @click="goto('./policy/user-service-agreement')">《用户服务协议》</text>
      <text class="ny_text" @click="goto('./policy/legal-notice')">《法律声明》</text>
      <text class="ny_text" @click="goto('./policy/platform-rules')">《平台规则》</text>
      和
      <text class="ny_text" @click="goto('./policy/privacy-policy')">《隐私政策》</text>
      。未注册手机号验证后将自动注册创惠喵管理中心账号。
    </view>
  </view>
  <button v-if="checked && inputName.length" class="chm-bottom-button-red" open-type="getPhoneNumber"
    @getphonenumber="associatePhoneNumber">注册</button>
  <button v-else class="chm-bottom-button-red" @click="notChecked">注册</button>
  <ToastBox ref="toastRef" />
</template>

<script lang="ts" setup>
import { useStores } from "@/store";
import { ref } from 'vue'
import { createUserInfo } from '@/services/api'
import { onLoad } from "@dcloudio/uni-app";
import ToastBox from "@/components/ToastBox.vue"

const { authStore, usersStore } = useStores()
const activeKey = ref<string>('')
const inputName = ref('')
const toastRef = ref<any>(null)
const checked = ref(false)
const placeholder = ref('请输入您的姓名')


const nameInput = (ev: any) => {
  inputName.value = ev.detail.value
}

const goto = (url: string) => {
  uni.navigateTo({ url })
}

const notChecked = () => {
  toastRef.value.toggle(undefined, '请输入用户名并勾选用户协议')
}

const associatePhoneNumber = async (ev: any) => {
  if (ev.detail.encryptedData) {
    const res = await createUserInfo({
      username: inputName.value,
      code: ev.detail.code,
      aes_iv: ev.detail.iv,
      encrypted_data: ev.detail.encryptedData,
      active_key: activeKey.value,
    })
    console.log('🎈 save phone number res>>>', res)
    //用户注册成功
    if (res.errno === 0) {
      authStore.token = res.jwt ?? '';
      ({ id: usersStore.id, username: usersStore.name, phone_number: usersStore.phoneNumber } = { ...res.data })
      uni.showToast({
        title: "注册成功"
      })
      uni.redirectTo({ url: "./index" })
    }
    //验证信息已过期
    if (res.errno === 10000) {
      uni.showToast({
        title: '登录失败，验证信息已过期',
        success: function () {
          uni.redirectTo({ url: "./index" })
        }
      })
    }
  }

};

const selected = () => {
  checked.value = !checked.value
};

onLoad((option: any) => {
  activeKey.value = option.active_key
})

</script>

<style scoped lang="scss">
.name-input-view {
  margin: 24rpx 24rpx 0;
  background-color: #FFFFFF;
  border-radius: 40rpx;

  .name-input {
    border: 2rpx solid #FF6B38;
    border-radius: 40rpx;
    height: 80rpx;
    padding: 0 24rpx;
    box-sizing: border-box;
    font-size: 34rpx;
  }
}

.showPh::after {
  position: absolute;
  content: "请输入您的姓名";
  color: #808080;
  transform: translateY(-80rpx);
}

.reg-cry {
  margin: 24rpx;
  color: $zb-text-assist-color;

  &>view:first-child {
    margin-right: 12rpx;
  }

  &>view:last-child text {
    color: #FE5F35;
  }
}
</style>