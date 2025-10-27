// ✅ Dynamic Path Prefix Fix — No more "en/en" issue!
const currentPath = window.location.pathname;
let pathPrefix = '';

if (currentPath.includes('/en/pages/')) {
  pathPrefix = '../../';
} else if (currentPath.includes('/en/')) {
  pathPrefix = '../';
} else if (currentPath.includes('/pages/')) {
  pathPrefix = '../';
} else {
  pathPrefix = '';
}

// ---------- Lazy load รูปทั้งหมดอัตโนมัติ ----------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
});

// ---------- Load Navbar ----------
fetch(pathPrefix + 'components/navbar.html')
  .then(res => res.text())
  .then(data => {
    const nav = document.getElementById('navbar-placeholder');
    nav.innerHTML = data;

    // ✅ Fix: language links absolute path
    nav.querySelectorAll('.lang-link').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = e.target.getAttribute('href');
        window.location.href = target; 
      });
    });

    const mobileToggle = nav.querySelector('#mobile-menu-toggle');
    const mobileMenu = nav.querySelector('#mobile-menu');
    const svg = mobileToggle.querySelector('svg');

    const toggleMenu = () => {
      mobileMenu.classList.toggle('hidden');
      const isOpen = !mobileMenu.classList.contains('hidden');
      svg.innerHTML = isOpen
        ? `<path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    };

    mobileToggle.addEventListener('click', toggleMenu);
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  });
