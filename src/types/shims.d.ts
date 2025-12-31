// 临时声明文件，避免编辑器/类型检查在依赖尚未解析时报错
// 在生产开发中应该安装并使用真实的类型库（例如 axios 自带类型、@types/node 等）

declare module 'axios' {
  const axios: any
  export default axios
  export type AxiosRequestConfig = any
  export type AxiosResponse<T = any> = any
}

declare module '@/api' {
  export function login(username: string, password: string): Promise<any>
  export function chatReply(message: string): Promise<string>
}

// 允许导入任意 .vue 文件
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
