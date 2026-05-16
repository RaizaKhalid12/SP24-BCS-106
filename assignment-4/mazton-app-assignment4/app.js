// ═══════════════════════════════════════════════════
//  MAZTON SKIN SOLUTIONS — Express + EJS App
//  Entry point: app.js
// ═══════════════════════════════════════════════════

const express  = require('express');
const path     = require('path');
const mongoose = require('mongoose');
const session  = require('express-session');

const indexRouter    = require('./routes/index');
const productsRouter = require('./routes/products');
const adminRouter    = require('./routes/adminRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mazton';

// ── MONGODB CONNECTION ─────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── VIEW ENGINE SETUP ──────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ── STATIC FILES (CSS, JS, Images) ────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── MIDDLEWARE ─────────────────────────────────────
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ── SESSION (required for admin login) ────────────
app.use(session({
  secret:            process.env.SESSION_SECRET || 'mazton-admin-secret-key',
  resave:            false,
  saveUninitialized: false,
  cookie:            { maxAge: 1000 * 60 * 60 * 4 }, // 4 hours
}));

// ── ROUTES ─────────────────────────────────────────
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/admin', adminRouter);

// ── 404 HANDLER ───────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: '404 – Page Not Found' });
});

// ── START SERVER ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Mazton server running → http://localhost:${PORT}`);
});
