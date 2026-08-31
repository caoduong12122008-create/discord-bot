import { EmbedBuilder } from 'discord.js';

export const name = 'resetrank';
export const description = 'Reset rank của một user (Admin only)';
export const requiredRole = 'admin';

export async function execute(interaction) {
  try {
    const targetUser = interaction.options.getUser('user');

    if (!targetUser) {
      return {
        content: '❌ Vui lòng chỉ định user cần reset rank!',
        ephemeral: true,
      };
    }

    const resetUser = await global.db.resetRank(targetUser.id);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('✅ Reset Rank Thành Công')
      .addFields(
        { name: 'User', value: `<@${targetUser.id}>`, inline: true },
        { name: 'Level', value: `${resetUser.level}`, inline: true },
        { name: 'Rank', value: `${resetUser.rank}`, inline: true }
      )
      .setFooter({ text: `Reset bởi ${interaction.user.username}` });

    return embed;
  } catch (error) {
    console.error('Error in resetrank command:', error);
    return {
      content: '❌ Có lỗi khi reset rank!',
      ephemeral: true,
    };
  }
}
