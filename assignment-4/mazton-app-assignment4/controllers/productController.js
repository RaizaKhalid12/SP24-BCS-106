// ═══════════════════════════════════════════════════
//  controllers/productController.js
//  Handles GET /products — search, filter, sort,
//  and server-side pagination. Uses YOUR categories.
// ═══════════════════════════════════════════════════

const Product = require('../models/Product');

const PRODUCTS_PER_PAGE = 8;

// Your existing tab/category names from Lab Task 2
const CATEGORIES = [
  'New Launch',
  'Hair Care',
  'Skin Care',
  'Skin Brightening',
  'Serums',
  'Moisturisers',
];

exports.getProducts = async (req, res) => {
  try {
    // ── 1. Parse query params ────────────────────
    const search   = (req.query.search   || '').trim();
    const category = (req.query.category || '').trim();
    const sort     = (req.query.sort     || '').trim();
    const minRaw   = req.query.min;
    const maxRaw   = req.query.max;

    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    // ── 2. Build Mongoose filter ─────────────────
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category && CATEGORIES.includes(category)) {
      filter.category = category;
    }

    const priceFilter = {};
    if (minRaw !== undefined && minRaw !== '') {
      priceFilter.$gte = parseFloat(minRaw);
    }
    if (maxRaw !== undefined && maxRaw !== '') {
      priceFilter.$lte = parseFloat(maxRaw);
    }
    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }

    // ── 3. Build sort ────────────────────────────
    let sortObj = { createdAt: -1 }; // default
    if (sort === 'price_asc')    sortObj = { price:  1 };
    else if (sort === 'price_desc')   sortObj = { price: -1 };
    else if (sort === 'rating_desc')  sortObj = { rating: -1 };

    // ── 4. Count + paginate ──────────────────────
    const totalProducts = await Product.countDocuments(filter);
    const totalPages    = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    if (totalPages > 0 && page > totalPages) page = totalPages;

    const skip = (page - 1) * PRODUCTS_PER_PAGE;

    const products = await Product
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(PRODUCTS_PER_PAGE)
      .lean();

    // ── 5. Page numbers array for EJS ───────────
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

    // ── 6. Render ────────────────────────────────
    res.render('products', {
      title:           'All Products – Mazton Skin Solutions',
      products,
      totalProducts,
      totalPages,
      currentPage:     page,
      pageNumbers,
      categories:      CATEGORIES,
      currentSearch:   search,
      currentCategory: category,
      currentSort:     sort,
      currentMin:      minRaw || '',
      currentMax:      maxRaw || '',
    });

  } catch (err) {
    console.error('Products page error:', err);
    res.status(500).render('error', {
      title:   'Server Error – Mazton',
      message: 'Something went wrong loading products. Please try again.',
    });
  }
};

