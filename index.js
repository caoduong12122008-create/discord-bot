import { Client, GatewayIntentBits, Collection, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { config } from './config.js';
import { isAdmin, isSeller, checkPermission } from './utils/permissions.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize client with intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.events = new Collection();

// Load commands
async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  const categories = fs.readdirSync(commandsPath);

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
      try {
        const filePath = path.join(categoryPath, file);
        const command = await import(`file://${filePath.replace(/\\/g, '/')}`);
        const commandModule = command.default || command;
        
        client.commands.set(commandModule.name, {
          ...commandModule,
          category,
        });
        console.log(`✅ Loaded command: ${commandModule.name} (${category})`);
      } catch (error) {
        console.error(`❌ Error loading command ${file}:`, error);
      }
    }
  }
}

// Load events
async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  const files = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of files) {
    try {
      const filePath = path.join(eventsPath, file);
      const event = await import(`file://${filePath.replace(/\\/g, '/')}`);
      const eventModule = event.default || event;

      if (eventModule.once) {
        client.once(eventModule.name, (...args) => eventModule.execute(...args));
      } else {
        client.on(eventModule.name, (...args) => eventModule.execute(...args));
      }
      console.log(`✅ Loaded event: ${eventModule.name}`);
    } catch (error) {
      console.error(`❌ Error loading event ${file}:`, error);
    }
  }
}

// Register slash commands
async function registerSlashCommands() {
  try {
    const slashCommands = [];

    client.commands.forEach((command, name) => {
      // Create slash command builders
      const builder = new SlashCommandBuilder()
        .setName(name)
        .setDescription(command.description || 'No description');

      // Add options for specific commands
      if (name === 'resetrank') {
        builder.addUserOption(option =>
          option.setName('user')
            .setDescription('User to reset rank')
            .setRequired(true)
        );
      }

      // Set permissions
      if (command.requiredRole === 'admin') {
        builder.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
      }

      slashCommands.push(builder);
    });

    const guild = await client.guilds.fetch(config.guildId);
    const commands = await guild.commands.set(slashCommands);
    console.log(`✅ Registered ${commands.size} slash commands`);
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }
}

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  // Handle modals
  if (interaction.isModalSubmit()) {
    const {
      createAddProductModal,
      createRemoveProductModal,
      createUpdateProductModal,
      handleAddProductModal,
      handleRemoveProductModal,
      handleUpdateProductModal,
    } = await import('./utils/modal-handlers.js');

    try {
      if (interaction.customId === 'ticketForm') {
        // Handle ticket creation form
        const shopOwner = interaction.fields.getTextInputValue('shopOwner');
        const productName = interaction.fields.getTextInputValue('productName');
        const price = parseInt(interaction.fields.getTextInputValue('price'));
        const note = interaction.fields.getTextInputValue('note');

        if (isNaN(price)) {
          return interaction.reply({
            content: '❌ Giá phải là số!',
            ephemeral: true,
          });
        }

        // Create ticket channel
        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}-${Date.now()}`,
          type: 0,
        });

        // Save to database
        const ticketDb = await import('./utils/ticket-database.js');
        const ticket = await ticketDb.createTicket(
          interaction.guildId,
          ticketChannel.id,
          interaction.user.id,
          shopOwner
        );

        // Add product
        const product = await ticketDb.addProduct(
          interaction.guildId,
          ticket._id.toString(),
          productName,
          price,
          note
        );

        ticket.products.push(product._id);
        ticket.totalPrice = price;
        await ticketDb.updateTicket(ticket._id, ticket);

        // Send menu to ticket channel
        const { createTicketMenu } = await import('./commands/member/ticket-menu.js');
        const menuData = await createTicketMenu(ticket);
        await ticketChannel.send(menuData);

        await interaction.reply({
          content: `✅ Ticket đã được tạo: ${ticketChannel}`,
          ephemeral: true,
        });
      } else if (interaction.customId === 'addProductModal') {
        const response = await handleAddProductModal(interaction);
        await interaction.reply(response);
      } else if (interaction.customId === 'removeProductModal') {
        const response = await handleRemoveProductModal(interaction);
        await interaction.reply(response);
      } else if (interaction.customId === 'updateProductModal') {
        const response = await handleUpdateProductModal(interaction);
        await interaction.reply(response);
      }
    } catch (error) {
      console.error('Error handling modal:', error);
      await interaction.reply({
        content: '❌ Có lỗi khi xử lý!',
        ephemeral: true,
      });
    }
    return;
  }

  if (!interaction.isCommand()) {
    // Handle buttons
    if (interaction.isButton()) {
      const {
        createAddProductModal,
        createRemoveProductModal,
        createUpdateProductModal,
      } = await import('./utils/modal-handlers.js');

      try {
        if (interaction.customId === 'add_product_btn') {
          const modal = createAddProductModal();
          await interaction.showModal(modal);
        } else if (interaction.customId === 'remove_product_btn') {
          const modal = createRemoveProductModal();
          await interaction.showModal(modal);
        } else if (interaction.customId === 'update_product_btn') {
          const modal = createUpdateProductModal();
          await interaction.showModal(modal);
        } else if (interaction.customId === 'close_ticket_btn') {
          const ticketDb = await import('./utils/ticket-database.js');
          const ticket = await ticketDb.getTicketByChannelId(interaction.channelId);

          if (!ticket) {
            return interaction.reply({
              content: '❌ Ticket không tồn tại!',
              ephemeral: true,
            });
          }

          const { EmbedBuilder } = await import('discord.js');
          const closeEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('🔒 Ticket Đã Đóng')
            .setDescription('Ticket này đã được đóng')
            .setFooter({ text: `Đóng bởi ${interaction.user.username}` });

          await interaction.channel.send({ embeds: [closeEmbed] });

          // Update ticket status
          await ticketDb.updateTicket(ticket._id, { status: 'closed' });

          // Delete channel after 3 seconds
          setTimeout(() => {
            interaction.channel.delete().catch(console.error);
          }, 3000);
        } else if (interaction.customId === 'create_ticket') {
          try {
            const ticketChannel = await interaction.guild.channels.create({
              name: `ticket-${interaction.user.username}-${Date.now()}`,
              type: 0,
            });

            const ticketEmbed = {
              color: 0x00ff00,
              title: '🎫 Ticket Mới',
              description: `Ticket được tạo bởi ${interaction.user}`,
              footer: { text: 'Admin sẽ hỗ trợ trong thời gian sớm nhất' },
            };

            await ticketChannel.send({ embeds: [ticketEmbed] });
            await interaction.reply({
              content: `✅ Ticket đã được tạo: ${ticketChannel}`,
              ephemeral: true,
            });
          } catch (error) {
            console.error('❌ Error creating ticket:', error);
            await interaction.reply({
              content: '❌ Lỗi khi tạo ticket!',
              ephemeral: true,
            });
          }
        }
      } catch (error) {
        console.error('Error handling button:', error);
        await interaction.reply({
          content: '❌ Có lỗi!',
          ephemeral: true,
        });
      }
    }
    return;
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // Permission check
  if (command.requiredRole === 'admin') {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({
        content: '❌ Bạn không có quyền sử dụng lệnh này!',
        ephemeral: true,
      });
    }
  }

  if (command.requiredRole === 'seller') {
    if (!isSeller(interaction.member)) {
      return interaction.reply({
        content: '❌ Chỉ Seller hoặc Admin mới có thể sử dụng lệnh này!',
        ephemeral: true,
      });
    }
  }

  try {
    const response = await command.execute(interaction);
    if (response) {
      await interaction.reply(response);
    }
  } catch (error) {
    console.error('❌ Error executing command:', error);
    await interaction.reply({
      content: '❌ Có lỗi khi thực thi lệnh!',
      ephemeral: true,
    });
  }
});

// Initialize database
async function initDatabase() {
  if (config.dbType === 'mongodb') {
    console.log('📊 Kết nối MongoDB...');
    try {
      const mongoDb = await import('./utils/database-mongodb.js');
      await mongoDb.connectDB();
      console.log('✅ MongoDB kết nối thành công!');
      global.db = mongoDb;
    } catch (error) {
      console.error('❌ Lỗi kết nối MongoDB:', error);
      process.exit(1);
    }
  } else {
    console.log('📄 Sử dụng JSON Database...');
    const jsonDb = await import('./utils/database.js');
    global.db = jsonDb;
  }
}

// Initialize bot
async function main() {
  try {
    console.log('🚀 Bot đang khởi động...');
    await initDatabase();
    await loadEvents();
    await loadCommands();
    
    client.login(config.token);
    
    // Register slash commands after login
    client.once('ready', async () => {
      setTimeout(() => registerSlashCommands(), 2000);
    });
  } catch (error) {
    console.error('❌ Bot startup error:', error);
    process.exit(1);
  }
}

main();
