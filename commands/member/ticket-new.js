import { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType
} from 'discord.js';
import * as ticketDb from '../../utils/ticket-database.js';
import { config } from '../../config.js';
import { isMember } from '../../utils/permissions.js';

export const name = 'newticket';
export const description = '🛍️ Tạo ticket mua hàng (Member)';
export const requiredRole = 'member';

export async function execute(interaction) {
  // Check: Chỉ member có thể tạo ticket
  if (!isMember(interaction.member) || interaction.member.user.bot) {
    return {
      content: '❌ Chỉ member mới có thể tạo ticket!',
      ephemeral: true,
    };
  }

  // Tạo modal form
  const modal = new ModalBuilder()
    .setCustomId('ticketForm')
    .setTitle('📋 Tạo Ticket Mua Hàng');

  // Input chủ shop (mention)
  const shopOwnerInput = new TextInputBuilder()
    .setCustomId('shopOwner')
    .setLabel('Chủ Shop (VD: @admin hoặc ID)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('@admin')
    .setRequired(true);

  // Input sản phẩm
  const productInput = new TextInputBuilder()
    .setCustomId('productName')
    .setLabel('Tên Sản Phẩm')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('VD: iPhone 15 Pro')
    .setRequired(true);

  // Input giá
  const priceInput = new TextInputBuilder()
    .setCustomId('price')
    .setLabel('Giá Sản Phẩm (VNĐ)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('VD: 25000000')
    .setRequired(true);

  // Input ghi chú
  const noteInput = new TextInputBuilder()
    .setCustomId('note')
    .setLabel('Ghi Chú (Tùy Chọn)')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('VD: Màu đen, 256GB, còn bảo hành...')
    .setRequired(false);

  // Thêm inputs vào modal
  const row1 = new ActionRowBuilder().addComponents(shopOwnerInput);
  const row2 = new ActionRowBuilder().addComponents(productInput);
  const row3 = new ActionRowBuilder().addComponents(priceInput);
  const row4 = new ActionRowBuilder().addComponents(noteInput);

  modal.addComponents(row1, row2, row3, row4);

  await interaction.showModal(modal);
}
