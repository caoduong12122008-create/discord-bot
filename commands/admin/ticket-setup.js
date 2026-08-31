import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } from 'discord.js';
import { config } from '../../config.js';

export const name = 'ticketsetup';
export const description = 'Setup ticket system (Admin only)';
export const requiredRole = 'admin';

export async function execute(interaction) {
  const channel = interaction.channel;

  const ticketEmbed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle('🎫 Hệ Thống Ticket')
    .setDescription('Nhấp nút bên dưới để tạo ticket hỗ trợ')
    .addFields(
      { name: 'Cần Giúp Đỡ?', value: 'Hãy nhấp nút "Tạo Ticket" để liên hệ với admin' }
    );

  const ticketButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('🎫 Tạo Ticket')
      .setStyle(ButtonStyle.Success)
  );

  await channel.send({
    embeds: [ticketEmbed],
    components: [ticketButton],
  });

  return {
    content: '✅ Đã setup ticket system!',
    ephemeral: true,
  };
}
