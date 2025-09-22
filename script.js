document.addEventListener('DOMContentLoaded', () => {

    // ---- 1. CURSOR TRAIL EFFECT ----
    const cursorTrail = document.querySelector('.cursor-trail');
    // Only activate cursor trail on devices that support hover
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.body.addEventListener('mousemove', (e) => {
            cursorTrail.style.left = `${e.clientX}px`;
            cursorTrail.style.top = `${e.clientY}px`;
        });
    }

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

    // ---- 4. INTERACTIVE SVG CONSTELLATION (Mobile Friendly) ----
    const stars = document.querySelectorAll('.star');
    const starInfoBox = document.getElementById('star-info');
    const allLines = document.querySelectorAll('.constellation-line');

    // Initialize lines for animation
    allLines.forEach(line => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
    });

    // Function to reset all stars and lines to their initial state
    const resetConstellation = () => {
        starInfoBox.textContent = 'Hover or tap a star to see details.';
        stars.forEach(s => s.classList.remove('active'));
        allLines.forEach(l => {
            l.classList.remove('active');
            l.style.strokeDashoffset = l.getTotalLength();
        });
    };

    stars.forEach(star => {
        const lineId = star.dataset.line;
        const line = document.getElementById(lineId);

        // CLICK event for mobile and desktop
        star.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling to the document
            
            const isAlreadyActive = star.classList.contains('active');
            
            // First, reset everything
            resetConstellation();

            // If the star was not already active, activate it
            if (!isAlreadyActive) {
                starInfoBox.textContent = star.dataset.info;
                document.querySelectorAll(`[data-line="${lineId}"]`).forEach(s => s.classList.add('active'));
                if (line) {
                    line.style.strokeDashoffset = '0';
                    line.classList.add('active');
                }
            }
        });
    });
    
    // Add a listener to the document to reset constellation when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.star')) {
            resetConstellation();
        }
    });
});