/* ============================================
   THE BLACKFRIARS – Main JavaScript
   Irish Gold & Green Theme
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ═══ HEADER SCROLL EFFECT ═══
    const header = document.getElementById('siteHeader');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ═══ MOBILE NAVIGATION ═══
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    if (burger && mobileNav) {
        burger.addEventListener('click', () => {
            const isOpen = burger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            burger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on nav link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileNav.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ═══ HOURS WIDGET ═══
    const hoursWidget = document.getElementById('hoursWidget');
    if (hoursWidget) {
        function updateHoursWidget() {
            const now = new Date();
            const dayIndex = now.getDay(); // 0 is Sunday, 1 is Monday ...
            const currentHour = now.getHours() + now.getMinutes() / 60;
            
            // Highlight today's row
            const rows = hoursWidget.querySelectorAll('.hours-row');
            rows.forEach(row => {
                const rowDay = parseInt(row.getAttribute('data-day'), 10);
                if (rowDay === dayIndex) {
                    row.classList.add('active-day');
                } else {
                    row.classList.remove('active-day');
                }
            });

            // Status tracker logic
            const statusTracker = document.getElementById('hoursStatusTracker');
            const statusText = document.getElementById('statusText');
            
            if (statusTracker && statusText) {
                // Open between Mon(1) to Fri(5), 19:00 to 00:00 (which is hour 19 to 23.99)
                const isWorkingDay = dayIndex >= 1 && dayIndex <= 5;
                const isOpenTime = currentHour >= 19 && currentHour < 24;
                const isOpen = isWorkingDay && isOpenTime;

                if (isOpen) {
                    statusTracker.className = 'hours-status-header status-open';
                    statusText.textContent = 'Ouvert maintenant • Ferme à 00h00';
                } else {
                    statusTracker.className = 'hours-status-header status-closed';
                    statusText.textContent = 'Actuellement fermé • Ouvre à 19h00';
                }
            }
        }

        updateHoursWidget();
        setInterval(updateHoursWidget, 60000); // Update every minute
    }

    // ═══ MENU TABS ═══
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    if (menuTabs.length > 0) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                // Update active tab
                menuTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show target category
                menuCategories.forEach(cat => {
                    if (cat.id === target) {
                        cat.classList.add('active');
                    } else {
                        cat.classList.remove('active');
                    }
                });
            });
        });
    }

    // ═══ SCROLL REVEAL ANIMATIONS ═══
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ═══ STAT COUNTERS ═══
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    const suffix = el.dataset.suffix || '';
                    const duration = 2000;
                    const start = performance.now();

                    function animateCount(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);
                        el.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        } else {
                            el.textContent = target + suffix;
                        }
                    }

                    requestAnimationFrame(animateCount);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    // ═══ FORM HANDLING ═══
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;

            // Simulate sending
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = '✓ Message envoyé !';
                submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ═══ PRIVATISATION FORM ═══
    const privForm = document.getElementById('privForm');
    if (privForm) {
        privForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = privForm.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = '✓ Demande envoyée ! Sláinte!';
                submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    privForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ═══ SMOOTH SCROLL FOR ANCHOR LINKS ═══
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 72;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ═══ GALLERY IMAGE HOVER PARALLAX ═══
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const img = item.querySelector('img');
            if (img) {
                img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            }
        });

        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('img');
            if (img) {
                img.style.transformOrigin = 'center center';
            }
        });
    });

});
