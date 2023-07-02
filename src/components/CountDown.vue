<template>
  <view v-if="timestamp" :style="styles">{{ minutes }}分{{ seconds }}秒</view>
  <view v-else :style="styles">{{ number }}</view>
</template>

<!--
* 传入未来的一个时间戳 或 倒计时数字
* startNumber or timestamp 只能传入一种；时间戳支持10位或则13位的字符串或数字
* styles传入样式 对象形式
* 倒计时结束方法名称  countEnd: ()=> void;

-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  timestamp: {
    type: [Number, String],
  },
  startNumber: {
    type: Number,
  },
  styles: {
    type: Object,
    default() {
      return {
        fontSize: '34rpx',
        color: 'rgba(255, 107, 56, 1)',
      }
    }
  }
})
const emit = defineEmits(['countEnd'])

const number = ref(props.startNumber)
const minutes = ref(0)
const seconds = ref(0)

// 倒计时初始化
const timeInit = (() => {
  if (props.timestamp){//13或10位时间戳 1687159666
    let _time;
    if (+props.timestamp > 9999999999){
      _time = new Date(+props.timestamp - Date.now())
    } else {
      _time = new Date((+props.timestamp * 1000) - Date.now())
    }

    console.log("😁 method:timeInit 组件获取的时间戳>", props.timestamp, _time)
    minutes.value = _time.getMinutes()
    seconds.value = _time.getSeconds()
    console.log("😁 method:timeInit line:55>>>", _time.getMinutes(), _time.getSeconds())
    //一加载开始执行
    startTimeUp()
  }
  if (props.startNumber){
    console.log("😁 method:t正>>",)
    startNumber()
  }

})


let timer: any = null

//一个倒计时的时间函数
const startTimeUp = () => {
  timer = null
  timer = setTimeout(() => {
    seconds.value--
    if (seconds.value <= 0){
      if (minutes.value === 0){
        clearTimeout()
        emit('countEnd')
        return
      }
      minutes.value--
      seconds.value = 60
    }
    startTimeUp()
  }, 1000)

}

const startNumber = () => {
  timer = null
  timer = setTimeout(() => {
    number.value && number.value--
    if (number.value && number.value <= 0){
      console.log("😁 method:nu line:82>>>", number.value)
      // timer = null
      clearTimeout()
      emit('countEnd')
      return
    } else {
      startNumber()
    }
  }, 1000)
}

const clearTimeout = () => {
  clearInterval(timer)
  timer = null
}

onUnmounted(() => {
  clearTimeout()
})


onMounted(() => {
  timeInit()
})

</script>

<style scoped lang="scss">

</style>