<template>
  <view class="barcode-box">
    <BarcodeCanvas :width="702" :height="102" :code-number="usersStore.getUserId" />
  </view>
  <DetailList title="姓名：" :right-text="usersStore.getUserName" :isInput="true" @onBlur="nameInputOnBlur" />
  <DetailList title="手机号：" :right-text="usersStore.getUserPhoneNumber" @onClick="() => { (editPopupRef.open()) }"
    border="" />

  <uni-popup ref="editPopupRef" type="center" :is-mask-click="false" mask-background-color="rgba(0,0,0,0.2)">
    <view class="zb-flex-col zb-jus-evenly zb-ali-center phone-change-container">
      <uni-icons class="close-popup" type="closeempty" size="32" color="#A6A6A6"
        @tap.stop="() => { editPopupRef.close() }" />
      <view>更换您的手机号</view>
      <MyNormalInput placeholder="请输入新的手机号" customStyle="width:654rpx;" v-model="phoneValue" />
      <MyNormalInput type="number" placeholder="请输入验证码" customStyle="width:654rpx;" rightContent="获取验证码"
        v-model="authCodeValue" @rightClick="getAuthCode" />
      <view v-show="isShowAuthTips">
        <NumberCountTo duration="60000" start-val="60" end-val="0" :use-easing="false" color="#000" font-size="28"
          @end="countDownEnd" :autoplay="false" ref="countToRef" />
        <text style="color:#808080">秒后重新获取验证码</text>
      </view>
      <button class="zb-big-button" @click="handleChangePhone">确认</button>
    </view>
  </uni-popup>
  <ToastBox ref="toastRef"></ToastBox>
</template>

<script setup lang="ts">
import DetailList from '@/components/DetailList.vue'
import { useStores } from '@/store'
import { onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import MyNormalInput from '@/components/MyNormalInput.vue'
import NumberCountTo from '@/pages/home/components/NumberCountTo.vue'
import ToastBox from '@/components/ToastBox.vue'
import BarcodeCanvas from '@/components/BarcodeCanvas.vue'
import { authSmsNotify, getIsPhoneNumberUsed, getUserDetail, sendSmsNotify, updateUsersDetail } from '@/services/api'

const { usersStore } = useStores()
const editPopupRef = ref<any>(null)
const countToRef = ref<any>(null)
const toastRef = ref<any>(null)

const isShowAuthTips = ref<boolean>(false)
const phoneValue = ref<string>('')
const authCodeValue = ref<string>('')
const isRequestVerCode = ref<boolean>(false)//是否请求过验证码

const nameInputOnBlur = (params: string) => {
  updateUsersDetail(usersStore.id, { username: params }).then(({ data }) => {
    usersStore.name = data.username
    uni.showToast({ title: '修改成功', icon: 'none' })
  })
}

//校验手机号码
const isPhoneNumberValid = (phone: string) => {
  return /^1[3456789]\d{9}$/.test(phone)
}
//校验验证码
const isVCodeValid = (code: string) => {
  return /^\d{6}$/.test(code)
}

//获取验证码
const getAuthCode = async () => {
  try {

    if (isShowAuthTips.value) {
      toastRef.value.toggle('center', '稍后获取验证码')
      return
    }
    if (!phoneValue.value.length) {
      toastRef.value.toggle('center', '请输入手机号码')
      return
    }
    if (!isPhoneNumberValid(phoneValue.value)) {
      toastRef.value.toggle('center', '手机号不正确')
      return
    }
    if (phoneValue.value === usersStore.phoneNumber) {
      toastRef.value.toggle('center', '手机号和原手机号相同')
      return
    }
    let res = await getIsPhoneNumberUsed({ phone_number: phoneValue.value })
    if (res.data) {
      toastRef.value.toggle('center', '该手机号已被使用')
      return
    }

    await sendSmsNotify({ phone_number: phoneValue.value }).then(() => {
      isShowAuthTips.value = true
      isRequestVerCode.value = true
      countToRef.value.start()
    }).catch(err => {
      toastRef.value.toggle('center', err.data.msg)
    })

  } catch (err) {
    throw err
  }
}

const countDownEnd = () => {
  isShowAuthTips.value = false
}

//确认更换手机号码操作
const handleChangePhone = async () => {
  try {
    if (!authCodeValue.value.length || !phoneValue.value.length) {
      toastRef.value.toggle('center', '输入信息不全')
      return
    }
    if (!isRequestVerCode.value) {
      toastRef.value.toggle('center', '还没有获取验证码')
      return
    }
    if (!isVCodeValid(authCodeValue.value)) {
      toastRef.value.toggle('center', '验证码不符合')
      return
    }
    if (!isPhoneNumberValid(phoneValue.value)) {
      toastRef.value.toggle('center', '手机号不符合')
      return
    }
    let res = await authSmsNotify(phoneValue.value, { code: authCodeValue.value })
    if (res) {
      updateUsersDetail(usersStore.id, { phone_number: phoneValue.value }).then(({ data }) => {
        usersStore.phoneNumber = data.phone_number
        toastRef.value.toggle('center', '修改成功')
        editPopupRef.value.close()
      })
    }

  } catch (err: any) {
    toastRef.value.toggle('center', err.data.msg)
  }
}

onReady(async () => {
  const userRes = await getUserDetail(usersStore.id);
  if (userRes.data) {
    usersStore.name = userRes.data.username;
    usersStore.phoneNumber = userRes.data.phone_number;
  }

})
</script>

<style scoped lang="scss">
.barcode-box {
  margin: 24rpx;
}

.close-popup {
  position: absolute;
  top: 18rpx;
  right: 18rpx;
}

.phone-change-container {
  height: 514rpx;
  width: 702rpx;
  background-color: #FFFFFF;
  border-radius: 24rpx;

  &>view:nth-child(2) {
    min-height: 64rpx;
    font-size: 44rpx;
    margin-bottom: 24rpx;
    margin-top: 12rpx;

  }


  &>view:nth-child(4) {
    font-size: 28rpx;
  }

}
</style>