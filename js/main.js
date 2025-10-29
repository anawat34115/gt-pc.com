  // --- Detect language from URL prefix ---
  const pathname = window.location.pathname;
  const currentLang = pathname.startsWith('/en/') ? 'en'
                    : pathname.startsWith('/zh/') ? 'zh'
                    : 'th'; // default

  // --- Build absolute path to components folder per language ---
  // โครงสร้างไฟล์แนะนำ:
  // /components/           (ไทย)
  // /en/components/        (อังกฤษ)
  // /zh/components/        (จีน)
  const compBase = currentLang === 'th' ? '/components/' : `/${currentLang}/components/`;

  // ---------- Lazy load รูปอัตโนมัติ ----------
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
  });

  // ---------- Load Navbar ----------
  fetch(compBase + 'navbar.html', { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Navbar not found: ' + response.status);
      return response.text();
    })
    .then(html => {
      const navbarPlaceholder = document.getElementById('navbar-placeholder');
      if (!navbarPlaceholder) throw new Error('#navbar-placeholder not found on page');
      navbarPlaceholder.innerHTML = html;

      // --- Desktop dropdown ---
      const dropdownContainer = navbarPlaceholder.querySelector('#brand-dropdown-container');
      const dropdownPanel = navbarPlaceholder.querySelector('#brand-dropdown-panel');
      const brandToggle = navbarPlaceholder.querySelector('#brand-dropdown-toggle');

      if (dropdownContainer && dropdownPanel) {
        let showTimer, hideTimer;
        dropdownContainer.addEventListener('mouseenter', () => {
          clearTimeout(hideTimer);
          showTimer = setTimeout(() => dropdownPanel.classList.remove('hidden'), 150);
        });
        dropdownContainer.addEventListener('mouseleave', () => {
          clearTimeout(showTimer);
          hideTimer = setTimeout(() => dropdownPanel.classList.add('hidden'), 200);
        });
      }
      if (brandToggle && dropdownPanel) {
        brandToggle.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          dropdownPanel.classList.toggle('hidden');
        });
        dropdownPanel.addEventListener('click', e => e.stopPropagation());
      }
      document.addEventListener('click', () => dropdownPanel && dropdownPanel.classList.add('hidden'));

      // --- Mobile menu toggle ---
      const mobileToggle = navbarPlaceholder.querySelector('#mobile-menu-toggle');
      const mobileMenu = navbarPlaceholder.querySelector('#mobile-menu');
      if (mobileToggle && mobileMenu) {
        const svg = mobileToggle.querySelector('svg');
        const hamburgerIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hamburgerIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        hamburgerIcon.setAttribute('stroke-linecap', 'round');
        hamburgerIcon.setAttribute('stroke-linejoin', 'round');
        hamburgerIcon.setAttribute('stroke-width', '2');

        const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        closeIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        closeIcon.setAttribute('stroke-linecap', 'round');
        closeIcon.setAttribute('stroke-linejoin', 'round');
        closeIcon.setAttribute('stroke-width', '2');
        closeIcon.style.display = 'none';

        svg.innerHTML = '';
        svg.appendChild(hamburgerIcon);
        svg.appendChild(closeIcon);

        const toggleHandler = (e) => {
          e.preventDefault();
          mobileMenu.classList.toggle('hidden');
          const open = hamburgerIcon.style.display !== 'none';
          hamburgerIcon.style.display = open ? 'none' : 'block';
          closeIcon.style.display = open ? 'block' : 'none';
        };
        mobileToggle.addEventListener('click', toggleHandler);
        mobileToggle.addEventListener('touchend', toggleHandler);

        mobileMenu.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.style.display = 'block';
            closeIcon.style.display = 'none';
          });
        });

        document.addEventListener('click', (ev) => {
          if (!mobileMenu.classList.contains('hidden') && !navbarPlaceholder.contains(ev.target)) {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.style.display = 'block';
            closeIcon.style.display = 'none';
          }
        });
      }

      // --- Mobile "Our Brand" sub-menu ---
      const mobileBrandToggle = navbarPlaceholder.querySelector('#mobile-brand-toggle');
      const mobileBrandPanel = navbarPlaceholder.querySelector('#mobile-brand-panel');
      const mobileBrandIcon = mobileBrandToggle ? mobileBrandToggle.querySelector('svg') : null;
      if (mobileBrandToggle && mobileBrandPanel) {
        mobileBrandToggle.addEventListener('click', (e) => {
          e.preventDefault();
          mobileBrandPanel.classList.toggle('hidden');
          if (mobileBrandIcon) mobileBrandIcon.classList.toggle('rotate-180');
        });
      }

      // --- Scroll effect ---
      const header = navbarPlaceholder.querySelector('#main-header');
      if (header) {
        let ticking = false;
        window.addEventListener('scroll', () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              header.classList.toggle('scrolled', window.scrollY > 50);
              ticking = false;
            });
            ticking = true;
          }
        });
      }

      // --- Language buttons (ต้องอยู่หลังจาก navbar ถูก inject แล้ว) ---
      const langButtons = navbarPlaceholder.querySelectorAll('.lang-btn');
      if (langButtons.length) {
        langButtons.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            let target = '/index.html';
            if (lang === 'en') target = '/en/index.html';
            if (lang === 'zh') target = '/zh/index.html';
            const mobileMenu = navbarPlaceholder.querySelector('#mobile-menu');
            if (mobileMenu) mobileMenu.classList.add('hidden');
            window.location.href = target;
          });
        });
      }
    })
    .catch(err => {
      console.error('Error loading navbar:', err);
      const navbarPlaceholder = document.getElementById('navbar-placeholder');
      if (navbarPlaceholder) {
        navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Failed to load navigation bar.</p>';
      }
    });

  // // ---------- Load Footer ----------
  // fetch(compBase + 'footer.html', { cache: 'no-cache' })
  //   .then(response => {
  //     if (!response.ok) throw new Error('Footer not found: ' + response.status);
  //     return response.text();
  //   })
  //   .then(html => {
  //     const footerPlaceholder = document.getElementById('footer-placeholder');
  //     if (!footerPlaceholder) throw new Error('#footer-placeholder not found on page');
  //     footerPlaceholder.innerHTML = html;
  //   })
  //   .catch(err => {
  //     console.error('Error loading footer:', err);
  //     const footerPlaceholder = document.getElementById('footer-placeholder');
  //     if (footerPlaceholder) {
  //       footerPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Failed to load footer.</p>';
  //     }
  //   });


  // ---------- Load Footer (multi-language, single-run) ----------
(() => {
  const slot = document.getElementById('footer-placeholder');
  if (!slot) return;

  // กันโหลดซ้ำจากสคริปต์อื่น
  if (slot.dataset.loaded === '1') return;

  const p = window.location.pathname;
  const lang = p.startsWith('/en/') ? 'en'
            : p.startsWith('/zh/') ? 'zh'
            : 'th'; // default ไทย

  // ใช้พาธสัมบูรณ์ตามภาษา + cache buster กัน CDN เสิร์ฟไฟล์ผิด
  const footerUrl = (lang === 'th')
    ? `/components/footer.html?v=${lang}`
    : `/${lang}/components/footer.html?v=${lang}`;

  fetch(footerUrl, { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error('Footer not found: ' + res.status);
      return res.text();
    })
    .then(html => {
      slot.innerHTML = html;
      slot.dataset.loaded = '1';
    })
    .catch(err => {
      console.error('Error loading footer:', err);
      slot.innerHTML = '<p style="color:red; text-align:center;">Failed to load footer.</p>';
    });
})();
