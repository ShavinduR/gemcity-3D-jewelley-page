// Gem City – Shared Functionality (Mobile Menu & Lightbox)
// Applied to all pages via <script src="main.js"></script>

(function () {
    'use strict';

    // --- MOBILE MENU ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- LIGHTBOX SHARED LOGIC ---
    const lightbox = document.getElementById('gallery-lightbox');
    const mainImg = document.getElementById('main-gallery-img');
    const thumbsContainer = document.getElementById('gallery-thumbs');

    // Check if lightbox elements exist on the page before initializing
    if (lightbox && mainImg && thumbsContainer) {
        let currentImages = [];
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Expose functions to global scope for HTML onclick handlers
        window.openGallery = function (element) {
            currentImages = JSON.parse(element.getAttribute('data-images'));
            currentIndex = 0;
            if (currentImages.length > 0) {
                updateLightbox();
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scroll
            }
        };

        window.closeGallery = function () {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Restore scroll
        };

        window.nextImage = function (e) {
            if (e) e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightbox();
        };

        window.prevImage = function (e) {
            if (e) e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightbox();
        };

        function updateLightbox() {
            mainImg.style.opacity = '0.5';
            setTimeout(() => {
                mainImg.src = currentImages[currentIndex];
                mainImg.style.opacity = '1';

                // Update Thumbnails
                thumbsContainer.innerHTML = '';
                currentImages.forEach((imgSrc, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = imgSrc;
                    thumb.classList.add('lightbox-thumb');
                    if (index === currentIndex) thumb.classList.add('active');
                    thumb.onclick = (e) => {
                        e.stopPropagation();
                        currentIndex = index;
                        updateLightbox();
                    };
                    thumbsContainer.appendChild(thumb);
                });
            }, 150);
        }

        // --- SWIPE SUPPORT ---
        mainImg.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainImg.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) window.nextImage();
            if (touchEndX > touchStartX + threshold) window.prevImage();
        }

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-main-area')) {
                window.closeGallery();
            }
        });
    }

})();
