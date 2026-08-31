import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { isSeller } from '../../utils/permissions.js';

export const name = 'ticketsetup';
export const description = '🏪 Setup gian hàng ticket (Seller/Admin)';
export const requiredRole = 'seller';

export async function execute(interaction) {
  try {
    // Check: Chỉ seller/admin có thể setup
    if (!isSeller(interaction.member)) {
      return {
        content: '❌ Chỉ Seller hoặc Admin mới có thể setup shop!',
        ephemeral: true,
      };
    }

    const channel = interaction.channel;

    const ticketEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('🎫 Hệ Thống Ticket Mua Hàng')
      .setDescription('Nhấp nút bên dưới để tạo ticket hỗ trợ')
      .addFields(
        { 
          name: '🛍️ Cần Mua Hàng?', 
          value: 'Hãy nhấp nút "Tạo Ticket" để liên hệ với gian hàng',
          inline: false 
        },
        {
          name: '📦 Quy Trình',
          value: '1. Tạo Ticket\n2. Chọn Sản Phẩm\n3. Chủ Shop Xác Nhận\n4. Hoàn Thành Giao Dịch',
          inline: false
        }
      )
      .setFooter({ text: `Setup bởi ${interaction.user.username}` });

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
      content: '✅ Đã setup ticket system! Khách hàng có thể bắt đầu tạo ticket.',
      ephemeral: true,
    };
  } catch (error) {
    console.error('Error in ticketsetup:', error);
    return {
      content: '❌ Có lỗi khi setup!',
      ephemeral: true,
    };
  }
}
