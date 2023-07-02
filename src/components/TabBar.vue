<template>
  <cover-view class="tabbar" @touchmove.stop.prevent="() => {}">
    <cover-view :class="['my-flex-row','safe-area-inset-bottom','tabbar__content',layout]">
      <cover-view class="tabbar__content__item"
                  v-for="(item, index) in usersStore.getTabBar"
                  :key="index"
                  @tap.stop="clickHandler(index)">
        <cover-view class="tabbar__content__item__button">
          <cover-image :src="elIconPath(index)" mode="aspectFit" />
        </cover-view>
        <cover-view class="tabbar__content__item__text" :style="{color: elColor(index)}">
          {{ item.text }}
        </cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import usersModule from '@/store/modules/users'

const usersStore = usersModule()

const props = defineProps({
  // 切换前的回调
  beforeSwitch: {
    type: Function,
    default:
      null
  },
})

const emits = defineEmits(["change"])

const pageUrl = ref<string>('')  // 当前页面URL

//图标排列样式
const layout = computed(() => {
  switch (usersStore.getTabBar.length) {
    case 1:
      return 'my-jus-center'
    case 2 :
      return 'my-jus-around'
    case 3:
      return 'my-jus-around'
  }
})
//组件运行初始化
const init = () => {
  uni.hideTabBar();
  let pages = getCurrentPages();
  if (pages.length > 0){
    // 页面栈中的最后一个即为项为当前页面，route属性为页面路径
    pageUrl.value = pages[pages.length - 1].route as string;
  }
};
// 切换tab
const switchTab = (index: number) => {
  emits("change", index);
  // 如果有配置pagePath属性，使用uni.switchTab进行跳转
  if (usersStore.getTabBar[index].pagePath){
    uni.switchTab({
      url: `/${ usersStore.getTabBar[index].pagePath }`
    });
  }
};
//点击tab-bar 按钮
const clickHandler = async (index: number) => {
  if (props.beforeSwitch && typeof props.beforeSwitch === "function"){
    // 执行回调，同时传入索引当作参数
    // 在微信，支付宝等环境(H5正常)，会导致父组件定义的customBack()函数体中的this变成子组件的this
    // 通过bind()方法，绑定父组件的this，让this.customBack()的this为父组件的上下文
    let beforeSwitch = props.beforeSwitch.bind(this.$u.$parent.call(this))(index);
    // 判断是否返回了promise
    if (!!beforeSwitch && typeof beforeSwitch.then === "function"){
      await beforeSwitch
        .then(res => {
          // promise返回成功，
          switchTab(index);
        })
        .catch(err => {
        });
    } else if (beforeSwitch === true){
      // 如果返回true
      switchTab(index);
    }
  } else {
    switchTab(index);
  }
};
//返回是否点击的图片
const elIconPath = (index: number) => {
  let pagePath = usersStore.getTabBar[index].pagePath;
  if (pagePath){
    if (pagePath == pageUrl.value || pagePath == "/" + pageUrl.value){
      return usersStore.getTabBar[index].selectedIconPath;
    } else {
      return usersStore.getTabBar[index].iconPath;
    }
  }
};
//返回文字颜色
const elColor = (index: number) => {
  let pagePath = usersStore.getTabBar[index].pagePath;
  if (pagePath){
    if (pagePath == pageUrl.value || pagePath == "/" + pageUrl.value){
      return '#FF6B38';
    } else return '#000000';
  }
};
//初始化
init()
</script>

<style scoped lang="scss">
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 24rpx;
  padding-right: 24rpx;
  background: #FFFFFF;
  z-index: 999;

  &__content {
    height: 114rpx;
    //border-top: 2rpx solid #FFE9DB;
    &__item {
      //flex: 1;
      justify-content: center;
      height: 100%;
      padding: 6rpx 0 4rpx 0;
      flex-direction: column;
      align-items: center;
      position: relative;

      &__button {
        height: 64rpx;
        width: 64rpx;
      }

      &__text {
        font-size: 28rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
      }
    }
  }

  &__content::before {
    content: ' ';
    position: absolute;
    height: 2rpx;
    width: 100%;
    top: 2rpx;
    background-color: #FFE9DB;
  }
}
</style>