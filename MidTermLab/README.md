# Mazton Skin Solutions — Express + EJS App

## Lab Task Two: Converting Landing Page to Express Application

---

## Project Structure

```
mazton-skin-solutions/
│
├── app.js                   ← Entry point — Express server setup
├── package.json             ← Dependencies (express, ejs)
│
├── routes/
│   └── index.js             ← All page routes + product data
│
├── views/                   ← EJS template files
│   ├── index.ejs            ← Main landing page (uses partials + EJS loops)
│   ├── 404.ejs              ← 404 error page
│   └── partials/            ← Reusable EJS components
│       ├── head.ejs         ← <head> tag (title, CSS links)
│       ├── shippingBar.ejs  ← Free shipping announcement bar
│       ├── header.ejs       ← Site header with hamburger nav
│       ├── footer.ejs       ← Site footer
│       └── scripts.ejs      ← JS <script> tags
│
└── public/                  ← Static assets (served at root URL)
    ├── css/
    │   └── style3.css       ← All styles (responsive + hamburger)
    ├── js/
    │   └── main.js          ← Vanilla JS (tabs + hamburger)
    └── images/              ← ⚠️ Copy all your product images here
```

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Add your images
Copy **all product images** from your original project into:
```
public/images/
```
This includes: `maztonologo.jpg`, `maz1.jpg`, `maz2.jpg`, `maz3.jpg`, `maz4.jpg`,
`LumexaFacewash1_medium.jpg`, `MazClarity.jpeg`, `SunPro.jpeg`, `bundle-banner.jpg`,
and all other product images.

### 3. Run the server
```bash
# Normal start
npm start

# Development mode (auto-restart on file changes)
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

---

## How It Works (Key Concepts)

### Express serves the app
`app.js` sets up Express, configures EJS as the view engine, and mounts the routes.

### Static files live in `/public`
`app.use(express.static('public'))` tells Express to serve everything in `/public`
at the root URL. So `public/css/style3.css` is accessed as `/css/style3.css` in HTML.

### EJS partials avoid repetition
The header, footer, shipping bar, and `<head>` are each in their own `.ejs` file
and included with `<%- include('partials/header') %>`. Change once — updates everywhere.

### Product data comes from the server
In `routes/index.js`, product arrays are defined and passed to `res.render()`.
The EJS template loops over them with `<% products[tab].forEach(...) %>` to build
the product grid dynamically — no hardcoded HTML cards needed.

### JavaScript stays in its own file
`public/js/main.js` contains the tab switching and hamburger menu logic.
It is included via the `partials/scripts.ejs` partial at the bottom of every page.
