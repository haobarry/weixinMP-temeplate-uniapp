<template>
  <view class="my-flex-row sku-container">
    <view>
      <image :lazy-load="true"
             style="width: 144rpx;height: 144rpx;border-radius: 24rpx;"
             :src="authStore.staticUrl+sku.entry_image" />
    </view>
    <view class="my-flex-col my-jus-between sku-detail">
      <view>{{ sku.name }}</view>
      <view class="my-flex-row my-jus-between">
        <view class="my-flex-col my-jus-evenly">
          <text>起订量：{{ sku.min_purchase_unit || sku.min_shop_unit }}{{ sku.measurement_unit }}</text>
          <text>￥{{ handlesSeparationNum(+sku.purchase_price || +sku.agent_node_price) }}</text>
        </view>
        <view class="buy-icon" @click="addToCart">
          <Badge :count="sku.count"
                 :overflow-count="999"
                 color="#FF6B38"
                 :offset="[-10,-14]"
                 bgColor="#ffffff"
                 :border-style="{border:'2rpx solid #ff6b38'}"
          />
          <text>购</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Badge from '@/components/Badge.vue'
import { useStores } from '@/store'
import { handlesSeparationNum } from '@/utils/numberSeparation'

const { authStore } = useStores()


const props = defineProps<{ sku: ProcurementOrdersSku | SpotSkus }>()
const emits = defineEmits(['addToCart'])

const addToCart = () => {
  emits('addToCart', props.sku)
}

</script>

<style scoped lang="scss">
.sku-container {
  height: 192rpx;
  box-sizing: border-box;
  padding: 24rpx 30rpx 24rpx 24rpx;
  border-radius: 24rpx;
  margin: 24rpx 24rpx 0 24rpx;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);

  & .sku-detail {
    margin-left: 24rpx;
    flex-grow: 1;
    //width: 390rpx;

    & > view:first-child {
      font-size: 34rpx;
      width: 474rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    & > view:last-child {
      font-size: 34rpx;

      & > view:first-child {
        & > text:first-child {
          color: $chm-text-assist-color;
        }

        & > text:last-child {
          color: $chm-color;
        }
      }
    }
  }

  .buy-icon {
    display: flex;
    position: relative;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: $chm-color;
    font-size: 32rpx;
    color: #FFFFFF;
    height: 56rpx;
    width: 56rpx;
    line-height: 52rpx;
    margin-top: auto;

    & > text {
      margin: 0 auto;
    }
  }
}
</style>