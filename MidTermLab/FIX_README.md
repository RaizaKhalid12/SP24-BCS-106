# Fix for "Cannot find module 'express'" Error

## Problem
Node.js couldn't find Express because the `node_modules` folder
was not installed for your local Node.js version/path.

## Solution
Run these commands after unzipping:

```bash
cd mazton-midterm
npm install
npm start
```

Then open: http://localhost:3000

---

# Midterm Changes Made

## 1. AJAX Integration (jQuery)
- Added jQuery 3.7.1 via CDN in `views/partials/scripts.ejs`
- `public/js/main.js` now fetches from `https://fakestoreapi.com/products?limit=4`
- Shimmer skeleton loaders shown while data loads
- Error state with "Try Again" button on network failure

## 2. DOM Manipulation
- `#featured-deals-grid` is cleared and re-populated with API data
- Each card shows: product image, category badge, name, price, star rating, review count
- "Refresh Deals" button reloads API data live

## 3. Quick View Interaction
- Every card has a "Quick View" button
- Clicking opens a CSS/JS modal (no page refresh)
- Modal shows: full product image, full description, rating score & count
- Close via ✕ button, backdrop click, or Escape key

## 4. Responsive Design
- Grid: 4 cols (desktop) → 2 cols (tablet/mobile) → 1 col (small mobile)
- Modal stacks vertically on mobile
- Cards maintain hover effects and spacing at all breakpoints
