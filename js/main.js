/*
  main.js — i18n-aware component loader (Drop-in Fix v2)
  - No need to move your existing /components/footer.html (Thai default).
  - English (and other langs) will load from /components/<lang>/footer.html if present.
  - Works under subfolders (uses document.baseURI for relative resolution).
  - Adds detailed console logs to debug quickly.
*/

// ------------------------------
// Language detection
// ------------------------------
const SUPPORTED_LANGS = ['th', 'en', 'zh'];

const detectLang = () => {
  const seg = window.location.pathname.split('/').filter(Boolean);
  const cand = seg.length ? seg[0].toLowerCase() : '';
  if (SUPPORTED_LANGS.includes(cand)) return cand;
  return 'th'; // default
};

const LANG = detectLang();

// Small helper to build URLs safely even if site is hosted under a subdirectory
const buildUrl = (relativePath) => new URL(relativePath.replace(/^\//, ''), document.baseURI).toString();

const byId = (id) => document.getElementById(id);

const safeFetchText = async (url) => {
  const res = await fetch(url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(), { cache: 'no-cache' });
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
const loadComponent = async (placeholderId, candidates, onLoaded) => {
  // candidates: array of relative paths, try in order until one works
  const host = byId(placeholderId);
  if (!host) return;

  let lastErr = null;
  for (const rel of candidates) {
    const url = buildUrl(rel);
    try {
      console.log(`[components] Trying:`, rel);
      const html = await safeFetchText(url);
      injectHTML(host, html);
      console.log(`[components] Loaded:`, rel);
      if (typeof onLoaded === 'function') onLoaded(host);
      return;
    } catch (e) {
      console.warn(`[components] Failed: ${rel}`, e);
      lastErr = e;
    }
  }
  console.error(`[components] All candidates failed for #${placeholderId}`, lastErr);
  injectHTML(host, '', `Failed to load component for ${placeholderId}.`);
};

// ------------------------------
// Navbar behaviors (adjust selectors to your markup)
// ------------------------------
const enhanceNavbar = (navbarRoot) => {
  if (!navbarRoot) return;

  // Mobile menu toggle
  const menuBtn = navbarRoot.querySelector('[data-toggle="mobile-menu"]');
  const mobileMenu = navbarRoot.querySelector('#mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));
  }

  // Language switchers (.lang-btn[data-lang])
  navbarRoot.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const toLang = (btn.dataset.lang || '').toLowerCase();
      routeToLanguage(toLang);
    });
  });

  const activeBtn = navbarRoot.querySelector(`.lang-btn[data-lang="${LANG}"]`);
  if (activeBtn) activeBtn.setAttribute('aria-current', 'true');
};

// ------------------------------
// Language routing: preserve current path/filename
// ------------------------------
const routeToLanguage = (toLang) => {
  if (!SUPPORTED_LANGS.includes(toLang)) toLang = 'th';

  const parts = window.location.pathname.split('/').filter(Boolean);

  if (parts.length && SUPPORTED_LANGS.includes(parts[0])) {
    parts[0] = toLang; // replace existing prefix
  } else if (toLang !== 'th') {
    parts.unshift(toLang); // add prefix for non-default
  }

  const newPath = '/' + parts.join('/');
  window.location.href = newPath + window.location.search + window.location.hash;
};

// ------------------------------
// Boot
// ------------------------------
(async () => {
  console.log(`[i18n] LANG=`, LANG, ` pathname=`, window.location.pathname);

  // NAVBAR: try i18n path first, then fallback to default /components/navbar.html
  await loadComponent(
    'navbar-placeholder',
    [
      `components/${LANG}/navbar.html`,
      `components/navbar.html`,
    ],
    enhanceNavbar
  );

  // FOOTER: try i18n path first, then fallback to default /components/footer.html
  await loadComponent(
    'footer-placeholder',
    [
      `components/${LANG}/footer.html`,
      `components/footer.html`,
    ]
  );
})();
