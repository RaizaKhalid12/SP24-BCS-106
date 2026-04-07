// ═══════════════════════════════════════════════════
//  public/js/main.js
//  Vanilla JavaScript — no libraries or frameworks
// ═══════════════════════════════════════════════════

// ── TAB SWITCHING ────────────────────────────────
document.querySelectorAll('.tab-button').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-button').forEach(function (b) {
      b.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(function (c) {
      c.classList.remove('active');
    });
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ── HAMBURGER MENU ───────────────────────────────
var hamburgerBtn = document.getElementById('hamburgerBtn');
var navMenu      = document.getElementById('navMenu');

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('nav-open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    hamburgerBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  // BONUS: close menu when a nav link is clicked
  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('nav-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.innerHTML = '&#9776;';
    });
  });

  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      navMenu.classList.remove('nav-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.innerHTML = '&#9776;';
    }
  });
}

// ══════════════════════════════════════════════════════════════
//  FEATURED DEALS — jQuery AJAX + DOM Manipulation + Modal
// ══════════════════════════════════════════════════════════════

// Helper: render star string
function renderStars(rating) {
  var full  = Math.round(rating);
  var stars = '';
  for (var i = 0; i < full; i++)     stars += '&#9733;';
  for (var i = full; i < 5; i++)     stars += '&#9734;';
  return stars;
}

// Helper: format price from API (price is USD number)
function formatPrice(price) {
  return '$' + parseFloat(price).toFixed(2);
}

// Load deals via AJAX
function loadFeaturedDeals() {
  var $grid = $('#featured-deals-grid');

  // Show skeletons while loading
  $grid.html(
    '<div class="deal-skeleton"></div>' +
    '<div class="deal-skeleton"></div>' +
    '<div class="deal-skeleton"></div>' +
    '<div class="deal-skeleton"></div>'
  );

  $.ajax({
    url: 'https://fakestoreapi.com/products?limit=4',
    method: 'GET',
    dataType: 'json',
    timeout: 8000,
    success: function(products) {
      $grid.empty();

      if (!products || products.length === 0) {
        $grid.html('<div class="deals-error">No products found.</div>');
        return;
      }

      $.each(products, function(i, p) {
        var stars    = renderStars(p.rating.rate);
        var discount = [10, 15, 20, 25][i % 4]; // visual badge

        var $card = $(
          '<div class="deal-card" data-id="' + p.id + '">' +
            '<div class="deal-card-img-wrap">' +
              '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy">' +
              '<span class="deal-badge">-' + discount + '%</span>' +
            '</div>' +
            '<div class="deal-card-body">' +
              '<p class="deal-category">' + p.category + '</p>' +
              '<p class="deal-name">'     + p.title    + '</p>' +
              '<p class="deal-price">'    + formatPrice(p.price) + '</p>' +
              '<p class="deal-rating">'   + stars +
                '<span class="count">(' + p.rating.count + ' reviews)</span>' +
              '</p>' +
              '<div class="deal-actions">' +
                '<button class="deal-cart-btn">Add to Cart</button>' +
                '<button class="deal-quickview-btn" ' +
                  'data-id="'    + p.id          + '" ' +
                  'data-name="'  + $('<div>').text(p.title).html()       + '" ' +
                  'data-price="' + p.price        + '" ' +
                  'data-img="'   + p.image        + '" ' +
                  'data-cat="'   + p.category     + '" ' +
                  'data-rate="'  + p.rating.rate  + '" ' +
                  'data-count="' + p.rating.count + '" ' +
                  'data-desc="'  + $('<div>').text(p.description).html() + '">' +
                  '&#128269; Quick View' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>'
        );

        $grid.append($card);
      });
    },
    error: function() {
      $grid.html(
        '<div class="deals-error">' +
          '&#9888; Unable to load deals right now. Please check your connection.' +
          '<br><button onclick="loadFeaturedDeals()">Try Again</button>' +
        '</div>'
      );
    }
  });
}

// ── MODAL open/close ──────────────────────────────────────────
$(document).on('click', '.deal-quickview-btn', function() {
  var $btn  = $(this);
  var name  = $btn.attr('data-name');
  var price = $btn.attr('data-price');
  var img   = $btn.attr('data-img');
  var cat   = $btn.attr('data-cat');
  var rate  = parseFloat($btn.attr('data-rate'));
  var count = $btn.attr('data-count');
  var desc  = $btn.attr('data-desc');

  var stars = renderStars(rate);

  $('#modal-category').text(cat.toUpperCase());
  $('#modal-name').text(name);
  $('#modal-price').text(formatPrice(price));
  $('#modal-stars').html(stars);
  $('#modal-rating-score').text(rate.toFixed(1) + ' / 5');
  $('#modal-rating-count').text('(' + count + ' reviews)');
  $('#modal-desc').text(desc);
  $('#modal-img').attr({ src: img, alt: name });

  $('#quickview-modal').addClass('open');
  $('body').css('overflow', 'hidden');
});

// Close on X button
$(document).on('click', '#modal-close-btn', function() {
  $('#quickview-modal').removeClass('open');
  $('body').css('overflow', '');
});

// Close on backdrop click
$(document).on('click', '#quickview-modal', function(e) {
  if ($(e.target).is('#quickview-modal')) {
    $('#quickview-modal').removeClass('open');
    $('body').css('overflow', '');
  }
});

// Close on Escape key
$(document).on('keydown', function(e) {
  if (e.key === 'Escape') {
    $('#quickview-modal').removeClass('open');
    $('body').css('overflow', '');
  }
});

// Reload button
$(document).on('click', '#reload-deals-btn', function() {
  loadFeaturedDeals();
});

// ── Init on DOM ready ─────────────────────────────────────────
$(document).ready(function() {
  if ($('#featured-deals-grid').length) {
    loadFeaturedDeals();
  }
});
