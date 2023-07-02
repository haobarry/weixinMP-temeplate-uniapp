<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import deviceInfoStore from '@/store/modules/deviceinfo'

onLaunch(() => {
  deviceInfoStore().savaInfo()
});
onShow(() => {
});
onHide(() => {
});
</script>
<style lang="scss">
@import "uni.scss";

page {
  background-color: #F8F8F8 !important;
}
</style>

