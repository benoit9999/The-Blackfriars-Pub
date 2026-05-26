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

        // Close on nav link click (except dropdown toggles on mobile)
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const isDropdownToggle = link.parentElement.classList.contains('dropdown') && link.nextElementSibling?.classList.contains('dropdown-menu');
                if (isDropdownToggle && window.innerWidth < 1024) {
                    // Do not close the menu if it's a dropdown parent being tapped on mobile
                    return;
                }
                burger.classList.remove('active');
                mobileNav.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // ═══ MOBILE DROPDOWN TOGGLE ═══
        const mobileDropdowns = mobileNav.querySelectorAll('.dropdown > a');
        mobileDropdowns.forEach(dropdownToggle => {
            dropdownToggle.addEventListener('click', (e) => {
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    e.stopPropagation();
                    const parent = dropdownToggle.parentElement;
                    parent.classList.toggle('active');
                }
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

    // ═══ IBAN COPY TO CLIPBOARD ═══
    const copyIbanBtn = document.getElementById('copyIbanBtn');
    const ibanValue = document.getElementById('ibanValue');
    if (copyIbanBtn && ibanValue) {
        copyIbanBtn.addEventListener('click', () => {
            const ibanText = ibanValue.textContent.trim();
            navigator.clipboard.writeText(ibanText).then(() => {
                const originalContent = copyIbanBtn.innerHTML;
                copyIbanBtn.innerHTML = '✓ Copié !';
                copyIbanBtn.style.color = 'var(--color-success)';
                copyIbanBtn.style.borderColor = 'var(--color-success)';
                copyIbanBtn.style.background = 'rgba(61, 170, 110, 0.08)';
                
                setTimeout(() => {
                    copyIbanBtn.innerHTML = originalContent;
                    copyIbanBtn.style.color = '';
                    copyIbanBtn.style.borderColor = '';
                    copyIbanBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie de l\'IBAN : ', err);
            });
        });
    }

    // ═══ INTERACTIVE AROMA WHEEL ═══
    const aromaWheelContainer = document.getElementById('aromaWheel');
    if (aromaWheelContainer) {
        const aromaData = [
            {
                title: "Parfumé",
                color: "#548CA8",
                textColor: "#FFFFFF",
                icon: "🌸",
                sub: [
                    {
                        name: "Fruits frais",
                        color: "#4682B4",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Pêche, banane, figue fraîche",
                            "Poire mûre, framboise, fraise",
                            "Pomme, compote de pommes"
                        ]
                    },
                    {
                        name: "Floral",
                        color: "#6FA8DC",
                        textColor: "#10221A",
                        aromas: [
                            "Parfumé, noix de coco",
                            "Rose, lis, muguet",
                            "Bruyère, lavande"
                        ]
                    },
                    {
                        name: "Solvant",
                        color: "#3D5A80",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Chewing-gum, peinture fraîche",
                            "Colle, dissolvant, vernis à ongles",
                            "Cellophane"
                        ]
                    }
                ]
            },
            {
                title: "Fruité",
                color: "#D9822B",
                textColor: "#FFFFFF",
                icon: "🍊",
                sub: [
                    {
                        name: "Fruits secs",
                        color: "#E69138",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Raisins secs, pruneau",
                            "Figues séchées, dattes",
                            "Cake, confiture d'oranges"
                        ]
                    },
                    {
                        name: "Miel",
                        color: "#F6B26B",
                        textColor: "#10221A",
                        aromas: [
                            "Miel, hydromel",
                            "Cire d'abeilles, encaustique"
                        ]
                    },
                    {
                        name: "Vanille",
                        color: "#F9CB9C",
                        textColor: "#10221A",
                        aromas: [
                            "Glycérine, mélasse",
                            "Caramel mou, crème brûlée",
                            "Génoise, gâteau de Savoie"
                        ]
                    }
                ]
            },
            {
                title: "Tourbé",
                color: "#784421",
                textColor: "#FFFFFF",
                icon: "🪵",
                sub: [
                    {
                        name: "Terreux",
                        color: "#5C3A21",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Mousse, tourbe",
                            "Humus, sous-bois",
                            "Champignons, écorce"
                        ]
                    },
                    {
                        name: "Fumé",
                        color: "#8A5A36",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Feu de bois, cheminée, fumée de tourbe",
                            "Hareng fumé, saumon fumé, jambon fumé"
                        ]
                    },
                    {
                        name: "Iodé",
                        color: "#A77953",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Embruns, brise marine",
                            "Fruits de mer, coquillages, algues"
                        ]
                    }
                ]
            },
            {
                title: "Acre",
                color: "#6E6053",
                textColor: "#FFFFFF",
                icon: "🪨",
                sub: [
                    {
                        name: "Médicinal",
                        color: "#8E7C6E",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Ether, alcool à 90°",
                            "Couloir d'hôpital, désinfectant"
                        ]
                    },
                    {
                        name: "Soufré",
                        color: "#5C5046",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Toile cirée, plastique, caoutchouc brûlé",
                            "Gomme à effacer, gaz d'échappement",
                            "Grattoir d'allumettes, pétards"
                        ]
                    },
                    {
                        name: "Carné",
                        color: "#4E433A",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Jus de viande, saucisse, porc",
                            "Lardons, cirage, fromage",
                            "Cuir neuf, vieux cuir, sellerie"
                        ]
                    },
                    {
                        name: "Organique",
                        color: "#3D352E",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Eau saumâtre, eau de cuisson du chou",
                            "Tabac froid, cendre de cigare"
                        ]
                    }
                ]
            },
            {
                title: "Boisé",
                color: "#B45F06",
                textColor: "#FFFFFF",
                icon: "🌳",
                sub: [
                    {
                        name: "Vineux",
                        color: "#A64D79",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Xérès (Sherry), vin blanc, Porto, cognac"
                        ]
                    },
                    {
                        name: "Huileux",
                        color: "#BF9000",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Chocolat au lait, crème fraîche",
                            "Beurre, noisette, amande, olive",
                            "Huile de lin, cire de bougie"
                        ]
                    },
                    {
                        name: "Bois",
                        color: "#A0522D",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Gâteau brûlé, marc de café",
                            "Réglisse, boîte à cigares, sciure",
                            "Gingembre, sève, meubles en pin"
                        ]
                    }
                ]
            },
            {
                title: "Malté",
                color: "#38761D",
                textColor: "#FFFFFF",
                icon: "🌾",
                sub: [
                    {
                        name: "Céréales",
                        color: "#274E13",
                        textColor: "#FFFFFF",
                        aromas: [
                            "Flocons d'avoine, porridge",
                            "Céréales de petit déjeuner, son",
                            "Bière ambrée, pain complet"
                        ]
                    },
                    {
                        name: "Vert",
                        color: "#6AA84F",
                        textColor: "#10221A",
                        aromas: [
                            "Herbe coupée, foin, sapin",
                            "Tomates vertes, légumes verts",
                            "Fleurs coupées, tiges vertes"
                        ]
                    }
                ]
            }
        ];

        // Flat arrays for drawing and calculations
        const subSectors = [];
        const parentSectors = [];
        let outerCount = 0;

        aromaData.forEach((parent, parentIdx) => {
            const parentStartSlice = outerCount;
            parent.sub.forEach((sub) => {
                const subStartSlice = outerCount;
                outerCount++; // 18 slices total in the outer ring
                subSectors.push({
                    name: sub.name,
                    color: sub.color,
                    textColor: sub.textColor,
                    aromas: sub.aromas,
                    parentIndex: parentIdx,
                    sliceIndex: subStartSlice
                });
            });
            const parentEndSlice = outerCount - 1;
            parentSectors.push({
                title: parent.title,
                color: parent.color,
                textColor: parent.textColor,
                icon: parent.icon,
                startSlice: parentStartSlice,
                endSlice: parentEndSlice
            });
        });

        const totalSlices = outerCount; // 18
        let totalRotation = -10; // Aligns first sector (Fruits frais, midpoint at 10 deg) under top pointer on load

        // Helper: Convert polar to Cartesian coordinates
        function polarToCartesian(cx, cy, r, angleInDegrees) {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
            return {
                x: cx + r * Math.cos(angleInRadians),
                y: cy + r * Math.sin(angleInRadians)
            };
        }

        // Helper: SVG Path for sector ring
        function getSectorPath(cx, cy, rIn, rOut, startAngle, endAngle) {
            const startIn = polarToCartesian(cx, cy, rIn, startAngle);
            const startOut = polarToCartesian(cx, cy, rOut, startAngle);
            const endOut = polarToCartesian(cx, cy, rOut, endAngle);
            const endIn = polarToCartesian(cx, cy, rIn, endAngle);
            const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

            return [
                `M ${startOut.x.toFixed(3)} ${startOut.y.toFixed(3)}`,
                `A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${endOut.x.toFixed(3)} ${endOut.y.toFixed(3)}`,
                `L ${endIn.x.toFixed(3)} ${endIn.y.toFixed(3)}`,
                `A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${startIn.x.toFixed(3)} ${startIn.y.toFixed(3)}`,
                'Z'
            ].join(' ');
        }

        // Helper: Concentric Arc Path for curved textPath (direction can be 'cw' or 'ccw')
        function getTextPathArc(cx, cy, r, startAngle, endAngle, direction = 'cw') {
            let start, end, sweep;

            if (direction === 'ccw') {
                start = polarToCartesian(cx, cy, r, endAngle);
                end = polarToCartesian(cx, cy, r, startAngle);
                sweep = 0; // counter-clockwise
            } else {
                start = polarToCartesian(cx, cy, r, startAngle);
                end = polarToCartesian(cx, cy, r, endAngle);
                sweep = 1; // clockwise
            }

            return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 0 ${sweep} ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
        }

        // Dynamically toggle which text is shown (CW vs CCW) so all texts remain right-side up on screen after rotation
        function updateTextPaths(rotation) {
            subSectors.forEach((sub, idx) => {
                const midAngle = (sub.sliceIndex + 0.5) * (360 / totalSlices);
                let screenMidAngle = (midAngle + rotation) % 360;
                if (screenMidAngle < 0) screenMidAngle += 360;

                const cwText = document.getElementById(`text-sub-${idx}-cw`);
                const ccwText = document.getElementById(`text-sub-${idx}-ccw`);

                if (cwText && ccwText) {
                    if (screenMidAngle > 90 && screenMidAngle < 270) {
                        cwText.style.display = 'none';
                        ccwText.style.display = '';
                    } else {
                        cwText.style.display = '';
                        ccwText.style.display = 'none';
                    }
                }
            });

            parentSectors.forEach((parent, idx) => {
                const midAngle = ((parent.startSlice + parent.endSlice + 1) / 2) * (360 / totalSlices);
                let screenMidAngle = (midAngle + rotation) % 360;
                if (screenMidAngle < 0) screenMidAngle += 360;

                const cwText = document.getElementById(`text-parent-${idx}-cw`);
                const ccwText = document.getElementById(`text-parent-${idx}-ccw`);

                if (cwText && ccwText) {
                    if (screenMidAngle > 90 && screenMidAngle < 270) {
                        cwText.style.display = 'none';
                        ccwText.style.display = '';
                    } else {
                        cwText.style.display = '';
                        ccwText.style.display = 'none';
                    }
                }
            });
        }

        // Render dynamic SVG
        let svgHtml = `<svg viewBox="0 0 200 200" width="100%" height="100%">`;
        svgHtml += `<g id="slicesGroup" style="transform-origin: 100px 100px; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); transform: rotate(${totalRotation}deg);">`;

        // 1. Draw Sector Paths and invisible text paths for Outer Ring (Sub-categories)
        subSectors.forEach((sub, idx) => {
            const startAngle = sub.sliceIndex * (360 / totalSlices);
            const endAngle = (sub.sliceIndex + 1) * (360 / totalSlices);
            
            const d = getSectorPath(100, 100, 63, 96, startAngle, endAngle);
            const textPathCw = getTextPathArc(100, 100, 77.5, startAngle, endAngle, 'cw');
            const textPathCcw = getTextPathArc(100, 100, 77.5, startAngle, endAngle, 'ccw');
            const fontSize = sub.name.length > 10 ? '2.8' : '3.5';

            svgHtml += `
                <g class="outer-slice" data-type="sub" data-index="${idx}" style="cursor: pointer;">
                    <path d="${d}" fill="${sub.color}" stroke="#10221A" stroke-width="0.5" />
                    <!-- Chemins invisibles pour guider le texte courbé -->
                    <path id="text-path-sub-${idx}-cw" d="${textPathCw}" fill="none" stroke="none" pointer-events="none" />
                    <path id="text-path-sub-${idx}-ccw" d="${textPathCcw}" fill="none" stroke="none" pointer-events="none" />
                    
                    <text id="text-sub-${idx}-cw" font-family="var(--font-body)" font-size="${fontSize}" font-weight="600" fill="${sub.textColor}" pointer-events="none" style="display: none;">
                        <textPath href="#text-path-sub-${idx}-cw" startOffset="50%" text-anchor="middle">
                            ${sub.name}
                        </textPath>
                    </text>
                    <text id="text-sub-${idx}-ccw" font-family="var(--font-body)" font-size="${fontSize}" font-weight="600" fill="${sub.textColor}" pointer-events="none" style="display: none;">
                        <textPath href="#text-path-sub-${idx}-ccw" startOffset="50%" text-anchor="middle">
                            ${sub.name}
                        </textPath>
                    </text>
                </g>
            `;
        });

        // 2. Draw Sector Paths and invisible text paths for Inner Ring (Parent categories)
        parentSectors.forEach((parent, idx) => {
            const startAngle = parent.startSlice * (360 / totalSlices);
            const endAngle = (parent.endSlice + 1) * (360 / totalSlices);
            
            const d = getSectorPath(100, 100, 30, 63, startAngle, endAngle);
            const textPathCw = getTextPathArc(100, 100, 44.5, startAngle, endAngle, 'cw');
            const textPathCcw = getTextPathArc(100, 100, 44.5, startAngle, endAngle, 'ccw');

            svgHtml += `
                <g class="inner-slice" data-type="parent" data-index="${idx}" style="cursor: pointer;">
                    <path d="${d}" fill="${parent.color}" stroke="#10221A" stroke-width="0.6" />
                    <!-- Chemins invisibles pour guider le texte courbé -->
                    <path id="text-path-parent-${idx}-cw" d="${textPathCw}" fill="none" stroke="none" pointer-events="none" />
                    <path id="text-path-parent-${idx}-ccw" d="${textPathCcw}" fill="none" stroke="none" pointer-events="none" />
                    
                    <text id="text-parent-${idx}-cw" font-family="var(--font-body)" font-size="4.3" font-weight="700" fill="${parent.textColor}" letter-spacing="0.05em" pointer-events="none" style="display: none;">
                        <textPath href="#text-path-parent-${idx}-cw" startOffset="50%" text-anchor="middle">
                            ${parent.title.toUpperCase()}
                        </textPath>
                    </text>
                    <text id="text-parent-${idx}-ccw" font-family="var(--font-body)" font-size="4.3" font-weight="700" fill="${parent.textColor}" letter-spacing="0.05em" pointer-events="none" style="display: none;">
                        <textPath href="#text-path-parent-${idx}-ccw" startOffset="50%" text-anchor="middle">
                            ${parent.title.toUpperCase()}
                        </textPath>
                    </text>
                </g>
            `;
        });

        svgHtml += `</g>`; // End slicesGroup
        svgHtml += `
          <circle cx="100" cy="100" r="30" fill="#10221A" stroke="#D4AF37" stroke-width="1.8"/>
          <text x="100" y="100" fill="#D4AF37" font-size="12" font-weight="bold" text-anchor="middle" dominant-baseline="central" pointer-events="none">☘</text>
        </svg>
        `;
        aromaWheelContainer.innerHTML = svgHtml;

        const slicesGroup = document.getElementById('slicesGroup');
        updateTextPaths(totalRotation);

        // Show default details (Parfumé)
        updateAromaCard('parent', 0, 'Parfumé');

        function updateAromaCard(type, index, name) {
            const iconEl = document.getElementById('aromaIcon');
            const titleEl = document.getElementById('aromaTitle');
            const bodyEl = document.getElementById('aromaBody');
            const cardEl = document.getElementById('aromaCard');

            if (!iconEl || !titleEl || !bodyEl || !cardEl) return;

            cardEl.style.opacity = '0.5';

            setTimeout(() => {
                let title = "";
                let icon = "";
                let color = "";
                let bodyHtml = "";

                if (type === 'parent') {
                    const parent = parentSectors[index];
                    title = parent.title;
                    icon = parent.icon;
                    color = parent.color;

                    const parentData = aromaData[index];
                    parentData.sub.forEach(sub => {
                        const tags = sub.aromas.map(aroma => `<span class="aroma-tag">${aroma}</span>`).join('');
                        bodyHtml += `
                            <div class="aroma-sub-category">
                                <h5 style="color: ${sub.color}">${sub.name}</h5>
                                <div class="aroma-tags">${tags}</div>
                            </div>
                        `;
                    });
                } else if (type === 'sub') {
                    const sub = subSectors[index];
                    const parent = parentSectors[sub.parentIndex];
                    title = sub.name;
                    icon = parent.icon;
                    color = sub.color;

                    const tags = sub.aromas.map(aroma => `<span class="aroma-tag">${aroma}</span>`).join('');

                    bodyHtml = `
                        <span class="parent-category-label" style="color: ${parent.color}">Famille : ${parent.title}</span>
                        <div class="aroma-sub-category" style="margin-top: var(--space-xs);">
                            <div class="aroma-tags">${tags}</div>
                        </div>
                    `;
                }

                iconEl.textContent = icon;
                titleEl.textContent = title;
                titleEl.style.color = color === '#D4AF37' ? 'var(--color-gold-bright)' : color;
                bodyEl.innerHTML = bodyHtml;
                cardEl.style.opacity = '1';
            }, 150);
        }

        // Event delegation for slice clicks (instant selection & rotation animation)
        aromaWheelContainer.addEventListener('click', (e) => {
            const targetGroup = e.target.closest('.inner-slice, .outer-slice');
            if (!targetGroup) return;

            const type = targetGroup.getAttribute('data-type');
            const index = parseInt(targetGroup.getAttribute('data-index'), 10);

            let name = "";
            let midSlice = 0;

            if (type === 'parent') {
                const parent = parentSectors[index];
                name = parent.title;
                midSlice = (parent.startSlice + parent.endSlice + 1) / 2;
            } else if (type === 'sub') {
                const sub = subSectors[index];
                name = sub.name;
                midSlice = sub.sliceIndex + 0.5;
            }

            const midAngle = midSlice * (360 / totalSlices);
            const alignAngle = -midAngle;

            // Short transition (0.6s) for immediate feedback
            slicesGroup.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';

            // Rotate via shortest path
            const currentRotOffset = totalRotation % 360;
            let diff = alignAngle - currentRotOffset;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            totalRotation += diff;

            slicesGroup.style.transform = `rotate(${totalRotation}deg)`;
            updateTextPaths(totalRotation);
            updateAromaCard(type, index, name);
        });
    }

});
