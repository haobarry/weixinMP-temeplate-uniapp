<template>
  <canvas canvas-id="barcode" class="barcode"
          @click="showBigBarcode"
          :style="{width: width+'rpx', height: height+'rpx'}" />
  <!--  <cover-view v-if="isShowBigBarcode" class="big-barcode" @click="closeBigCode">-->
  <!--  </cover-view>-->
  <view v-if="isShowBigBarcode" class="big-barcode">
    <cover-view class="code-number">{{ codeNumberWithS }}</cover-view>
    <canvas canvas-id="big-barcode" style="width: 188rpx; height: 1000rpx;margin: auto 0 auto auto;" />
  </view>
  <view class="mask" v-if="isShowBigBarcode" @tap="closeBigCode"></view>
</template>

<!--
* 绘制条形码组件
* 传入 宽度和高度和条形码
-->
<script setup lang="ts">
import { wxBarCode } from '@/utils/barCode.js'
import { onMounted, getCurrentInstance, ref, computed, nextTick } from 'vue'


const props = defineProps({
  codeNumber: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 702
  },
  height: {
    type: Number,
    default: 102
  }
})

const context = getCurrentInstance()
const isShowBigBarcode = ref(false)

const codeNumberWithS = computed(() => props.codeNumber?.split('').join(" "))

const closeBigCode = () => {
  isShowBigBarcode.value = false
}
const showBigBarcode = () => {
  isShowBigBarcode.value = true
  nextTick(() => {
    wxBarCode({ id: 'big-barcode', component: context }, `${ props.codeNumber }`, 990, 188, {
      isRotate: true,
      degree: 90
    }, () => {
      console.log("😁 method:绘制完成 line:52>>>",)
    })
  })
}

defineExpose({
  drawCode(isRotate?: boolean, degree?: number, fun?: () => void) {
    wxBarCode({ id: 'barcode', component: context }, `${ props.codeNumber }`, props.width, props.height, {
      isRotate,
      degree
    }, fun)
  }
})

const emit = defineEmits([])

onMounted(() => {
  console.log('🎈 props.codeNumber>>>', props.codeNumber)
  wxBarCode({
    id: 'barcode',
    component: context
  }, `${ props.codeNumber }`, props.width, props.height,)
})

</script>

<style scoped lang="scss">
.barcode {
  //margin: 24rpx;
  //width: 702rpx;
  //height: 102rpx;
  margin: 0 auto;
}

.big-barcode {
  position: absolute;
  background: #FFFFFF;
  padding: 18rpx;
  width: 320rpx;
  height: 1036rpx;
  border-radius: 24rpx;
  transform: translate(-50%, -50%);
  //border: 2rpx solid #ff5e19;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  z-index: 100;

}

.code-number {
  position: absolute;
  width: 1000rpx;
  font-size: 48rpx;
  -moz-text-align-last: center;
  text-align-last: center;
  text-align: center;
  //border: 1px solid;
  transform-origin: top left;
  transform: translate(8%, 0) rotate(90deg);
  z-index: 110;
}

.mask {
  //width: 100%;
  //height: 100%;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 90;
}
</style>