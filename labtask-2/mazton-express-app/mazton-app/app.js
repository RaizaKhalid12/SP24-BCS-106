// ═══════════════════════════════════════════════════
//  MAZTON SKIN SOLUTIONS — Express + EJS App
//  Entry point: app.js
// ═══════════════════════════════════════════════════

const express = require('express');
const path    = require('path');

const indexRouter = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── VIEW ENGINE SETUP ──────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ── STATIC FILES (CSS, JS, Images) ────────────────
// Everything inside /public is served at the root URL.
// e.g. /public/css/style3.css  →  accessible as  /css/style3.css
app.use(express.static(path.join(__dirname, 'public')));

// ── MIDDLEWARE ─────────────────────────────────────
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ── ROUTES ────────────────────────────────────────
app.use('/', indexRouter);

// ── 404 HANDLER ───────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: '404 – Page Not Found' });
});

// ── START SERVER ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Mazton server running → http://localhost:${PORT}`);
});
