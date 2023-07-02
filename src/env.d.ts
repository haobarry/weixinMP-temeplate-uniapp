declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
//定义 js模块
declare module '@/utils/barCode.js' {
  export const wxBarCode: ({ id, component }: { id: string, component?: any },
                           code: string, width: number, height: number,
                           { isRotate, degree }?: { isRotate?: boolean; degree?: number },
                           callBackFn?: () => void) => void
}
declare module 'z-paging/components/z-paging/js/hooks/useZPaging.js'