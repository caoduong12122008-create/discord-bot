import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { config } from '../../config.js';

export const name = 'qr';
export const description = 'Gửi hình QR code';
export const requiredRole = 'member';
export const trigger = 'Dunozzqr'; // Message trigger

export async function execute(message) {
  if (!config.qrCodeUrl) {
    return message.reply('❌ QR Code chưa được cấu hình!');
  }

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('📱 QR Code')
    .setImage(config.qrCodeUrl)
    .setFooter({ text: 'Scan để kết nối' });

  return { embeds: [embed] };
}
