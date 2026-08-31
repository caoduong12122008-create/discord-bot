import { EmbedBuilder } from 'discord.js';

export const name = 'level';
export const description = 'Xem bảng level top';
export const requiredRole = 'member';

export async function execute(interaction) {
  try {
    const allUsers = await global.db.getAllUsers();
    const topUsers = allUsers.slice(0, 10);

    let leaderboard = '';
    topUsers.forEach((user, index) => {
      leaderboard += `**${index + 1}.** <@${user.userId}> - Level ${user.level} (${user.rank})\n`;
    });

    const embed = new EmbedBuilder()
      .setColor(0xffd700)
      .setTitle('🏆 Bảng Xếp Hạng Level')
      .setDescription(leaderboard || 'Chưa có dữ liệu')
      .setFooter({ text: 'Cập nhật mỗi khi có người lên level' });

    return embed;
  } catch (error) {
    console.error('Error in level command:', error);
    return {
      content: '❌ Có lỗi khi lấy bảng xếp hạng!',
      ephemeral: true,
    };
  }
}
