import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
} from 'discord.js';
import * as ticketDb from './ticket-database.js';

// Modal: Add Product
export function createAddProductModal() {
  const modal = new ModalBuilder()
    .setCustomId('addProductModal')
    .setTitle('➕ Thêm Sản Phẩm');

  const productInput = new TextInputBuilder()
    .setCustomId('productName')
    .setLabel('Tên Sản Phẩm')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('VD: iPhone 15 Pro')
    .setRequired(true);

  const priceInput = new TextInputBuilder()
    .setCustomId('price')
    .setLabel('Giá (VNĐ)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('VD: 25000000')
    .setRequired(true);

  const noteInput = new TextInputBuilder()
    .setCustomId('note')
    .setLabel('Ghi Chú')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Màu, phiên bản, tình trạng...')
    .setRequired(false);

  const row1 = new ActionRowBuilder().addComponents(productInput);
  const row2 = new ActionRowBuilder().addComponents(priceInput);
  const row3 = new ActionRowBuilder().addComponents(noteInput);

  modal.addComponents(row1, row2, row3);
  return modal;
}

// Modal: Remove Product
export function createRemoveProductModal() {
  const modal = new ModalBuilder()
    .setCustomId('removeProductModal')
    .setTitle('❌ Xóa Sản Phẩm');

  const productIdInput = new TextInputBuilder()
    .setCustomId('productId')
    .setLabel('ID Sản Phẩm (từ menu)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Dán ID sản phẩm vào đây')
    .setRequired(true);

  const row1 = new ActionRowBuilder().addComponents(productIdInput);
  modal.addComponents(row1);
  return modal;
}

// Modal: Update Product
export function createUpdateProductModal() {
  const modal = new ModalBuilder()
    .setCustomId('updateProductModal')
    .setTitle('✏️ Cập Nhật Sản Phẩm');

  const productIdInput = new TextInputBuilder()
    .setCustomId('productId')
    .setLabel('ID Sản Phẩm')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Dán ID sản phẩm')
    .setRequired(true);

  const priceInput = new TextInputBuilder()
    .setCustomId('newPrice')
    .setLabel('Giá Mới (VNĐ)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('VD: 20000000')
    .setRequired(true);

  const noteInput = new TextInputBuilder()
    .setCustomId('newNote')
    .setLabel('Ghi Chú Mới')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

  const row1 = new ActionRowBuilder().addComponents(productIdInput);
  const row2 = new ActionRowBuilder().addComponents(priceInput);
  const row3 = new ActionRowBuilder().addComponents(noteInput);

  modal.addComponents(row1, row2, row3);
  return modal;
}

// Handle Add Product Modal
export async function handleAddProductModal(interaction) {
  try {
    const productName = interaction.fields.getTextInputValue('productName');
    const price = parseInt(interaction.fields.getTextInputValue('price'));
    const note = interaction.fields.getTextInputValue('note') || '';

    if (isNaN(price)) {
      return {
        content: '❌ Giá phải là số!',
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

    const product = await ticketDb.addProduct(
      interaction.guildId,
      ticket._id.toString(),
      productName,
      price,
      note
    );

    ticket.products.push(product._id);
    ticket.totalPrice += price;
    await ticketDb.updateTicket(ticket._id, ticket);

    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('✅ Thêm Sản Phẩm Thành Công')
      .addFields(
        { name: '📦 Sản Phẩm', value: productName, inline: true },
        { name: '💰 Giá', value: `${price.toLocaleString('vi-VN')} VNĐ`, inline: true },
        { name: '📝 Ghi Chú', value: note || 'Không có' }
      )
      .setFooter({ text: `Tổng: ${ticket.totalPrice.toLocaleString('vi-VN')} VNĐ` });

    return { embeds: [embed] };
  } catch (error) {
    console.error('Error handling add product modal:', error);
    return {
      content: '❌ Có lỗi khi thêm sản phẩm!',
      ephemeral: true,
    };
  }
}

// Handle Remove Product Modal
export async function handleRemoveProductModal(interaction) {
  try {
    const productId = interaction.fields.getTextInputValue('productId');

    const ticket = await ticketDb.getTicketByChannelId(interaction.channelId);
    if (!ticket) {
      return {
        content: '❌ Ticket không tồn tại!',
        ephemeral: true,
      };
    }

    const product = await ticketDb.deleteProduct(productId);
    if (!product) {
      return {
        content: '❌ Sản phẩm không tồn tại!',
        ephemeral: true,
      };
    }

    ticket.totalPrice -= product.price;
    ticket.products = ticket.products.filter(
      (id) => id.toString() !== productId
    );
    await ticketDb.updateTicket(ticket._id, ticket);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('✅ Xóa Sản Phẩm Thành Công')
      .addFields(
        { name: '📦 Sản Phẩm', value: product.productName, inline: true },
        { name: '💰 Giá', value: `${product.price.toLocaleString('vi-VN')} VNĐ`, inline: true }
      )
      .setFooter({ text: `Tổng: ${ticket.totalPrice.toLocaleString('vi-VN')} VNĐ` });

    return { embeds: [embed] };
  } catch (error) {
    console.error('Error handling remove product modal:', error);
    return {
      content: '❌ Có lỗi khi xóa sản phẩm!',
      ephemeral: true,
    };
  }
}

// Handle Update Product Modal
export async function handleUpdateProductModal(interaction) {
  try {
    const productId = interaction.fields.getTextInputValue('productId');
    const newPrice = parseInt(interaction.fields.getTextInputValue('newPrice'));
    const newNote = interaction.fields.getTextInputValue('newNote') || '';

    if (isNaN(newPrice)) {
      return {
        content: '❌ Giá phải là số!',
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

    const oldProduct = ticket.products.find((p) => p._id.toString() === productId);
    if (!oldProduct) {
      return {
        content: '❌ Sản phẩm không tồn tại!',
        ephemeral: true,
      };
    }

    const oldPrice = oldProduct.price;
    const product = await ticketDb.updateProduct(productId, {
      price: newPrice,
      note: newNote,
    });

    ticket.totalPrice = ticket.totalPrice - oldPrice + newPrice;
    await ticketDb.updateTicket(ticket._id, ticket);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('✅ Cập Nhật Sản Phẩm Thành Công')
      .addFields(
        { name: '📦 Sản Phẩm', value: product.productName },
        {
          name: '💰 Giá',
          value: `${oldPrice.toLocaleString('vi-VN')} → ${newPrice.toLocaleString('vi-VN')} VNĐ`,
          inline: true,
        },
        { name: '📝 Ghi Chú', value: newNote || 'Không có' }
      )
      .setFooter({ text: `Tổng: ${ticket.totalPrice.toLocaleString('vi-VN')} VNĐ` });

    return { embeds: [embed] };
  } catch (error) {
    console.error('Error handling update product modal:', error);
    return {
      content: '❌ Có lỗi khi cập nhật sản phẩm!',
      ephemeral: true,
    };
  }
}
