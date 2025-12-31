// 本地 mock 登录接口
export async function mockLogin(username: string, password: string) {
  // 模拟延迟
  await new Promise((r) => setTimeout(r, 500))
  if (username === 'admin' && password === 'admin') {
    return { token: 'mock-token-123', user: { name: '管理员', username: 'admin' } }
  }
  throw new Error('用户名或密码错误')
}

