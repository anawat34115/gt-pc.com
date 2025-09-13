// ตรวจสอบ path ของ HTML เพื่อ fetch navbar ถูกต้องทั้ง root + pages/*
const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

fetch(pathPrefix + 'components/navbar.html')
    .then(response => {
        if (!response.ok) throw new Error('Navbar not found: ' + response.status);
        return response.text();
    })
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;

        // Header scrolled effect
        const header = document.getElementById('main-header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
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
