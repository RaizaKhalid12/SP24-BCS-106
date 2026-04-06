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
