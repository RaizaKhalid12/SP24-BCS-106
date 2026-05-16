// ═══════════════════════════════════════════════════
//  models/Order.js
//  Order schema — linked to User via user_id (JWT)
// ═══════════════════════════════════════════════════

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  items: {
    type:     [orderItemSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message:   'Order must have at least one item.',
    },
  },
  totalAmount: {
    type:    Number,
    default: 0,
  },
  status: {
    type:    String,
    enum:    ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

// Auto-calculate totalAmount before saving
orderSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});

module.exports = mongoose.model('Order', orderSchema);
