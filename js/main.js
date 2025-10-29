
/*
  main.js — i18n-aware component loader (Drop-in Fix v2, final)
  - Default footer/navbar: /components/footer.html, /components/navbar.html (Thai)
  - If /components/<lang>/footer.html exists (e.g., en), it loads that instead.
  - Works under subfolders via document.baseURI.
  - Includes a small shim to avoid legacy `navbarPlaceholder` reference errors.
*/

/* ---------- compatibility shim: กันโค้ดเก่าอ้าง navbarPlaceholder นอกสโคป ---------- */
if (typeof window.navbarPlaceholder === 'undefined') {
  window.navbarPlaceholder = document.getElementById('navbar-placeholder');
}

/* ------------------------------ */
/* Language detection              */
/* ------------------------------ */
const SUPPORTED_LANGS = ['th', 'en', 'zh'];

const detectLang = () => {
  const seg = window.location.pathname.split('/').filter(Boolean);
  const cand = seg.length ? seg[0].toLowerCase() : '';
  if (SUPPORTED_LANGS.includes(cand)) return cand;
  return 'th'; // default
};

const LANG = detectLang();

/* ------------------------------ */
/* Helpers                         */
/* ------------------------------ */
const buildUrl = (relativePath) =>
  new URL(relativePath.replace(/^\//, ''), document.baseURI).toString();

const byId = (id) => document.getElementById(id);

const safeFetchText = async (url) => {
  const withBuster = url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now();
  const res = await fetch(withBuster, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
};

const injectHTML = (el, html, fallbackMsg) => {
  if (!el) return;
  el.innerHTML =
    html ||
    `<p style="color:red; text-align:center;">${
      fallbackMsg || 'Failed to load content.'
    }</p>`;
};

/* ------------------------------ */
/* Component loader                */
/* ------------------------------ */
const loadComponent = async (placeholderId, candidates, onLoaded) => {
  const host = byId(placeholderId);
  if (!host) return;

  let lastErr = null;
  for (const rel of candidates) {
    const url = buildUrl(rel);
    try {
      console.log('[components] Trying:', rel);
      const html = await safeFetchText(url);
      injectHTML(host, html);
      console.log('[components] Loaded:', rel);
      if (typeof onLoaded === 'function') onLoaded(host);
      return;
    } catch (e) {
      console.warn('[components] Failed:', rel, e);
      lastErr = e;
    }
  }
  console.error(`[components] All candidates failed for #${placeholderId}`, lastErr);
  injectHTML(host, '', `Failed to load component for ${placeholderId}.`);
};

/* ------------------------------ */
/* Navbar behaviors (edit selectorsให้ตรง markup คุณ) */
/* ------------------------------ */
const enhanceNavbar = (navbarRoot) => {
  if (!navbarRoot) return;

  // Mobile menu toggle
  const menuBtn = navbarRoot.querySelector('[data-toggle="mobile-menu"]');
  const mobileMenu = navbarRoot.querySelector('#mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // ปิดเมนูเมื่อคลิกลิงก์
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // Language switchers (.lang-btn[data-lang])
  navbarRoot.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const toLang = (btn.dataset.lang || '').toLowerCase();
      routeToLanguage(toLang);
    });
  });

  // Active state
  const activeBtn = navbarRoot.querySelector(`.lang-btn[data-lang="${LANG}"]`);
  if (activeBtn) activeBtn.setAttribute('aria-current', 'true');
};

/* ------------------------------ */
/* Language routing                */
/* ------------------------------ */
const routeToLanguage = (toLang) => {
  if (!SUPPORTED_LANGS.includes(toLang)) toLang = 'th';

  const parts = window.location.pathname.split('/').filter(Boolean);

  // แทนที่ prefix ภาษาเดิม หรือ prepend ใหม่ถ้าไม่มี
  if (parts.length && SUPPORTED_LANGS.includes(parts[0])) {
    parts[0] = toLang;
  } else if (toLang !== 'th') {
    parts.unshift(toLang);
  }

  const newPath = '/' + parts.join('/');
  window.location.href = newPath + window.location.search + window.location.hash;
};

/* ------------------------------ */
/* Boot                            */
/* ------------------------------ */
(async () => {
  console.log('[i18n] LANG =', LANG, 'pathname =', window.location.pathname);

  // NAVBAR: ลองโหลดตามภาษา → ถ้าไม่เจอ fallback เป็น default
  await loadComponent(
    'navbar-placeholder',
    [
      `components/${LANG}/navbar.html`,
      `components/navbar.html`,
    ],
    enhanceNavbar
  );

  // FOOTER: ลองโหลดตามภาษา → ถ้าไม่เจอ fallback เป็น default
  await loadComponent(
    'footer-placeholder',
    [
      `components/${LANG}/footer.html`,
      `components/footer.html`,
    ]
  );
})();
