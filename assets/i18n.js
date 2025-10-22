// i18n.js — ultra-light i18n for TH/EN/ZH (Simplified)

(() => {
  const FALLBACK = 'th';
  const SUPPORTED = ['th','en','zh']; // zh=简体

  const translations = {
    th: {
      // navbar
      nav_about: 'เกี่ยวกับเรา',
      nav_capabilities: 'ความสามารถ',
      nav_products: 'ผลิตภัณฑ์',
      nav_standard: 'มาตรฐาน',
      nav_brand: 'แบรนด์ของเรา',
      nav_activity: 'กิจกรรม',
      nav_contact: 'ติดต่อเรา',
      nav_online_shop: 'ช้อปออนไลน์',
      nav_product_catalog: 'แคตตาล็อกสินค้า (PDF)',

      // footer
      f_menu: 'เมนู',
      f_about: 'เกี่ยวกับเรา',
      f_products: 'ผลิตภัณฑ์',
      f_features: 'จุดเด่นของเรา',
      f_follow: 'ติดตามเรา',
      f_contact: 'ติดต่อเรา',
      f_addr: 'ที่อยู่: 266 ถ. เพชรบุรี แขวงถนนเพชรบุรี เขตราชเทวี กรุงเทพมหานคร 10400',
      f_email: 'อีเมล: marketing.gtpc@gmail.com',
      f_phone: 'โทร: 02-219-6969',
      f_brand: 'PetFood',
      f_brand_tag: 'Always there for great friends.',
      f_copy: '© 2024 PetFood Inc. สงวนลิขสิทธิ์ทั้งหมด'
    },
    en: {
      nav_about: 'About Us',
      nav_capabilities: 'Capabilities',
      nav_products: 'Our Product',
      nav_standard: 'Standard',
      nav_brand: 'Our Brand',
      nav_activity: 'Activity',
      nav_contact: 'Contact Us',
      nav_online_shop: 'ONLINE SHOPPING',
      nav_product_catalog: 'Product Catalog (PDF)',

      f_menu: 'Menu',
      f_about: 'About Us',
      f_products: 'Products',
      f_features: 'Our Features',
      f_follow: 'Follow Us',
      f_contact: 'Contact Us',
      f_addr: 'Address: 266 Phetchaburi Rd., Ratchathewi, Bangkok 10400',
      f_email: 'Email: marketing.gtpc@gmail.com',
      f_phone: 'Tel: 02-219-6969',
      f_brand: 'PetFood',
      f_brand_tag: 'Always there for great friends.',
      f_copy: '© 2024 PetFood Inc. All Rights Reserved.'
    },
    zh: {
      nav_about: '关于我们',
      nav_capabilities: '能力',
      nav_products: '产品',
      nav_standard: '标准',
      nav_brand: '自有品牌',
      nav_activity: '活动',
      nav_contact: '联系我们',
      nav_online_shop: '线上商店',
      nav_product_catalog: '产品目录 (PDF)',

      f_menu: '菜单',
      f_about: '关于我们',
      f_products: '产品',
      f_features: '我们的亮点',
      f_follow: '关注我们',
      f_contact: '联系我们',
      f_addr: '地址：曼谷拉差贴威区拍讪武里路266号 10400',
      f_email: '邮箱：marketing.gtpc@gmail.com',
      f_phone: '电话：02-219-6969',
      f_brand: 'PetFood',
      f_brand_tag: '始终陪伴好伙伴。',
      f_copy: '© 2024 PetFood Inc. 版权所有'
    }
  };

  const getLangFromQuery = () => {
    const m = /[?&]lang=([a-z\-]+)/i.exec(location.search);
    return m ? m[1].toLowerCase() : null;
  };

  const getCurrentLang = () => {
    const q = getLangFromQuery();
    if (q && SUPPORTED.includes(q)) return q;
    const saved = localStorage.getItem('lang');
    if (saved && SUPPORTED.includes(saved)) return saved;
    return FALLBACK;
  };

  const setLang = (lang) => {
    const use = SUPPORTED.includes(lang) ? lang : FALLBACK;
    localStorage.setItem('lang', use);
    document.documentElement.setAttribute('lang', use);
  };

  const t = (key) => {
    const lang = getCurrentLang();
    return (translations[lang] && translations[lang][key]) 
        || (translations[FALLBACK] && translations[FALLBACK][key]) 
        || key;
  };

  // Translate all nodes with [data-i18n], supports attribute via [data-i18n-attr="placeholder|title|..."]
  const translatePage = () => {
    setLang(getCurrentLang());
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const value = t(key);
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });
  };

  // Wire language switcher buttons (container = CSS selector or 'document')
  const initLangSwitcher = (container = 'document') => {
    const root = container === 'document' ? document : document.querySelector(container);
    if (!root) return;
    root.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        setLang(lang);
        translatePage();
      });
    });
    // Optional: dropdown <select name="lang">
    root.querySelectorAll('select[name="lang"]').forEach(sel => {
      sel.value = getCurrentLang();
      sel.addEventListener('change', () => {
        setLang(sel.value);
        translatePage();
      });
    });
  };

  // expose to global (main.js calls these)
  window.translatePage = translatePage;
  window.initLangSwitcher = initLangSwitcher;
})();
