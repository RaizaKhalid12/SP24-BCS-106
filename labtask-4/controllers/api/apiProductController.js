// ═══════════════════════════════════════════════════
//  controllers/api/apiProductController.js
//  Handles:
//    GET /api/v1/products       — list with filters
//    GET /api/v1/products/:id   — single product
//
//  Supports ALL existing filters:
//    ?page, ?search, ?category, ?min, ?max, ?sort
// ═══════════════════════════════════════════════════

const mongoose = require('mongoose');
const Product  = require('../../models/Product');

const PRODUCTS_PER_PAGE = 8;

const CATEGORIES = [
  'New Launch',
  'Hair Care',
  'Skin Care',
  'Skin Brightening',
  'Serums',
  'Moisturisers',
];

// ── GET /api/v1/products ───────────────────────────
exports.getApiProducts = async (req, res) => {
  try {
    // ── 1. Parse query params ──────────────────
    const search   = (req.query.search   || '').trim();
    const category = (req.query.category || '').trim();
    const sort     = (req.query.sort     || '').trim();
    const minRaw   = req.query.min;
    const maxRaw   = req.query.max;

    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // ── 2. Build Mongoose filter ───────────────
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category && CATEGORIES.includes(category)) {
      filter.category = category;
    }

    const priceFilter = {};
    if (minRaw !== undefined && minRaw !== '') {
      const min = parseFloat(minRaw);
      if (!isNaN(min)) priceFilter.$gte = min;
    }
    if (maxRaw !== undefined && maxRaw !== '') {
      const max = parseFloat(maxRaw);
      if (!isNaN(max)) priceFilter.$lte = max;
    }
    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }

    // ── 3. Build sort ──────────────────────────
    let sortObj = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc')   sortObj = { price:  1 };
    else if (sort === 'price_desc')  sortObj = { price: -1 };
    else if (sort === 'rating_desc') sortObj = { rating: -1 };

    // ── 4. Count + paginate ────────────────────
    const totalProducts = await Product.countDocuments(filter);
    const totalPages    = Math.ceil(totalProducts / PRODUCTS_PER_PAGE) || 1;

    if (page > totalPages) page = totalPages;

    const skip     = (page - 1) * PRODUCTS_PER_PAGE;
    const products = await Product
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(PRODUCTS_PER_PAGE)
      .lean();

    // ── 5. Return JSON ─────────────────────────
    return res.status(200).json({
      success:    true,
      totalProducts,
      totalPages,
      currentPage: page,
      perPage:    PRODUCTS_PER_PAGE,
      filters: {
        search:   search   || null,
        category: category || null,
        sort:     sort     || 'newest',
        min:      minRaw   || null,
        max:      maxRaw   || null,
      },
      products,
    });

  } catch (err) {
    console.error('API Products error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products.',
    });
  }
};

// ── GET /api/v1/products/:id ───────────────────────
exports.getApiProductById = async (req, res) => {
  const { id } = req.params;

  // ── 1. Validate MongoDB ObjectId ──────────────
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid product ID: "${id}". Must be a valid MongoDB ObjectId.`,
    });
  }

  try {
    const product = await Product.findById(id).lean();

    // ── 2. Not found ───────────────────────────
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID "${id}" not found.`,
      });
    }

    // ── 3. Return product ──────────────────────
    return res.status(200).json({
      success: true,
      product,
    });

  } catch (err) {
    console.error('API Product by ID error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product.',
    });
  }
};
