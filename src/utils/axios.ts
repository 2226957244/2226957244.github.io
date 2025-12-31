import axios, { AxiosRequestConfig } from 'axios'

const service = axios.create({ baseURL: '/', timeout: 10000 })

// 请求拦截 - 注入 token
service.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

// 响应拦截 - 统一返回 response
service.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // 抛出错误，交由调用方捕获
    throw error
  }
)

// 简单封装 get/post，适配本地 mock 或真实接口
export async function httpGet<T = any>(url: string, config?: AxiosRequestConfig) {
  const res: any = await service.get(url, config)
  return res.data
}
export async function httpPost<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
  const res: any = await service.post(url, data, config)
  return res.data
}

export default service

