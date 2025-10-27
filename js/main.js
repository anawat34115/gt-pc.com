const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

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
  .then(response => {
    if (!response.ok) throw new Error('Navbar not found: ' + response.status);
    return response.text();
  })
  .then(data => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) throw new Error('#navbar-placeholder not found on page');

    navbarPlaceholder.innerHTML = data;

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
        e.preventDefault();
        e.stopPropagation();
        dropdownPanel.classList.toggle('hidden');
      });
      dropdownPanel.addEventListener('click', e => e.stopPropagation());
    }

    document.addEventListener('click', () => {
      if (dropdownPanel) dropdownPanel.classList.add('hidden');
    });

    // --- Mobile menu toggle ---
    const mobileToggle = navbarPlaceholder.querySelector('#mobile-menu-toggle');
    const mobileMenu = navbarPlaceholder.querySelector('#mobile-menu');

    if (mobileToggle && mobileMenu) {
      const svg = mobileToggle.querySelector("svg");
      const hamburgerIcon = document.createElementNS("http://www.w3.org/2000/svg", "path");
      hamburgerIcon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
      hamburgerIcon.setAttribute("stroke-linecap", "round");
      hamburgerIcon.setAttribute("stroke-linejoin", "round");
      hamburgerIcon.setAttribute("stroke-width", "2");

      const closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "path");
      closeIcon.setAttribute("d", "M6 18L18 6M6 6l12 12");
      closeIcon.setAttribute("stroke-linecap", "round");
      closeIcon.setAttribute("stroke-linejoin", "round");
      closeIcon.setAttribute("stroke-width", "2");
      closeIcon.style.display = "none";

      svg.innerHTML = "";
      svg.appendChild(hamburgerIcon);
      svg.appendChild(closeIcon);

      const toggleHandler = (e) => {
        e.preventDefault();
        mobileMenu.classList.toggle('hidden');

        if (hamburgerIcon.style.display === "none") {
          hamburgerIcon.style.display = "block";
          closeIcon.style.display = "none";
        } else {
          hamburgerIcon.style.display = "none";
          closeIcon.style.display = "block";
        }
      };

      mobileToggle.addEventListener('click', toggleHandler);
      // mobileToggle.addEventListener('touchend', toggleHandler);

      // ปิด menu เมื่อกด link
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          hamburgerIcon.style.display = "block";
          closeIcon.style.display = "none";
        });
      });

      document.addEventListener('click', (ev) => {
        if (!mobileMenu.classList.contains('hidden') && !navbarPlaceholder.contains(ev.target)) {
          mobileMenu.classList.add('hidden');
          hamburgerIcon.style.display = "block";
          closeIcon.style.display = "none";
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
  })
  .catch(err => {
    console.error('Error loading navbar:', err);
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Failed to load navigation bar.</p>';
    }
  });

// ---------- Load Footer ----------
fetch(pathPrefix + 'components/footer.html')
  .then(response => {
    if (!response.ok) throw new Error('Footer not found: ' + response.status);
    return response.text();
  })
  .then(data => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) throw new Error('#footer-placeholder not found on page');
    footerPlaceholder.innerHTML = data;
  })
  .catch(err => {
    console.error('Error loading footer:', err);
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Failed to load footer.</p>';
    }
  });
