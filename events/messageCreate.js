export const name = 'messageCreate';

export async function execute(message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Add experience for every message
  try {
    await global.db.addExperience(message.author.id);
  } catch (error) {
    console.error('Error adding experience:', error);
  }

  // Check for QR code trigger
  if (message.content.includes('Dunozzqr')) {
    try {
      const qrModule = await import('../commands/member/qr.js');
      const qrCommand = qrModule.default || qrModule;
      const qrResponse = await qrCommand.execute(message);
      if (qrResponse) {
        message.reply(qrResponse).catch(console.error);
      }
    } catch (error) {
      console.error('Error sending QR code:', error);
    }
  }
}
