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
        const schedule = {
            0: { open: 0, close: 0 },      // Dimanche
            1: { open: 19, close: 24 },    // Lundi
            2: { open: 19, close: 24 },    // Mardi
            3: { open: 19, close: 24 },    // Mercredi
            4: { open: 19, close: 24 },    // Jeudi
            5: { open: 19, close: 24 },    // Vendredi
            6: { open: 0, close: 0 },      // Samedi
        };

        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

        function updateHoursWidget() {
            const now = new Date();
            const dayIndex = now.getDay();
            const currentHour = now.getHours() + now.getMinutes() / 60;
            const today = schedule[dayIndex];
            const isOpen = currentHour >= today.open && currentHour < today.close;

            const dot = hoursWidget.querySelector('.dot');
            const statusText = hoursWidget.querySelector('.status-text');

            if (isOpen) {
                dot.className = 'dot open';
                const closeDisplay = today.close > 24 ? `${today.close - 24}h00` : `${today.close}h00`;
                statusText.textContent = `Ouvert maintenant • Ferme à ${closeDisplay}`;
            } else {
                dot.className = 'dot closed';
                // Find next opening
                let nextDay = dayIndex;
                let nextSchedule = schedule[nextDay];
                
                if (currentHour < nextSchedule.open && nextSchedule.open !== 0) {
                    statusText.textContent = `Fermé • Ouvre aujourd'hui à ${nextSchedule.open}h00`;
                } else {
                    let found = false;
                    for (let i = 1; i <= 7; i++) {
                        nextDay = (dayIndex + i) % 7;
                        nextSchedule = schedule[nextDay];
                        if (nextSchedule.open !== 0) {
                            statusText.textContent = `Fermé • Ouvre ${dayNames[nextDay]} à ${nextSchedule.open}h00`;
                            found = true;
                            break;
                        }
                    }
                    if (!found) statusText.textContent = `Fermé actuellement`;
                }
            }

            // Highlight today's row
            const rows = hoursWidget.querySelectorAll('.hours-row');
            rows.forEach((row, i) => {
                const adjustedIndex = (i + 1) % 7; // Lundi=1 ... Dimanche=0
                if (adjustedIndex === dayIndex) {
                    row.classList.add('today');
                } else {
                    row.classList.remove('today');
                }
            });
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
