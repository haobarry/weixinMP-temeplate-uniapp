<template>
  <uni-popup ref="selectPopup"
             type="bottom"
             mask-background-color="rgba(0,0,0,0.2)">
    <view class="popupRef">
      <uni-icons class="close-popup"
                 type="closeempty"
                 size="32"
                 color="#A6A6A6"
                 @click="closePopup" />
      <view class="popup-title">请选择收货地区</view>
      <view class="popup-content">
        <view class="popup-content-select">
          <view class="select-city" @click="(showProvince = true) && (showArea = false) &&
  (showCity = false)">
            <uni-icons type="smallcircle-filled" color="#FF6B38" />
            <text v-if="provinceChecked">&nbsp;{{ addressSelected.province }}</text>
            <text v-else> 请选择省份</text>
          </view>
          <uni-icons class="icon" type="right" color="#A6A6A6" />
        </view>
        <view class="popup-content-select">
          <view class="select-city" @click="(showCity = true) && (showArea = false) && (showProvince = false)">
            <uni-icons type="smallcircle-filled" color="#FF6B38" />
            <text v-if="cityChecked">&nbsp;{{ addressSelected.city }}</text>
            <text v-else> 请选择城市</text>
          </view>
          <uni-icons class="icon" type="right" color="#A6A6A6" />
        </view>
        <view class="popup-content-select">
          <view class="select-city">
            <uni-icons type="smallcircle-filled" color="#FF6B38" />
            <text v-if="areaChecked">&nbsp;{{ addressSelected.area }}</text>
            <text v-else> 请选择区/县</text>
          </view>
          <uni-icons class="icon" type="right" color="#A6A6A6" />
        </view>
      </view>
      <view style="height: 40rpx;font-size: 34rpx;">
        <view>选择省份/地区</view>
      </view>
      <scroll-view class="address-detail" scroll-y="true">
        <view v-if="showProvince">
          <view class="address-content"
                v-for="item in provinceData"
                :key="item.id"
                @click="selected(item)">
            · {{ item.text }}
            <uni-icons type="checkmarkempty" color="#FF6B38" v-if="item.id === currentSelectId" />
          </view>
        </view>
        <view v-if="showCity">
          <view class="address-content" v-for="item in cityData" :key="item.id">
            <view @click="selected1(item)">
              · {{ item.text }}
            </view>
            <uni-icons type="checkmarkempty" color="#FF6B38" v-if="item.id == currentSelectId" />
          </view>
        </view>
        <view v-if="showArea">
          <view class="address-content" v-for="item in areaData" :key="item.id">
            <view @click="selected2(item)">
              · {{ item.text }}
            </view>
            <uni-icons type="checkmarkempty" color="#FF6B38" v-if="item.id == currentSelectId" />
          </view>
        </view>
      </scroll-view>
    </view>
  </uni-popup>

</template>
<script setup lang="ts">
import { onUpdated, reactive, ref } from "vue";
import { getAddressDetail } from "@/services/api";


// 选择地址弹出框
const selectPopup = ref()
// 区域显示省/市/区
const showProvince = ref(true)
const showCity = ref(false)
const showArea = ref(false)
// 省市区是否被选中
const provinceChecked = ref(false)
const cityChecked = ref(false)
const areaChecked = ref(false)
//展示省市区的数据
const provinceData = ref()
const cityData = ref()
const areaData = ref()
// 当前选中的省/市/区的id值
const currentSelectId = ref()
// 选中的省市区内容
const addressSelected = reactive({
  province: '',
  city: '',
  area: ''
})

const emit = defineEmits(['getAddress'])
// 选中省展示市
const selected = (e: any) => {
  addressSelected.province = e.text
  currentSelectId.value = e.id
  provinceChecked.value = true
  showProvince.value = false
  showCity.value = true
  if (provinceChecked.value == true){
    getAddressDetail(e.id).then((res) => {
      cityData.value = res.data
    })
  }
}
// 选中市展示区
const selected1 = (e: any) => {
  addressSelected.city = e.text
  currentSelectId.value = e.id
  cityChecked.value = true
  showCity.value = false
  showArea.value = true
  if (cityChecked.value == true){
    getAddressDetail(e.id).then((res) => {
      areaData.value = res.data
    })
  }
}
// 选中区弹窗关闭
const selected2 = (e: any) => {
  addressSelected.area = e.text
  currentSelectId.value = e.id
  areaChecked.value = true
  if (areaChecked.value == true){
    selectPopup.value.close()
  }
}
const getAddress = () => {
  console.log('🎈 console>>>', console)
}
onUpdated(() => {
  if (!addressSelected.area.length) return
  emit('getAddress', addressSelected)
})

const openPopup = () => {
  selectPopup.value.open()
  getAddressDetail(0).then((res) => {
    provinceData.value = res.data
  })
}
const closePopup = () => {
  selectPopup.value.close()
}
defineExpose({
  openPopup,
  closePopup,
})
</script>

<style scoped lang="scss">
.popupRef {
  height: 1000rpx;
  background: #FFFFFF;
  padding: 24rpx;
  border-radius: 24rpx 24rpx 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-title {
  text-align: center;
  font-size: 44rpx;
  margin-bottom: 24rpx;
}

.popup-content {
  border-bottom: 2rpx solid #F4F4F4;
  margin-bottom: 12rpx;
  height: 220rpx;
}

.popup-content-select {
  display: flex;
  margin: 24rpx 0;
  font-size: 34rpx;
}

.select-city {
  flex: 1;

  & > text:nth-child(2) {
    margin-left: 24rpx;
  }
}

.address-detail {
  margin-top: 24rpx;
  flex: 1;
  overflow: auto;
}

.address-content {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 6rpx;
}

.close-popup {
  position: absolute;
  top: 18rpx;
  right: 18rpx;
}
</style>

