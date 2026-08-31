import { EmbedBuilder } from 'discord.js';
import * as ticketDb from '../../utils/ticket-database.js';
import { isSeller } from '../../utils/permissions.js';

export const name = 'addproduct';
export const description = '➕ Thêm sản phẩm vào ticket (Seller/Admin)';
export const requiredRole = 'seller';

export async function execute(interaction) {
  try {
    // Check: Chỉ seller/admin có thể thêm sản phẩm
    if (!isSeller(interaction.member)) {
      return {
        content: '❌ Chỉ Seller hoặc Admin mới có thể thêm sản phẩm!',
        ephemeral: true,
      };
    }

    // Lấy ticket info từ channel
    const ticket = await ticketDb.getTicketByChannelId(interaction.channelId);

    if (!ticket) {
      return {
        content: '❌ Ticket không tồn tại hoặc đây không phải ticket channel!',
        ephemeral: true,
      };
    }

    // Lấy input từ options
    const productName = interaction.options.getString('sản-phẩm');
    const price = interaction.options.getNumber('giá');
    const note = interaction.options.getString('ghi-chú') || '';

    // Add product vào database
    const product = await ticketDb.addProduct(
      interaction.guildId,
      ticket._id.toString(),
      productName,
      price,
      note
    );

    // Update ticket products array
    ticket.products.push(product._id);
    ticket.totalPrice += price;
    await ticketDb.updateTicket(ticket._id, ticket);

    // Tạo embed thông báo
    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('✅ Thêm Sản Phẩm Thành Công')
      .addFields(
        { name: '📦 Sản Phẩm', value: productName, inline: true },
        { name: '💰 Giá', value: `${price.toLocaleString('vi-VN')} VNĐ`, inline: true },
        { name: '📝 Ghi Chú', value: note || 'Không có' }
      )
      .setFooter({ text: `Tổng giá: ${ticket.totalPrice.toLocaleString('vi-VN')} VNĐ` });

    return embed;
  } catch (error) {
    console.error('Error in addproduct:', error);
    return {
      content: '❌ Có lỗi khi thêm sản phẩm!',
      ephemeral: true,
    };
  }
}
