<template>
  <view class="top-tabs" :style="{ color: color }">
    <scroll-view class="top-tabs-scroll" scroll-x="true" :scroll-left="scrollLeft" scroll-with-animation>
      <view class="top-scroll-view">
        <view class="top-tab-item" v-for="(item, index) in list" :key="index" @click="$emit('change', index)">
          <view v-if="item.count" class="tab-count" :style="item.count > 9 ? { padding: '0 7rpx' } : {}">{{ item.count }}
          </view>
          <text v-if="current === index" class="name tab-active" :style="{ color: activeColor }">{{ item.name }}
          </text>
          <text v-else class="name">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
/*
* @property {number} current 选中的下标
* @property {Array} list tabs 列表
*   type: 'created',
    name: '待付款',
    count: 0
* @property {String} color = 默认颜色
* @property {String} activeColor = 激活的颜色
* @event {Function(current)} change 改变标签触发
*/
import { ref, watch, onMounted, getCurrentInstance } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default() {
      return [{
        name: '',
        count: 0
      },]
    }
  },
  current: {
    type: Number,
  },
  color: {
    type: String,
    default() {
      return '#000000'
    }
  },
  activeColor: {
    type: String,
    default() {
      return '#000000'
    }
  },
})
const instance = getCurrentInstance()
const scrollLeft = ref(0)
let tabViewWidth = ref(0)
const tabQueryInfo = ref({})

defineEmits(['change'])

// 当多个菜单时，需要让所选内容处于中间
const scrollByIndex = (index) => {
  let tabInfo = JSON.parse(JSON.stringify(tabQueryInfo.value))[index]
  if (tabInfo.left < tabViewWidth.value / 2) {
    scrollLeft.value = 0
    return;
  }
  scrollLeft.value = tabInfo.left - tabViewWidth.value / 2 + tabInfo.width / 2
}

const scrollInit = () => {
  let query = uni.createSelectorQuery().in(instance)
  // 获取容器的宽度
  query.select(`.top-scroll-view`).boundingClientRect((data) => {
    if (tabViewWidth.value && data) {
      tabViewWidth.value = data.width
    }
  }).exec()
  // 获取每个项目的宽度
  query.selectAll('.top-tab-item').boundingClientRect(data => {
    if (tabQueryInfo.value && data) {
      tabQueryInfo.value = data
    }
  }).exec()
}

watch(() => props.current, (newValue, oldValue) => {
  if (oldValue === undefined) return
  scrollByIndex(newValue)
},)

onMounted(() => {
  scrollInit()
})

</script>

<style lang="scss" scoped>
.tab-count {
  position: absolute;
  left: 110rpx;
  top: 12rpx;
  padding: 0 11rpx;
  height: 24rpx;
  border-radius: 14rpx;
  border: 2rpx solid #FF7028;
  text-align: center;
  color: #FF7028;
  line-height: 25rpx;
  font-size: 24rpx;
}

.top-tabs {
  border: none;
  background: #FFFFFF;
}

.top-tabs-scroll {
  white-space: nowrap;
}

.top-scroll-view {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.top-tab-item {
  font-size: 28rpx;
  padding: 20rpx 30rpx;
  transition: all 0.3s linear;
  position: relative;

  .name {
    white-space: nowrap;
    padding: 10rpx 0;
    // padding: 10rpx 30rpx;
  }

  .tab-active {
    color: #000;
    //font-weight: 600;
    //font-size: 110%;
    border-bottom: 4rpx solid #FB6E2A;
  }
}

// 隐藏scroll-view下的滚动条
scroll-view ::v-deep ::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
