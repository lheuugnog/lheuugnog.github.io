document.addEventListener('DOMContentLoaded', () => {

    // ---- 1. CURSOR TRAIL EFFECT (FIXED) ----
    const cursorTrail = document.querySelector('.cursor-trail');
    document.body.addEventListener('mousemove', (e) => {
        // FIXED: Use clientX and clientY for position:fixed elements
        // This positions the trail relative to the visible window, not the whole document
        cursorTrail.style.left = `${e.clientX}px`;
        cursorTrail.style.top = `${e.clientY}px`;
    });

    // ---- 2. MOUSE PARALLAX EFFECT ----
    const parallaxLayers = document.querySelectorAll('.layer');
    document.body.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            const x = (centerX - clientX) * speed / 50;
            const y = (centerY - clientY) * speed / 50;
            layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });

    // ---- 3. SCROLL-TRIGGERED FADE-IN ANIMATION ----
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // ---- 4. INTERACTIVE SVG CONSTELLATION ----
    const stars = document.querySelectorAll('.star');
    const starInfoBox = document.getElementById('star-info');

    stars.forEach(star => {
        const lineId = star.dataset.line;
        const line = document.getElementById(lineId);
        
        if (line) {
            const length = line.getTotalLength();
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
        }

        star.addEventListener('mouseover', () => {
            starInfoBox.textContent = star.dataset.info;
            document.querySelectorAll(`[data-line="${lineId}"]`).forEach(s => s.classList.add('active'));
            if (line) {
                line.style.strokeDashoffset = '0';
                line.classList.add('active');
            }
        });

        star.addEventListener('mouseout', () => {
            starInfoBox.textContent = 'Hover over a star to see project details.';
            document.querySelectorAll(`[data-line="${lineId}"]`).forEach(s => s.classList.remove('active'));
            if (line) {
                line.style.strokeDashoffset = line.getTotalLength();
                line.classList.remove('active');
d            }
        });
    });
});