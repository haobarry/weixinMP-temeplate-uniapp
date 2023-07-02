/*
* 打开企业微信客服
*
*/

export default function() {
  uni.openCustomerServiceChat({
    extInfo: {
      url: 'https://work.weixin.qq.com/kfid/kfc9fe1f6fdea9e9334'
    },
    corpId: 'ww31d293459c63c7ae',
    // showMessageCard: true,//是否发送小程序气泡消息
    // sendMessageTitle: '气泡消息标题',
    success(res) {
    },
    fail(res) {
    },
    complete() {
    }
  })

}

