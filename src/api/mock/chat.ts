// 本地 mock 聊天接口
export async function mockChatReply(input: string) {
  await new Promise((r) => setTimeout(r, 600))
  // 简单模拟回复
  return `收到：${input} — 这是来自本地模拟的回复。`
}

