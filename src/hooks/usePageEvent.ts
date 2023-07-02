/**
 * 在使用uni.navigate的eventChannel传送的数据时用的方法
 * @useGetPageEvent  方法可以获取一个页面发送来的数据
 * @eventDate  导出的数据
 *
 */

import { getCurrentInstance, ref } from 'vue';
import type { Ref } from 'vue';


//发送数据到其他页面
const useSendPageEvent = (url: string, eventName: string, data: any) => {

  uni.navigateTo({
    url: url,
    events: {},
    success(option) {
      option.eventChannel.emit(eventName, data);
    }
  })
}

//在页面接受其他页面发送的数据
const useGetPageEvent = <T>(eventName: string): Promise<T> => {
  const instance: any = getCurrentInstance()?.proxy;
  const eventChannel = instance?.getOpenerEventChannel();
  // 通过eventChannel监听页面发来的信息
  return new Promise((resolve, reject) => {
    eventChannel.on(eventName, (data: any) => {
      resolve(data)
    })
  })
}

export { useGetPageEvent, useSendPageEvent }