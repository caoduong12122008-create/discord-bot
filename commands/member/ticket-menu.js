import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import * as ticketDb from '../../utils/ticket-database.js';
import { isSeller } from '../../utils/permissions.js';

export const name = 'ticketmenu';
export const description = '📋 Hiển thị menu ticket (Seller/Admin)';
export const requiredRole = 'seller';

async function createTicketMenu(ticket) {
  // Tính tổng giá
  let totalPrice = 0;
  let productList = '';

  if (ticket.products && ticket.products.length > 0) {
    ticket.products.forEach((product, index) => {
      productList += `**${index + 1}. ${product.productName}**\n`;
      productList += `   💰 Giá: ${product.price.toLocaleString('vi-VN')} VNĐ\n`;
      if (product.note) {
        productList += `   📝 Ghi chú: ${product.note}\n`;
      }
      productList += `   🔑 ID: \`${product._id}\`\n\n`;
      totalPrice += product.price;
    });
  } else {
    productList = '*Chưa có sản phẩm*';
  }

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('🛍️ MENU TICKET MUA HÀNG')
    .addFields(
      {
        name: '👤 Người Mua',
        value: `<@${ticket.userId}>`,
        inline: true,
      },
      {
        name: '🏪 Chủ Shop',
        value: ticket.shopOwnerId ? `<@${ticket.shopOwnerId}>` : 'Chưa xác định',
        inline: true,
      },
      {
        name: '📦 Danh Sách Sản Phẩm',
        value: productList,
        inline: false,
      },
      {
        name: '💰 Tổng Giá',
        value: `**${totalPrice.toLocaleString('vi-VN')} VNĐ**`,
        inline: false,
      }
    )
    .setFooter({ text: `Ticket ID: ${ticket._id}` })
    .setTimestamp();

  // Buttons
  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('add_product_btn')
      .setLabel('➕ Thêm Sản Phẩm')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('remove_product_btn')
      .setLabel('❌ Xóa Sản Phẩm')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('update_product_btn')
      .setLabel('✏️ Cập Nhật Giá')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('close_ticket_btn')
      .setLabel('🔒 Đóng Ticket')
      .setStyle(ButtonStyle.Secondary)
  );

  return { embeds: [embed], components: [buttons] };
}

export async function execute(interaction) {
  try {
    // Check: Chỉ seller/admin có thể xem menu
    if (!isSeller(interaction.member)) {
      return {
        content: '❌ Chỉ Seller hoặc Admin mới có thể xem menu!',
        ephemeral: true,
      };
    }

    const ticket = await ticketDb.getTicketByChannelId(interaction.channelId);

    if (!ticket) {
      return {
        content: '❌ Ticket không tồn tại!',
        ephemeral: true,
      };
    }

    const menuData = await createTicketMenu(ticket);
    return menuData;
  } catch (error) {
    console.error('Error in ticketmenu:', error);
    return {
      content: '❌ Có lỗi khi hiển thị menu!',
      ephemeral: true,
    };
  }
}

export { createTicketMenu };
