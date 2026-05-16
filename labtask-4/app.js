// ═══════════════════════════════════════════════════
//  MAZTON SKIN SOLUTIONS — Express + EJS App
//  Entry point: app.js
// ═══════════════════════════════════════════════════

// ── Load environment variables (.env) ─────────────
require('dotenv').config();

const express      = require('express');
const path         = require('path');
const mongoose     = require('mongoose');
const session      = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash        = require('connect-flash');

const indexRouter    = require('./routes/index');
const productsRouter = require('./routes/products');
const adminRouter    = require('./routes/adminRoutes');
const authRouter     = require('./routes/authRoutes');   // ← NEW
const apiRouter      = require('./routes/api/index');    // ← LAB 4: JWT API

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

// ── BODY PARSING ───────────────────────────────────
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ── SESSION (stored in MongoDB for persistence) ────
app.use(session({
  secret:            process.env.SESSION_SECRET || 'mazton-secret-key-2024',
  resave:            false,
  saveUninitialized: false,
  store:             MongoStore.create({
    mongoUrl:       MONGO_URI,
    collectionName: 'sessions',
    ttl:            60 * 60 * 4,
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 4 },
}));

// ── FLASH MESSAGES ─────────────────────────────────
app.use(flash());

// ── GLOBAL LOCALS — available in every EJS view ───
app.use((req, res, next) => {
  res.locals.currentUser  = req.session.userId ? {
    id:   req.session.userId,
    name: req.session.userName,
    role: req.session.userRole,
  } : null;
  res.locals.isAdmin      = req.session.userRole === 'admin';
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError   = req.flash('error');
  next();
});

// ── ROUTES ─────────────────────────────────────────
// ── LAB 4: JWT API (must be mounted BEFORE EJS routes) ──
app.use('/api/v1', apiRouter);      // /api/v1/**  (JSON, JWT auth)

app.use('/', authRouter);           // /login  /register  /logout  /profile
app.use('/', indexRouter);          // / and /category/:tab
app.use('/products', productsRouter);
app.use('/admin', adminRouter);     // /admin/** (protected inside by isAdmin)

// ── 404 HANDLER ───────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: '404 – Page Not Found' });
});

// ── START SERVER ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Mazton server running → http://localhost:${PORT}`);
});
