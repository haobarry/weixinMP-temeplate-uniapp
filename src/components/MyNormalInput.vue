<template>
  <view class="input-container" :style="customStyle">
    <uni-icons v-if="prefixIcon" class="content-clear-icon"
               :type="prefixIcon" color="#c0c4cc"
               size="22"/>
    <input :placeholder="_placeholder"
           placeholder-style="color:#808080;"
           :class="{'input-class':true, showPh:isShowPh}"
           :value="val"
           @blur="inputBlur"
           :type="type === 'password' ? 'text' : type"
           :password="!showPassword && type === 'password'"
           :disabled="disabled"
           :cursor-spacing="cursorSpacing"
           @focus="_Focus"
           @input="onInput"
           @confirm="onConfirm"
           @keyboardheightchange="onkeyboardheightchange"
    />
    <uni-icons
      v-if="clearable && isVal && !disabled && type !== 'textarea'"
      class="content-clear-icon"
      :class="{ 'is-textarea-icon': type === 'textarea' }"
      type="clear"
      :size="clearSize"
      @click="onClear"
    />
    <view v-if="rightContent"
          :style="rightContentStyle"
          class="right-content"
          @click.stop="()=>emits('rightClick')"
    >
      {{ rightContent }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {// 输入框的类型，textarea，text，number
    type: String,
    default: 'text'
  },
  placeholder: {// 输入框的 placeholder 内容
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: [Number, String],
    default: 140
  },
  // 输入框的自定义样式
  customStyle: {
    type: String,
    default: ''
  },
  // 是否自动获得焦点
  focus: {
    type: Boolean,
    default: false
  },
  // 密码类型时，是否显示右侧的密码图标
  passwordIcon: {
    type: Boolean,
    default: true
  },
  // 是否可清空
  clearable: {
    type: [Boolean, String],
  },
  rightContent: {
    type: [Boolean, String],
  },
  rightContentStyle: {
    type: String,
    default: ''
  },
  // 指定光标与键盘的距离，单位 px
  cursorSpacing: {
    type: [Number, String],
    default: 0
  },
  // 弹出键盘时是否自动调节高度，uni-app默认值是true
  adjustPosition: {
    type: Boolean,
    default: true
  },
  prefixIcon: {//前缀
    type: String,
    default: ''
  },
  suffixIcon: {//后缀
    type: String,
    default: ''
  },
  clearSize: {
    type: [Number, String],
    default: 24
  },
})

const value = ref<string | number>('')
const isShowPh = ref(false)
// const isVal = ref(false)
const val = ref<string | number>('')
const isEnter = ref(false) // 用于判断当前是否是使用回车操作
const showPassword = ref(false)
const _placeholder = ref(props.placeholder)

const emits = defineEmits(['click', 'iconClick', 'update:modelValue', 'input', 'focus', 'blur', 'confirm', 'clear', 'eyes', 'change', 'keyboardheightchange', 'rightClick'])

const isVal = computed(() => {
  return !!(val.value || val.value === 0);
})

// input右侧样式
const inputStyle = computed(() => {
  const paddingRight = props.type === 'password' || props.clearable || props.prefixIcon ? '' : '10px';
  return obj2strStyle({
    'padding-right': paddingRight,
    'padding-left': props.prefixIcon ? '' : '10px'
  });
})


const obj2strStyle = (obj: any) => {
  let style = '';
  for (let key in obj) {
    const val = obj[key];
    style += `${ key }:${ val };`;
  }
  return style;
}

/**
 * 显示隐藏内容，密码框时生效
 */
const onEyes = () => {
  showPassword.value = !showPassword.value;
  emits('eyes', showPassword.value);
}

const _Focus = (event: any) => {
  // this.focusShow = true;
  emits('focus', event);
}

/**
 * 输入时触发
 */
const onInput = (event: any) => {
  let value = event.detail.value
  val.value = value;
  emits('update:modelValue', value);

}


/**
 * 外部调用方法
 * 获取焦点时触发
 */
const onFocus = () => {
}

/**
 * 键盘高度发生变化的时候触发此事件
 * 兼容性：微信小程序2.7.0+、App 3.1.0+
 * @param {Object} event
 */
const onkeyboardheightchange = (event: any) => {
  emits("keyboardheightchange", event);
}

/**
 * 按下键盘的发送键
 * @param {Object} e
 */
const onConfirm = () => {
  emits('confirm', val.value);
  isEnter.value = true;
  emits('change', val.value);
  nextTick(() => {
    isEnter.value = false;
  });
}

/**
 * 清理内容
 * @param {Object} event
 */
const onClear = () => {
  val.value = '';
  emits('update:modelValue', '');
  // 点击叉号触发
  emits('clear');
}

//失去焦点触发
const inputBlur = (event: any) => {
  let value = event.detail.value;
  if (!value.length){//没文字的时候继续显示placeholder 修复bug
    isShowPh.value = true
    _placeholder.value = ''
  }
  // 根据类型返回值，在event中获取的值理论上讲都是string
  if (isEnter.value === false){
    emits('change', val.value);
  }
  emits('blur')
}


</script>

<style scoped lang="scss">
.input-container {
  position: relative;
  /* width: 100%; */
  //margin: 0 24rpx 24rpx 24rpx;
  margin: 0 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2rpx solid #FF6B38;
  border-radius: 40rpx;
  height: 80rpx;
  padding: 18rpx 24rpx;
  box-sizing: border-box;
  font-size: 34rpx;

  .input-class {

  }
}

//.showPh::after {
//  position: absolute;
//  content: "请输入您的姓名";
//  color: #808080;
//  transform: translateY(-80rpx);
//}
</style>