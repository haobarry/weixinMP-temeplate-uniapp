<template>
</template>

<script lang="ts" setup>
import { onReady } from "@dcloudio/uni-app";
import authStore from '@/store/modules/auth'


const { setApiUrlToDev, setApiUrlToTest, userLogin } = authStore()
const accountInfo = uni.getAccountInfoSync();
const envVersion = accountInfo.miniProgram.envVersion;

let itemList_develop = ['内部开发环境', '内部测试环境', '正式环境']
let itemList_trial = ['内部开发环境', '内部测试环境']

onReady(() => {
  if (envVersion !== "release"){
    // uni.clearStorageSync()//清除缓存
    // authStore().$reset()//复位
    uni.showActionSheet({
      itemList: envVersion === 'develop' ? itemList_develop : itemList_trial,
      title: "您正在访问内部版本",
      alertText: "请选择以继续",
      success: (res: any) => {
        switch (res.tapIndex) {
          case 0://开发
            setApiUrlToDev()
            userLogin()
            break
          case 1://测试
            setApiUrlToTest()
            userLogin()
            break
          case 2://正式
            userLogin()
            break
        }
      },
      fail: (err: any) => {
        console.error(err)
      },
    })
  } else {
    userLogin()
  }

})

</script>