export const name = 'ready';
export const once = true;

export function execute(client) {
  console.log(`✅ Bot đã sẵn sàng! Đăng nhập dưới tên ${client.user.tag}`);
  
  // Set bot status
  client.user.setActivity('!help | Quản lý server', { type: 'WATCHING' });
}
