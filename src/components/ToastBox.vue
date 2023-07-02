<template>
  <uni-popup ref="uniUIPopup"
             :is-mask-click="true"
             :maskBackgroundColor="'rgba(0, 0, 0, 0)'"
             :safe-area="false"
             @change="popupShowCall"
             @maskClick="maskClick">
    <view class="popup-center-content" :style="{background:background,color:fontColor,border:border}">
      <slot v-if="!content.length" name="default"></slot>
      {{ content }}
    </view>
  </uni-popup>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const uniUIPopup = ref<any>()
const content = ref<string>('')
const isOpen = ref<any>(null)
let timer: any = null;

const props = defineProps({
  background: {
    type: String,
    default: 'rgba(0, 0, 0, 0.7)'
  },
  fontColor: {
    type: String,
    default: '#FFFFFF'
  },
  border: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['onChange', 'mask-click']);

const maskClick = () => {
  emit('mask-click')
}

const toggle = (popupType: 'center' | 'top' | 'bottom' | 'left' | 'right' = 'center', popupContent?: string) => {
  content.value = popupContent || ''
  // open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
  if (!isOpen.value) uniUIPopup.value.open(popupType)
}

const popupShowCall = (e: { type: string; show: boolean }) => {
  emit('onChange', e)
  // 如果是打开状态，则创建一个延迟关闭
  if (e.show){
    isOpen.value = true
    timer = setTimeout(() => {
      if (isOpen.value){
        uniUIPopup.value.close()
      } else {
        clearTimeout(timer)
      }
    }, 2500)
  } else {
    clearTimeout(timer)
    isOpen.value = false
  }
};

defineExpose({
  toggle,
})
</script>
<style scoped>
.popup-center-content {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  width: 574rpx;
  align-items: center;
  border-radius: 24rpx;
  padding: 46rpx 0;
  text-align: center;
  text-overflow: fade;
  word-break: break-all;
  font-size: 34rpx;
  font-weight: 400;
}

</style>
