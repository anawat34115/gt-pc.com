/*
  main.js — i18n-aware component loader
  - Detects language from URL prefix (/en/, /zh/, etc.)
  - Loads navbar.html and footer.html from /components/<lang>/
  - Keeps logic self-contained and robust across nested pages
*/

// ------------------------------
// Language detection
// ------------------------------
const detectLang = () => {
  const seg = window.location.pathname
    .split('/')
    .filter(Boolean); // remove empty
  const cand = seg.length ? seg[0].toLowerCase() : '';
  // Add supported languages here
  const supported = ['en', 'zh', 'th'];
  if (supported.includes(cand)) return cand;
  // Default language
  return 'th';
};

const LANG = detectLang();
const COMPONENT_BASE = `/components/${LANG}/`;

// ------------------------------
// Utils
// ------------------------------
const byId = (id) => document.getElementById(id);

const safeFetchText = async (url) => {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
};

const injectHTML = (el, html, fallbackMsg) => {
  if (!el) return;
  el.innerHTML = html || `<p style="color:red; text-align:center;">${fallbackMsg || 'Failed to load content.'}</p>`;
};

// ------------------------------
// Component loader
// ------------------------------
const loadComponent = async (placeholderId, fileName, onLoaded) => {
  const host = byId(placeholderId);
  if (!host) return; // page may not have this placeholder
  try {
    const html = await safeFetchText(`${COMPONENT_BASE}${fileName}`);
    injectHTML(host, html);
    if (typeof onLoaded === 'function') onLoaded(host);
  } catch (err) {
    console.error(`Error loading ${fileName}:`, err);
    injectHTML(host, '', `Failed to load ${fileName}.`);
  }
};

// ------------------------------
// Navbar behaviors (optional; adapt to your markup)
// ------------------------------
const enhanceNavbar = (navbarRoot) => {
  if (!navbarRoot) return;

  // Example: mobile menu toggle
  const menuBtn = navbarRoot.querySelector('[data-toggle="mobile-menu"]');
  const mobileMenu = navbarRoot.querySelector('#mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Example: close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Language switchers (buttons/links with .lang-btn and data-lang="en|th|zh")
  navbarRoot.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const toLang = (btn.dataset.lang || '').toLowerCase();
      routeToLanguage(toLang);
    });
  });

  // Optional: set active state for current language switcher
  const activeBtn = navbarRoot.querySelector(`.lang-btn[data-lang="${LANG}"]`);
  if (activeBtn) {
    activeBtn.setAttribute('aria-current', 'true');
  }
};

// ------------------------------
// Language routing
// ------------------------------
const routeToLanguage = (toLang) => {
  const supported = ['en', 'zh', 'th'];
  if (!supported.includes(toLang)) toLang = 'th';

  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);

  // If current path already has a lang prefix, replace it
  if (parts.length && supported.includes(parts[0])) {
    parts[0] = toLang;
  } else {
    // Otherwise, prepend for non-default (th) or leave root for th
    if (toLang === 'th') {
      // Keep as-is for Thai (default root)
    } else {
      parts.unshift(toLang);
    }
  }

  // Preserve current filename; if empty, assume index.html
  let last = parts[parts.length - 1] || '';
  if (!last || last.endsWith('/')) last += 'index.html';

  // Build new path
  const newPath = '/' + parts.join('/');
  window.location.href = newPath;
};

// ------------------------------
// Boot
// ------------------------------
(async () => {
  // Load Navbar, then enhance behaviors
  await loadComponent('navbar-placeholder', 'navbar.html', enhanceNavbar);

  // Load Footer
  await loadComponent('footer-placeholder', 'footer.html');

  // You may add more shared components here (e.g., cookie banner, modals)
})();
