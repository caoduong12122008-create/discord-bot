// Product schema cho MongoDB
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  ticketId: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// Ticket schema
const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  ticketChannelId: { type: String, required: true },
  userId: { type: String, required: true },
  shopOwnerId: { type: String },
  totalPrice: { type: Number, default: 0 },
  status: { type: String, default: 'open' }, // open, closed, completed
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Product functions
export const addProduct = async (guildId, ticketId, productName, price, note = '') => {
  try {
    const product = new Product({
      guildId,
      ticketId,
      productName,
      price,
      note,
    });
    await product.save();
    return product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getProductsByTicket = async (ticketId) => {
  try {
    return await Product.find({ ticketId });
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const updateProduct = async (productId, updates) => {
  try {
    return await Product.findByIdAndUpdate(productId, updates, { new: true });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    return await Product.findByIdAndDelete(productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Ticket functions
export const createTicket = async (guildId, ticketChannelId, userId, shopOwnerId) => {
  try {
    const ticket = new Ticket({
      guildId,
      ticketChannelId,
      userId,
      shopOwnerId,
    });
    await ticket.save();
    return ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const getTicketByChannelId = async (channelId) => {
  try {
    return await Ticket.findOne({ ticketChannelId: channelId }).populate('products');
  } catch (error) {
    console.error('Error getting ticket:', error);
    throw error;
  }
};

export const updateTicket = async (ticketId, updates) => {
  try {
    return await Ticket.findByIdAndUpdate(ticketId, updates, { new: true }).populate('products');
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

export default {
  addProduct,
  getProductsByTicket,
  updateProduct,
  deleteProduct,
  createTicket,
  getTicketByChannelId,
  updateTicket,
};
