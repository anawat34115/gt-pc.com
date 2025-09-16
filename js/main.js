const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

// Load Navbar
fetch(pathPrefix + 'components/navbar.html')
      .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // 2. เอาโค้ดที่ได้มาไปใส่ใน placeholder
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            if (navbarPlaceholder) {
                navbarPlaceholder.innerHTML = data;
            }

            // 3. ผูกการทำงานของ Dropdown หลังจากที่ Navbar โหลดเข้ามาแล้ว
            const dropdownContainer = document.getElementById('brand-dropdown-container');
            const dropdownPanel = document.getElementById('brand-dropdown-panel');
            
            if (dropdownContainer && dropdownPanel) {
                let showTimer;
                let hideTimer;

                dropdownContainer.addEventListener('mouseenter', () => {
                    clearTimeout(hideTimer);
                    showTimer = setTimeout(() => {
                        dropdownPanel.classList.remove('hidden');
                    }, 200);
                });

                dropdownContainer.addEventListener('mouseleave', () => {
                    clearTimeout(showTimer);
                    hideTimer = setTimeout(() => {
                        dropdownPanel.classList.add('hidden');
                    }, 300);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching or processing navbar:', error);
            // ถ้าโหลด navbar ไม่ได้ ให้แสดงข้อความบอกในตำแหน่งนั้น
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            if (navbarPlaceholder) {
                navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Failed to load navigation bar.</p>';
            }
        });

// Load Footer
fetch(pathPrefix + 'components/footer.html')
    .then(response => {
        if (!response.ok) throw new Error('Footer not found: ' + response.status);
        return response.text();
    })
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(err => console.error(err));

// Fade-in Animation
const sections = document.querySelectorAll('.fade-in-section');
if (sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
}

