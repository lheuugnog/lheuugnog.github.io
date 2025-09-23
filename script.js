document.addEventListener('DOMContentLoaded', () => {

    const cursorTrail = document.querySelector('.cursor-trail');
    const parallaxLayers = document.querySelectorAll('.layer');
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // ---- 1 & 2. COMBINED & OPTIMIZED MOUSEMOVE EFFECT ----
    let isTicking = false;
    let lastKnownMouseX = 0;
    let lastKnownMouseY = 0;

    // The function that will be called on each animation frame
    function updateOnMouseMove() {
        // --- Cursor Trail Logic ---
        // Using transform is more performant than changing top/left
        cursorTrail.style.transform = `translate(${lastKnownMouseX}px, ${lastKnownMouseY}px)`;

        // --- Parallax Logic ---
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            const x = (centerX - lastKnownMouseX) * speed / 50;
            const y = (centerY - lastKnownMouseY) * speed / 50;
            // Use will-change to hint to the browser about upcoming transformations
            layer.style.willChange = 'transform';
            layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
        
        // Reset the tick
        isTicking = false;
    }

    // Only activate mouse effects on devices that support hover
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.body.addEventListener('mousemove', (e) => {
            // Store the latest mouse position
            lastKnownMouseX = e.clientX;
            lastKnownMouseY = e.clientY;
            
            // Throttle updates with requestAnimationFrame
            if (!isTicking) {
                isTicking = true;
                window.requestAnimationFrame(updateOnMouseMove);
            }
        });
    }


    // ---- 3. SCROLL-TRIGGERED FADE-IN ANIMATION ----
    // This implementation is already quite efficient.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // MODIFIED: Stop observing the element once it's visible to save resources
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
});
