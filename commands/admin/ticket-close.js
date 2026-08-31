import { EmbedBuilder } from 'discord.js';

export const name = 'closeticket';
export const description = 'Đóng ticket (Admin only)';
export const requiredRole = 'admin';

export async function execute(interaction) {
  const channel = interaction.channel;

  // Check if it's a ticket channel
  if (!channel.name.startsWith('ticket-')) {
    return {
      content: '❌ Lệnh này chỉ có thể dùng trong ticket channel!',
      ephemeral: true,
    };
  }

  const closeEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('🎫 Ticket Đã Đóng')
    .setDescription('Ticket này đã bị đóng bởi admin')
    .setFooter({ text: `Đóng bởi ${interaction.user.username}` });

  await channel.send({ embeds: [closeEmbed] });

  // Delete channel after 3 seconds
  setTimeout(() => {
    channel.delete().catch(console.error);
  }, 3000);

  return null;
}
