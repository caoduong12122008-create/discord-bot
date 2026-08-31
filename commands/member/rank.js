import { EmbedBuilder } from 'discord.js';

export const name = 'rank';
export const description = 'Xem rank và level của bạn';
export const requiredRole = 'member';

export async function execute(interaction) {
  try {
    const user = await global.db.getUser(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`📊 Rank - ${interaction.user.username}`)
      .addFields(
        { name: 'Level', value: `${user.level}`, inline: true },
        { name: 'Rank', value: `${user.rank}`, inline: true },
        { name: 'Experience', value: `${user.experience} / ${user.level * 100}`, inline: true },
        { name: 'Messages', value: `${user.messages}`, inline: true }
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: 'Keep chatting to level up!' });

    return embed;
  } catch (error) {
    console.error('Error in rank command:', error);
    return {
      content: '❌ Có lỗi khi lấy rank!',
      ephemeral: true,
    };
  }
}
