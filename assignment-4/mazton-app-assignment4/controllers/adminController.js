// ═══════════════════════════════════════════════════
//  controllers/adminController.js
//  Handles all admin CRUD operations for products
// ═══════════════════════════════════════════════════

const Product = require('../models/Product');

const CATEGORIES = [
  'New Launch',
  'Hair Care',
  'Skin Care',
  'Skin Brightening',
  'Serums',
  'Moisturisers',
];

// ── GET /admin ─────────────────────────────────────
// Dashboard: list all products in a table
exports.getDashboard = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.render('admin/dashboard', {
      title:    'Admin Dashboard – Mazton',
      products,
      success:  req.query.success || null,
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).render('admin/error', {
      title:   'Admin Error – Mazton',
      message: 'Could not load products.',
    });
  }
};

// ── GET /admin/login ───────────────────────────────
exports.getLogin = (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    title: 'Admin Login – Mazton',
    error: null,
  });
};

// ── GET /admin/logout ──────────────────────────────
exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

// ── GET /admin/products/new ────────────────────────
exports.getNewProduct = (req, res) => {
  res.render('admin/product-form', {
    title:      'Add Product – Mazton Admin',
    product:    null,      // null = create mode
    categories: CATEGORIES,
    errors:     [],
    formAction: '/admin/products/new',
  });
};

// ── POST /admin/products/new ───────────────────────
exports.postNewProduct = async (req, res) => {
  const errors = validateProduct(req.body);

  if (errors.length > 0) {
    // Delete uploaded file if validation fails
    if (req.file) deleteFile(req.file.path);
    return res.render('admin/product-form', {
      title:      'Add Product – Mazton Admin',
      product:    req.body,
      categories: CATEGORIES,
      errors,
      formAction: '/admin/products/new',
    });
  }

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    await Product.create({
      name:     req.body.name.trim(),
      price:    parseFloat(req.body.price),
      category: req.body.category,
      rating:   parseFloat(req.body.rating),
      stock:    parseInt(req.body.stock),
      img1:     imagePath,
      img2:     imagePath, // same image for both slots
      reviews:  0,
    });

    res.redirect('/admin?success=Product+added+successfully');
  } catch (err) {
    console.error('Create product error:', err);
    if (req.file) deleteFile(req.file.path);
    res.render('admin/product-form', {
      title:      'Add Product – Mazton Admin',
      product:    req.body,
      categories: CATEGORIES,
      errors:     ['Failed to save product. Please try again.'],
      formAction: '/admin/products/new',
    });
  }
};

// ── GET /admin/products/edit/:id ───────────────────
exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).render('admin/error', {
        title:   'Not Found – Mazton Admin',
        message: 'Product not found.',
      });
    }
    res.render('admin/product-form', {
      title:      'Edit Product – Mazton Admin',
      product,
      categories: CATEGORIES,
      errors:     [],
      formAction: `/admin/products/edit/${product._id}`,
    });
  } catch (err) {
    console.error('Edit product fetch error:', err);
    res.status(500).render('admin/error', {
      title:   'Admin Error – Mazton',
      message: 'Could not load product for editing.',
    });
  }
};

// ── POST /admin/products/edit/:id ──────────────────
exports.postEditProduct = async (req, res) => {
  const errors = validateProduct(req.body, /* imageRequired = */ false);

  if (errors.length > 0) {
    if (req.file) deleteFile(req.file.path);
    return res.render('admin/product-form', {
      title:      'Edit Product – Mazton Admin',
      product:    { ...req.body, _id: req.params.id },
      categories: CATEGORIES,
      errors,
      formAction: `/admin/products/edit/${req.params.id}`,
    });
  }

  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).render('admin/error', {
        title:   'Not Found – Mazton Admin',
        message: 'Product not found.',
      });
    }

    const updateData = {
      name:     req.body.name.trim(),
      price:    parseFloat(req.body.price),
      category: req.body.category,
      rating:   parseFloat(req.body.rating),
      stock:    parseInt(req.body.stock),
    };

    // Only update image if a new one was uploaded
    if (req.file) {
      updateData.img1 = `/uploads/${req.file.filename}`;
      updateData.img2 = `/uploads/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });

    res.redirect('/admin?success=Product+updated+successfully');
  } catch (err) {
    console.error('Update product error:', err);
    if (req.file) deleteFile(req.file.path);
    res.render('admin/product-form', {
      title:      'Edit Product – Mazton Admin',
      product:    { ...req.body, _id: req.params.id },
      categories: CATEGORIES,
      errors:     ['Failed to update product. Please try again.'],
      formAction: `/admin/products/edit/${req.params.id}`,
    });
  }
};

// ── POST /admin/products/delete/:id ───────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('admin/error', {
        title:   'Not Found – Mazton Admin',
        message: 'Product not found.',
      });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin?success=Product+deleted+successfully');
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).render('admin/error', {
      title:   'Admin Error – Mazton',
      message: 'Could not delete product.',
    });
  }
};

// ══════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════

function validateProduct(body, imageRequired = false) {
  const errors = [];

  if (!body.name || body.name.trim() === '')
    errors.push('Product name is required.');

  if (!body.price || isNaN(parseFloat(body.price)) || parseFloat(body.price) < 0)
    errors.push('A valid price is required (e.g. 1250).');

  if (!body.category || body.category.trim() === '')
    errors.push('Category is required.');

  const rating = parseFloat(body.rating);
  if (!body.rating || isNaN(rating) || rating < 0 || rating > 5)
    errors.push('Rating must be a number between 0 and 5.');

  if (!body.stock || isNaN(parseInt(body.stock)) || parseInt(body.stock) < 0)
    errors.push('Stock must be a whole number (0 or more).');

  return errors;
}

function deleteFile(filePath) {
  const fs = require('fs');
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.warn('Could not delete file:', filePath);
  }
}
