import * as mockAuth from './mock/auth'
import * as mockChat from './mock/chat'

export async function login(username: string, password: string) {
  // 当前使用本地 mock 登录
  return mockAuth.mockLogin(username, password)
}

export async function chatReply(message: string) {
  return mockChat.mockChatReply(message)
}

export * from './mock/auth'
export * from './mock/chat'

