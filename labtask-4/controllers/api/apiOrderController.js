// ═══════════════════════════════════════════════════
//  controllers/api/apiOrderController.js
//  Handles POST /api/v1/orders (JWT protected)
//  Creates order linked to authenticated user
// ═══════════════════════════════════════════════════

const mongoose = require('mongoose');
const Order    = require('../../models/Order');
const Product  = require('../../models/Product');

// ── POST /api/v1/orders ────────────────────────────
exports.createOrder = async (req, res) => {
  const { items } = req.body;

  // ── 1. Validate request body ───────────────────
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body must include "items" array with at least one item.',
      example: {
        items: [
          { product: '<product_id>', quantity: 2 },
        ],
      },
    });
  }

  // ── 2. Validate each item ──────────────────────
  for (const item of items) {
    if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
      return res.status(400).json({
        success: false,
        message: `Invalid or missing product ID: "${item.product}".`,
      });
    }
    if (!item.quantity || item.quantity < 1 || !Number.isInteger(item.quantity)) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be a positive integer. Got: "${item.quantity}".`,
      });
    }
  }

  try {
    // ── 3. Verify all products exist + get prices ──
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).lean();

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID "${item.product}" not found.`,
        });
      }

      orderItems.push({
        product:  product._id,
        quantity: item.quantity,
        price:    product.price,
      });
    }

    // ── 4. Create order linked to JWT user ─────────
    const order = await Order.create({
      user:  req.user.user_id,  // from verifyToken middleware
      items: orderItems,
    });

    // ── 5. Populate product details for response ───
    const populated = await Order
      .findById(order._id)
      .populate('items.product', 'name price category img1')
      .lean();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order:   populated,
    });

  } catch (err) {
    console.error('API Create Order error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating order.',
    });
  }
};
