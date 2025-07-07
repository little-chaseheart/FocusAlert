/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 音频文件类型声明
declare module '*.mp3' {
  const src: string
  export default src
}
