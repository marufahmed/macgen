/* =============================================
   MacGen Trade International — Script
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initWaveGradient();
    initNavbar();
    initMobileMenu();
    initMegaDropdown();
    initScrollAnimations();
    initStatCounters();
    initProductTabs();
    initBangladeshMap();
    initForms();
    initInquireButtons();
    initLogoAnimation();
    initQuickView();
});

/* ====== WebGL Wave Gradient Background (Argus-style) ====== */
function initWaveGradient() {
    try {
        const gradient = new Gradient();
        gradient.initGradient('#gradient-canvas');
    } catch (e) {
        console.log('Gradient init:', e);
    }
}

/* ====== GSAP Logo Brushstroke Animation (Argus-style) ====== */
function initLogoAnimation() {
    const heroSvgObj = document.getElementById('hero-logo-svg');
    if (!heroSvgObj) return;

    function animateWithGSAP(svgDoc) {
        const svg = svgDoc.querySelector('svg');
        if (!svg) return;

        const allPaths = svg.querySelectorAll('path');
        const allShapes = svg.querySelectorAll('polygon, circle, rect, ellipse, polyline, line');

        // Store original fills and prepare for stroke animation
        allPaths.forEach(path => {
            const computedFill = window.getComputedStyle(path).fill;
            const attrFill = path.getAttribute('fill');
            const origFill = computedFill && computedFill !== 'none' ? computedFill : (attrFill || '#DC2D27');
            path.dataset.origFill = origFill;

            const length = path.getTotalLength ? path.getTotalLength() : 2000;
            path.style.fill = 'transparent';
            path.style.stroke = origFill === 'none' || origFill === 'transparent' ? '#DC2D27' : origFill;
            path.style.strokeWidth = '0.8';
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
        });

        // Hide shapes initially
        allShapes.forEach(shape => {
            shape.style.opacity = '0';
        });

        heroSvgObj.classList.add('loaded');

        // Use GSAP for the stroke draw animation — same principle as Argus
        if (typeof gsap !== 'undefined') {
            // Phase 1: Draw the strokes
            gsap.to(Array.from(allPaths), {
                strokeDashoffset: 0,
                duration: 2.5,
                stagger: 0.03,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Phase 2: Fill in with color
                    allPaths.forEach((path, i) => {
                        setTimeout(() => {
                            path.style.transition = 'fill 0.6s ease, stroke-width 0.4s ease';
                            path.style.fill = path.dataset.origFill;
                            path.style.strokeWidth = '0';
                        }, i * 15);
                    });

                    // Fade in shapes
                    allShapes.forEach((shape, i) => {
                        setTimeout(() => {
                            shape.style.transition = 'opacity 0.5s ease';
                            shape.style.opacity = '1';
                        }, i * 50);
                    });
                }
            });
        } else {
            // Fallback: CSS-only animation
            allPaths.forEach((path, i) => {
                path.style.transition = `stroke-dashoffset 2.5s ease ${i * 0.03}s, fill 0.6s ease 2.8s, stroke-width 0.3s ease 2.8s`;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        path.style.strokeDashoffset = '0';
                        setTimeout(() => {
                            path.style.fill = path.dataset.origFill;
                            path.style.strokeWidth = '0';
                        }, 2800);
                    });
                });
            });
            heroSvgObj.classList.add('loaded');
        }
    }

    heroSvgObj.addEventListener('load', () => {
        try {
            const svgDoc = heroSvgObj.contentDocument;
            if (svgDoc) animateWithGSAP(svgDoc);
        } catch (e) {
            console.log('SVG animation: cross-origin issue, showing directly');
            heroSvgObj.classList.add('loaded');
        }
    });

    // In case already loaded
    if (heroSvgObj.contentDocument && heroSvgObj.contentDocument.querySelector('svg')) {
        animateWithGSAP(heroSvgObj.contentDocument);
    }

    // Nav logo — simpler quick animation
    const navSvgObj = document.getElementById('nav-logo-svg');
    if (navSvgObj) {
        const animateNav = () => {
            try {
                const svgDoc = navSvgObj.contentDocument;
                if (!svgDoc) return;
                const paths = svgDoc.querySelectorAll('path');
                paths.forEach((path, i) => {
                    const origFill = window.getComputedStyle(path).fill || '#DC2D27';
                    const length = path.getTotalLength ? path.getTotalLength() : 2000;
                    path.style.fill = 'transparent';
                    path.style.stroke = origFill;
                    path.style.strokeWidth = '0.5';
                    path.style.strokeDasharray = length;
                    path.style.strokeDashoffset = length;
                    path.style.transition = `stroke-dashoffset 1.5s ease ${i * 0.02}s, fill 0.5s ease 1.5s, stroke-width 0.3s ease 1.5s`;
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            path.style.strokeDashoffset = '0';
                            setTimeout(() => {
                                path.style.fill = origFill;
                                path.style.strokeWidth = '0';
                            }, 1500);
                        });
                    });
                });
            } catch (e) { }
        };
        navSvgObj.addEventListener('load', animateNav);
        if (navSvgObj.contentDocument && navSvgObj.contentDocument.querySelector('svg')) {
            animateNav();
        }
    }
}

/* ====== Navbar Scroll ====== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 120;
            if (window.scrollY >= top) current = s.getAttribute('id');
        });
        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href === '#' + current) link.classList.add('active');
        });
    });
}

/* ====== Mobile Menu ====== */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.classList.remove('active');
        });
    });
}

/* ====== Mega Dropdown ====== */
function initMegaDropdown() {
    const megaCats = document.querySelectorAll('.mega-cat');
    const megaGrids = document.querySelectorAll('.mega-products-grid');

    megaCats.forEach(cat => {
        cat.addEventListener('mouseenter', () => {
            megaCats.forEach(c => c.classList.remove('active'));
            megaGrids.forEach(g => g.classList.remove('active'));
            cat.classList.add('active');
            const target = cat.dataset.category;
            const grid = document.querySelector(`.mega-products-grid[data-for="${target}"]`);
            if (grid) grid.classList.add('active');
        });
    });

    // Clicking a product card in the dropdown opens its quick view
    document.querySelectorAll('.mega-product-card[data-product-id]').forEach(card => {
        card.addEventListener('click', () => {
            // Close the dropdown by removing focus from the nav item
            const trigger = document.querySelector('.nav-item.has-dropdown');
            if (trigger) trigger.blur();
            if (window.openQuickView) window.openQuickView(card.dataset.productId);
        });
    });
}

/* ====== Scroll Animations ====== */
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

/* ====== Stat Counters ====== */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let counted = false;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                counters.forEach(counter => animateCounter(counter));
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

/* ====== Product Tabs ====== */
function initProductTabs() {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const panels = document.querySelectorAll('.product-panel');
    const DURATION = 5000;
    let currentIndex = 0;
    let timer = null;
    let isPaused = false;

    // Inject progress bar span into each tab button
    tabs.forEach(tab => {
        const prog = document.createElement('span');
        prog.className = 'tab-progress';
        tab.appendChild(prog);
    });

    function activateTab(index) {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        const tab = tabs[index];
        tab.classList.add('active');

        // Restart progress animation by removing and re-inserting the span
        const oldProg = tab.querySelector('.tab-progress');
        if (oldProg) oldProg.remove();
        const prog = document.createElement('span');
        prog.className = 'tab-progress';
        tab.appendChild(prog);

        const target = tab.dataset.tab;
        const panel = document.querySelector(`.product-panel[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');

        currentIndex = index;
    }

    function startCycle() {
        clearInterval(timer);
        timer = setInterval(() => {
            if (!isPaused) activateTab((currentIndex + 1) % tabs.length);
        }, DURATION);
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            activateTab(i);
            startCycle();
        });
    });

    // Pause cycling while hovering over the products section
    const section = document.querySelector('.products-section');
    if (section) {
        section.addEventListener('mouseenter', () => { isPaused = true; });
        section.addEventListener('mouseleave', () => { isPaused = false; });
    }

    activateTab(0);
    startCycle();
}

/* ====== Bangladesh Map (Leaflet) ====== */
function initBangladeshMap() {
    const mapEl = document.getElementById('bangladesh-map');
    if (!mapEl) return;

    let mapInitialised = false;

    function buildMap() {
        if (mapInitialised) return;
        mapInitialised = true;

        const map = L.map('bangladesh-map', {
            center: [23.8, 90.3],
            zoom: 7,
            zoomControl: false,
            scrollWheelZoom: false,
            dragging: true,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);

        const cities = [
            { name: 'Dhaka', lat: 23.8103, lng: 90.4125, type: 'hq', desc: 'Head Office — Zigatola, Dhanmondi' },
            { name: 'Chittagong', lat: 22.3569, lng: 91.7832, type: 'branch', desc: 'Branch Office' },
            { name: 'Sylhet', lat: 24.8949, lng: 91.8687, type: 'branch', desc: 'Branch Office' },
            { name: 'Rajshahi', lat: 24.3745, lng: 88.6042, type: 'branch', desc: 'Branch Office' },
            { name: 'Rangpur', lat: 25.7439, lng: 89.2752, type: 'branch', desc: 'Branch Office' },
            { name: 'Khulna', lat: 22.8456, lng: 89.5403, type: 'branch', desc: 'Branch Office' },
            { name: 'Barisal', lat: 22.7010, lng: 90.3535, type: 'branch', desc: 'Branch Office' },
            { name: 'Mymensingh', lat: 24.7471, lng: 90.4203, type: 'branch', desc: 'Branch Office' },
            { name: 'Comilla', lat: 23.4607, lng: 91.1809, type: 'branch', desc: 'Branch Office' },
        ];

        cities.forEach(city => {
            const isHQ = city.type === 'hq';
            const markerHTML = `<div class="map-city-marker ${isHQ ? 'hq' : ''}"></div>`;
            const icon = L.divIcon({
                html: markerHTML,
                className: 'city-marker-container',
                iconSize: isHQ ? [22, 22] : [16, 16],
                iconAnchor: isHQ ? [11, 11] : [8, 8],
            });

            const marker = L.marker([city.lat, city.lng], { icon })
                .addTo(map)
                .bindPopup(
                    `<div class="city-popup">
                    <h4>${city.name}</h4>
                    <p>${city.desc}</p>
                    ${isHQ ? '<p style="color:#DC2D27;font-weight:600;font-size:0.72rem;margin-top:4px;">★ HEADQUARTERS</p>' : ''}
                </div>`,
                    { className: 'city-marker-popup', closeButton: false }
                );

            if (isHQ) {
                setTimeout(() => marker.openPopup(), 1500);
            }
        });

        // Force Leaflet to recalculate container size after tiles load
        setTimeout(() => map.invalidateSize(), 200);
    }

    // Build map only when it scrolls into view (fixes zero-size init bug)
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            buildMap();
            observer.disconnect();
        }
    }, { threshold: 0.1 });
    observer.observe(mapEl);
}

/* ====== Forms ====== */
function initForms() {
    const inquiryForm = document.getElementById('inquiry-form');
    const quickInquiryForm = document.getElementById('quick-inquiry-form');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = new FormData(inquiryForm);
            const subject = encodeURIComponent(`Website Inquiry - ${data.get('product') || 'General'}`);
            const body = encodeURIComponent(
                `Name: ${data.get('name')}\nOrganization: ${data.get('organization')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\nProduct: ${data.get('product')}\n\nMessage:\n${data.get('message')}`
            );
            window.location.href = `mailto:masum.macgen@gmail.com?subject=${subject}&body=${body}`;
            document.getElementById('form-success').classList.add('visible');
            inquiryForm.reset();
        });
    }

    if (quickInquiryForm) {
        quickInquiryForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = new FormData(quickInquiryForm);
            const subject = encodeURIComponent(`Product Inquiry - ${data.get('product')}`);
            const body = encodeURIComponent(
                `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\nProduct: ${data.get('product')}\n\nMessage:\n${data.get('message')}`
            );
            window.location.href = `mailto:masum.macgen@gmail.com?subject=${subject}&body=${body}`;
            document.getElementById('qi-form-success').classList.add('visible');
            quickInquiryForm.style.display = 'none';
        });
    }
}

/* ====== Inquire Buttons & Modal ====== */
function initInquireButtons() {
    const modal = document.getElementById('inquiry-modal');
    const productNameEl = document.getElementById('inquiry-product-name');
    const productInput = document.getElementById('qi-product');
    const closeBtn = document.querySelector('.inquiry-modal-close');
    const quickForm = document.getElementById('quick-inquiry-form');
    const qiSuccess = document.getElementById('qi-form-success');

    document.addEventListener('click', e => {
        const btn = e.target.closest('.inquire-btn');
        if (!btn) return;
        const product = btn.dataset.product;
        if (productNameEl) productNameEl.textContent = product;
        if (productInput) productInput.value = product;
        if (quickForm) quickForm.style.display = '';
        if (qiSuccess) qiSuccess.classList.remove('visible');
        if (modal) modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
}

/* =============================================
   Product Quick-View — Data from Extracted Docs
   ============================================= */
const PRODUCT_DATA = {
    ca431a: {
        brand: 'URIT Medical',
        name: 'CA-431A',
        type: 'Automatic Chemistry Analyzer',
        catalog: 'assets/catalogs/CA-431A_202403.pdf',
        images: [
            'assets/images/CA-431A_202403/CA-431A_202403_001.png'
        ],
        highlights: [
            { icon: 'fas fa-tachometer-alt', text: 'Constant 430 T/H, 620 T/H with ISE' },
            { icon: 'fas fa-snowflake', text: '24h ice-free cooling system' },
            { icon: 'fas fa-barcode', text: 'Integrated barcode reader' },
            { icon: 'fas fa-desktop', text: 'User-friendly tailor-made interface' }
        ],
        specs: [
            ['Throughput', '430 T/H (620 with ISE)'],
            ['Sample Positions', '80 sample positions'],
            ['Reagent Positions', '80 reagent positions'],
            ['Cooling System', '24h non-stop, 2~8°C ice-free cooling'],
            ['Optical System', 'High accuracy filters'],
            ['Safety', 'Probe & washing arm collision protection'],
            ['Features', 'Auto-retest, auto-dilution, reaction curve saved'],
            ['Manufacturer', 'URIT Medical Electronic Co., Ltd.']
        ]
    },
    ca200: {
        brand: 'URIT Medical',
        name: 'CA-200',
        type: 'Automatic Chemistry Analyzer',
        catalog: 'assets/catalogs/CA-200.pdf',
        images: [
            'assets/images/CA-200/CA-200_001.png'
        ],
        highlights: [
            { icon: 'fas fa-tachometer-alt', text: '200 T/H, 350 T/H with ISE' },
            { icon: 'fas fa-compress-alt', text: 'Bench-top compact design' },
            { icon: 'fas fa-snowflake', text: '24h ice-free cooling' },
            { icon: 'fas fa-barcode', text: 'Integrated barcode reader' }
        ],
        specs: [
            ['Throughput', '200 T/H (350 with ISE)'],
            ['Sample Positions', '30 sample positions'],
            ['Reagent Positions', '60 reagent positions'],
            ['Reaction Cuvettes', '90 cuvettes'],
            ['Cooling', '24h non-stop, 2~8°C constant ice-free'],
            ['On-board Parameters', '62 parameters'],
            ['Features', 'One-key pause, auto-retest, auto-dilution'],
            ['Maintenance', 'Auto clean cuvettes, auto lamp sleep']
        ]
    },
    urit880: {
        brand: 'URIT Medical',
        name: 'URIT-880',
        type: 'Semi-automatic Chemistry Analyzer',
        catalog: 'assets/catalogs/URIT-880.pdf',
        images: [
            'assets/images/URIT-880/URIT-880_001.png',
            'assets/images/URIT-880/URIT-880_003.png',
            'assets/images/URIT-880/URIT-880_004.png'
        ],
        highlights: [
            { icon: 'fas fa-tv', text: '7-inch color touch screen' },
            { icon: 'fas fa-filter', text: '8 wavelength filters' },
            { icon: 'fas fa-temperature-high', text: '8 inner incubation positions' },
            { icon: 'fas fa-feather-alt', text: 'Only 5.9 kg' }
        ],
        specs: [
            ['Analysis Method', 'Endpoint, kinetic, 2-point kinetic, polygon'],
            ['Light Source', 'Halogen lamp, 6V/10W'],
            ['Wavelengths', '340, 405, 492, 510, 546, 578, 630, 700 nm'],
            ['Absorbance Range', '-0.3 ~ 4.0 Abs'],
            ['Flowcell', 'Quartz, 10mm optical diameter, 32 µL'],
            ['Temperature', '25°C, 30°C, 37°C & room temp'],
            ['Memory', '300 items, 30,000 test results'],
            ['Interfaces', 'SD, USB ×3, PS/2, LPT, RJ-45'],
            ['Dimensions', '360 × 320 × 145 mm'],
            ['Weight', '~5.9 kg']
        ]
    },
    urit5380: {
        brand: 'URIT Medical',
        name: 'URIT-5380',
        type: '5-Part Differential Hematology Analyzer',
        catalog: 'assets/catalogs/URIT-5380.pdf',
        images: [
            'assets/images/URIT-5380/URIT-5380_001.png',
            'assets/images/URIT-5380/URIT-5380_004.png'
        ],
        highlights: [
            { icon: 'fas fa-chart-bar', text: '34 parameters + 6 research' },
            { icon: 'fas fa-atom', text: 'Flow Cytometry + 4-angle laser' },
            { icon: 'fas fa-tachometer-alt', text: 'Up to 60 samples/hour' },
            { icon: 'fas fa-chart-area', text: '2D scattergrams & 3D stereograms' }
        ],
        specs: [
            ['Parameters', '34 + RETIC_ABS, RETIC%, IRF + 6 research'],
            ['WBC Method', 'Flow Cytometry (FCM) + 4 angles laser scatter'],
            ['RBC/PLT Method', 'Impedance method'],
            ['HGB Test', 'Cyanide-free reagent colorimetry'],
            ['Throughput', 'Up to 60 samples/hour (supports STAT)'],
            ['Auto Loader', '50 samples (10×5 racks), built-in barcode reader'],
            ['Sample Volume', '20 µL (auto, manual, or pre-diluted)'],
            ['Data Storage', '200,000 sample results'],
            ['Display', '17-inch color TFT, Windows system'],
            ['Dimensions', '580 × 750 × 550 mm, ~73 kg'],
            ['LIS', 'Supported with HL7 protocol']
        ]
    },
    bh40p: {
        brand: 'URIT Medical',
        name: 'BH-40P',
        type: '3-Part Differential Hematology Analyzer',
        catalog: 'assets/catalogs/BH-40P.pdf',
        images: [
            'assets/images/BH-40P/BH-40P_001.png',
            'assets/images/BH-40P/BH-40P_005.png'
        ],
        highlights: [
            { icon: 'fas fa-tachometer-alt', text: '42 samples/hour single chamber' },
            { icon: 'fas fa-compress-alt', text: 'Compact minimized size' },
            { icon: 'fas fa-vial', text: 'Only 2 reagents (diluent & lyse)' },
            { icon: 'fas fa-microchip', text: 'RFID reagent close system (optional)' }
        ],
        specs: [
            ['Throughput', '42 samples/hour (single chamber)'],
            ['Sample Volume', '13 µL whole blood, 20 µL pre-dilute'],
            ['Reagent System', '2 reagents — Diluent & Lyse'],
            ['RFID', 'Optional RFID reagent close system'],
            ['Data Storage', '100,000 sample results'],
            ['Design', 'Compact and minimized size'],
            ['Manufacturer', 'URIT Medical Electronic Co., Ltd.']
        ]
    },
    bh6180: {
        brand: 'URIT Medical',
        name: 'BH-6180',
        type: '6-Part Differential Hematology Analyzer',
        catalog: 'assets/catalogs/BH-6180_Brochure_HD-20231201__1_.pdf',
        images: [
            'assets/images/BH-6180_Brochure_HD-20231201_1/BH-6180_Brochure_HD-20231201_1_001.png',
            'assets/images/BH-6180_Brochure_HD-20231201_1/BH-6180_Brochure_HD-20231201_1_006.png',
            'assets/images/BH-6180_Brochure_HD-20231201_1/BH-6180_Brochure_HD-20231201_1_007.png',
            'assets/images/BH-6180_Brochure_HD-20231201_1/BH-6180_Brochure_HD-20231201_1_008.png'
        ],
        highlights: [
            { icon: 'fas fa-chart-bar', text: '44 reportable parameters' },
            { icon: 'fas fa-dna', text: 'Fluorescence Flow Cytometry' },
            { icon: 'fas fa-vial', text: 'One-stop capillary blood testing' },
            { icon: 'fas fa-chart-line', text: 'Dual-channel PLT (PLT-I & PLT-O)' }
        ],
        specs: [
            ['Parameters', '44 reportable including body-fluid analysis'],
            ['Technology', 'Fluorescence Flow Cytometry'],
            ['PLT', 'Dual-channel: PLT-I & PLT-O'],
            ['Special', 'HPC (Hematopoietic Progenitor Cell) alarm'],
            ['Reticulocyte', 'RET(#,%), IRF, RHE information'],
            ['IMG', 'IMG (#,%) for leukemic reaction diagnosis'],
            ['Barcode', '360° rotating code scanning'],
            ['Capillary Blood', 'One-stop capillary blood testing'],
            ['Manufacturer', 'URIT Medical Electronic Co., Ltd.']
        ]
    },
    bg800: {
        brand: 'Cornley',
        name: 'BG-800',
        type: 'Blood Gas Analyzer',
        catalog: 'assets/catalogs/2.Blood_gas_analyzer_-BG-800_Catalog-2023.pdf',
        images: [
            'assets/images/2Blood_gas_analyzer_-BG-800_Catalog-2023/2Blood_gas_analyzer_-BG-800_Catalog-2023_007.png'
        ],
        highlights: [
            { icon: 'fas fa-vials', text: 'pH, pCO₂, pO₂, K⁺, Na⁺, Cl⁻, Ca²⁺, Hct' },
            { icon: 'fas fa-clock', text: 'Analysis time: <90 seconds' },
            { icon: 'fas fa-syringe', text: 'Only 95 µL whole blood' },
            { icon: 'fas fa-database', text: '>10,000 data storage' }
        ],
        specs: [
            ['Models', 'BG-800 (full) | BG-800A (pH, pCO₂, pO₂, Hct)'],
            ['Sample Types', 'Whole blood, Serum, Plasma, Dialysate, CSF'],
            ['pH Range', '6.000 – 9.000'],
            ['pCO₂ Range', '5.0 – 200.0 mmHg'],
            ['pO₂ Range', '0 – 800.0 mmHg'],
            ['K⁺ Range', '0.50 – 10.00 mmol/L'],
            ['Na⁺ Range', '50.0 – 200.0 mmol/L'],
            ['Analysis Time', '<90 seconds'],
            ['Sample Volume', '95 µL whole blood, 50 µL capillary'],
            ['Display', '10.4" TFT touch screen'],
            ['Calibration', 'Automatic 1-point and 2-point'],
            ['Data Storage', '>10,000 records'],
            ['Interfaces', 'RS-232, TCP/IP, USB, barcode reader']
        ]
    },
    vitagas5: {
        brand: 'Cornley',
        name: 'Vitagas 5',
        type: 'Blood Gas Analyzer (2024)',
        catalog: 'assets/catalogs/Blood_gas_analyzer_Vitagas_5_catalog-2024_2.pdf',
        images: [
            'assets/images/Blood_gas_analyzer_Vitagas_5_catalog-2024_2/Blood_gas_analyzer_Vitagas_5_catalog-2024_2_004.png'
        ],
        highlights: [
            { icon: 'fas fa-hospital', text: '16+ department compatibility' },
            { icon: 'fas fa-bolt', text: 'Analysis ~60s (with Glu/Lac <90s)' },
            { icon: 'fas fa-wifi', text: 'WiFi, 4G, remote maintenance' },
            { icon: 'fas fa-baby', text: 'Neonatal diagnostics' }
        ],
        specs: [
            ['Sample Types', 'Whole Blood, Arterial, Venous, Serum, Plasma, CSF'],
            ['Models', 'Vitagas 5 / 5A / 5B / 5E with varying parameter sets'],
            ['Parameters', 'pH, pO₂, pCO₂, Hct, K⁺, Na⁺, Cl⁻, Ca²⁺ (+ Glu, Lac on E model)'],
            ['Calculated Params', '30+ derived including TCO₂, HCO₃⁻, BE, O₂SAT'],
            ['Analysis Speed', '~60s (with Lac/Glu <90s)'],
            ['Blood Volume', '<170 µL for all parameters'],
            ['Connectivity', 'Bi-directional LIS, WiFi, 4G, remote maintenance'],
            ['Reagent Packs', '50–1200 tests/pack, 9 months shelf life'],
            ['QC', 'Multi-level quality control rules and charts'],
            ['Built-in', '2D barcode scanner, thermal printer, UPS'],
            ['Departments', 'Lab, ICU, ER, Anesthesiology, OR, Pediatrics, Neonatology, Cardiology, etc.']
        ]
    },
    aft800: {
        brand: 'AFT',
        name: 'AFT-800',
        type: 'Electrolyte Analyzer',
        catalog: 'assets/catalogs/Electrolyte_analyzer_AFT-800_catalog-2022.pdf',
        images: [
            'assets/images/Electrolyte_analyzer_AFT-800_catalog-2022/Electrolyte_analyzer_AFT-800_catalog-2022_006.png'
        ],
        highlights: [
            { icon: 'fas fa-vials', text: 'K⁺, Na⁺, Cl⁻, Ca²⁺, pH, Li⁺, TCO₂' },
            { icon: 'fas fa-check-double', text: 'SD ≤1.0% accuracy' },
            { icon: 'fas fa-weight-hanging', text: 'Compact: only 12 kg' },
            { icon: 'fas fa-barcode', text: 'Optional barcode scanner' }
        ],
        specs: [
            ['Sample Types', 'Serum, Whole Blood, Plasma, Urine, CSF'],
            ['K⁺ Range', '0.5 ~ 15.0 mmol/L, SD ≤1.0%'],
            ['Na⁺ Range', '20.0 ~ 200.0 mmol/L, SD ≤1.0%'],
            ['Cl⁻ Range', '20.0 ~ 200.0 mmol/L, SD ≤1.0%'],
            ['Ca²⁺ Range', '0.1 ~ 5.0 mmol/L, SD ≤1.5%'],
            ['pH Range', '6.0 ~ 9.0, SD ≤1.0%'],
            ['Li⁺ Range', '0.0 ~ 3.0 mmol/L, SD ≤1.5%'],
            ['Models', 'AFT-800A / B / D / E / F / G / H variants'],
            ['Environment', '10°C–40°C, humidity ≤80%'],
            ['Power', '100V–240V, 50/60Hz, 300VA'],
            ['Dimensions', '340 × 283 × 455 mm'],
            ['Weight', '~12 kg']
        ]
    },
    klitec: {
        brand: 'Cornley',
        name: 'KLite-C',
        type: 'Electrolyte Analyzer',
        catalog: 'assets/catalogs/Electrolyte_analyzer_KLite-C_Catalog.pdf',
        images: [
            'assets/images/Electrolyte_analyzer_KLite-C_Catalog/Electrolyte_analyzer_KLite-C_Catalog_001.png',
            'assets/images/Electrolyte_analyzer_KLite-C_Catalog/Electrolyte_analyzer_KLite-C_Catalog_002.png'
        ],
        highlights: [
            { icon: 'fas fa-bolt', text: 'Results in just 30 seconds' },
            { icon: 'fas fa-hand-pointer', text: 'Touch screen + barcode' },
            { icon: 'fas fa-dollar-sign', text: 'Low cost per test' },
            { icon: 'fas fa-tint', text: 'Sample size: only 65 µL' }
        ],
        specs: [
            ['Sample Types', 'Plasma, Serum, Whole Blood, Urine'],
            ['Models', 'K⁺/Na⁺/Cl⁻ | K⁺/Na⁺/Cl⁻/Ca²⁺/pH'],
            ['Test Time', '30 seconds'],
            ['Sample Volume', '65 µL'],
            ['K⁺ Range', '0.50 ~ 10.00 mmol/L, CV <1.0%'],
            ['Na⁺ Range', '20.0 ~ 200.0 mmol/L, CV <1.0%'],
            ['Cl⁻ Range', '20.0 ~ 200.0 mmol/L, CV <1.0%'],
            ['Ca²⁺ Range', '0.3 ~ 5.0 mmol/L, CV <1.5%'],
            ['pH Range', '6.00 ~ 9.00'],
            ['Storage', '1000+ results'],
            ['Features', 'Auto calibration, sleep mode, self-diagnostic'],
            ['Environment', '5°C–40°C, humidity ≤85%']
        ]
    },
    l300: {
        brand: 'LabSim IVD',
        name: 'L300',
        type: 'Immunofluorescence Analyzer',
        catalog: 'assets/catalogs/L300_a_reagent.pdf',
        images: [
            'assets/images/L300_reagent/L300_reagent_006.png',
            'assets/images/L300_reagent/L300_reagent_010.png'
        ],
        highlights: [
            { icon: 'fas fa-bolt', text: 'Test speed: <10 seconds' },
            { icon: 'fas fa-tablet-alt', text: '8.1" Android touchscreen' },
            { icon: 'fas fa-database', text: '>10,000 record storage' },
            { icon: 'fas fa-vials', text: 'Up to 255 test items' }
        ],
        specs: [
            ['Testing Principle', 'Fluorescence immunoassay'],
            ['Testing Channel', 'Single'],
            ['Test Speed', '<10 seconds per test'],
            ['Test Items', 'Up to 255 items'],
            ['Sample Types', 'Serum, Plasma, Whole Blood, Urine, etc. (9 types)'],
            ['Screen', '8.1" Android touch screen'],
            ['Operation', 'One-step: auto identify, test, discard, print, upload'],
            ['Storage', '>10,000 records'],
            ['Data', 'USB, supports LIS'],
            ['Printer', 'Built-in thermal printer'],
            ['Card Types', 'Bar code & QR code reagent cards'],
            ['Dimensions', '325 × 159 × 202 mm'],
            ['Weight', '3 kg'],
            ['Categories', 'Infection, Hormones, Cardiac, Cancer, Infectious diseases']
        ]
    },
    afs1000: {
        brand: 'AFS',
        name: 'AFS-1000',
        type: 'Fluorescent Immunoanalyzer (POCT)',
        catalog: 'assets/catalogs/AFS-1000.pdf',
        images: [
            'assets/images/AFS-1000/AFS-1000_003.png',
            'assets/images/AFS-1000/AFS-1000_004.png',
            'assets/images/AFS-1000/AFS-1000_005.png',
            'assets/images/AFS-1000/AFS-1000_006.png',
            'assets/images/AFS-1000/AFS-1000_007.png'
        ],
        highlights: [
            { icon: 'fas fa-feather-alt', text: 'Small, light, fast & stable' },
            { icon: 'fas fa-walking', text: 'Indoor & outdoor use' },
            { icon: 'fas fa-crosshairs', text: 'Vertical optical path design' },
            { icon: 'fas fa-bolt', text: 'Test time <10 seconds' }
        ],
        specs: [
            ['Testing Principle', 'Fluorescence immunoassay'],
            ['Testing Channel', 'Single'],
            ['Test Speed', '<10 seconds per test'],
            ['Test Items', 'Up to 255 items'],
            ['Sample Types', 'Serum, Plasma, Whole Blood, Urine, etc. (9 types)'],
            ['Screen', '7" HD LCD'],
            ['Operating System', 'Linux'],
            ['Data Transmission', '4G, USB 2.0, RS232C, WiFi, Ethernet, LIS/HIS'],
            ['Printer', 'Built-in thermal printer'],
            ['Storage', '>10,000 records'],
            ['Dimensions', '215 × 302 × 155 mm'],
            ['Weight', '3 kg'],
            ['Design', 'Vertical optical path — higher efficiency & accuracy']
        ]
    },
    n9fia2002: {
        brand: 'NineKingMed',
        name: 'N9-FIA2002',
        type: 'Fluorescence Immunoassay Analyzer (POCT)',
        catalog: 'assets/catalogs/catalogue_Nineking_med_2026_POCT.pdf',
        images: [
            'assets/images/catalogue_Nineking_med_2026_POCT/catalogue_Nineking_med_2026_POCT_006.png',
            'assets/images/catalogue_Nineking_med_2026_POCT/catalogue_Nineking_med_2026_POCT_007.png'
        ],
        highlights: [
            { icon: 'fas fa-compress-alt', text: 'Compact POCT design' },
            { icon: 'fas fa-bolt', text: 'Rapid fluorescence immunoassay' },
            { icon: 'fas fa-star', text: 'NineKingMed 2026 range' },
            { icon: 'fas fa-id-card', text: 'FIA Test Card based system' }
        ],
        specs: [
            ['Testing Principle', 'N9 Fluorescence Immunoassay'],
            ['System', 'FIA Test Card based'],
            ['Card Storage', 'Room temperature: 10–30°C (50–86°F)'],
            ['Shelf Life', '24 months'],
            ['Test Types', 'CRP, and wide range of POCT markers'],
            ['Brand', 'NineKingMed'],
            ['Year', '2026 POCT Catalogue']
        ]
    }
};

function initQuickView() {
    const modal = document.getElementById('product-quickview-modal');
    const closeBtn = modal?.querySelector('.quickview-modal-close');
    const mainImg = document.getElementById('qv-main-img');
    const thumbsContainer = document.getElementById('qv-thumbs');
    const brandEl = document.getElementById('qv-brand');
    const titleEl = document.getElementById('qv-title');
    const typeEl = document.getElementById('qv-type');
    const highlightsEl = document.getElementById('qv-highlights');
    const specsEl = document.getElementById('qv-specs');
    const inquireBtn = document.getElementById('qv-inquire-btn');
    const catalogLink = document.getElementById('qv-catalog-link');

    if (!modal) return;

    // Delegate click for quick-view buttons
    document.addEventListener('click', e => {
        const btn = e.target.closest('.quick-view-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const productId = btn.dataset.productId;
        openQuickView(productId);
    });

    // Also allow double-click on product card image
    document.addEventListener('dblclick', e => {
        const card = e.target.closest('.product-card[data-product-id]');
        if (!card || e.target.closest('.inquire-btn') || e.target.closest('.btn-ghost') || e.target.closest('.quick-view-btn')) return;
        openQuickView(card.dataset.productId);
    });

    function openQuickView(productId) {
        const product = PRODUCT_DATA[productId];
        if (!product) return;

        // Fill brand, title, type
        brandEl.textContent = product.brand;
        titleEl.textContent = product.name;
        typeEl.textContent = product.type;

        // Fill main image
        mainImg.src = product.images[0];
        mainImg.alt = product.name;

        // Fill thumbnails
        thumbsContainer.innerHTML = '';
        product.images.forEach((img, i) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.alt = `${product.name} view ${i + 1}`;
            if (i === 0) thumb.classList.add('active');
            thumb.addEventListener('click', () => {
                mainImg.src = img;
                thumbsContainer.querySelectorAll('img').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            thumbsContainer.appendChild(thumb);
        });

        // Fill highlights
        highlightsEl.innerHTML = product.highlights.map(h =>
            `<span class="qv-highlight"><i class="${h.icon}"></i> ${h.text}</span>`
        ).join('');

        // Fill specs table
        specsEl.innerHTML = '<table>' + product.specs.map(([label, value]) =>
            `<tr><td>${label}</td><td>${value}</td></tr>`
        ).join('') + '</table>';

        // Set inquire button
        inquireBtn.dataset.product = `${product.name} ${product.type}`;

        // Set catalog link
        catalogLink.href = product.catalog;

        // Open modal
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeQuickView() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeQuickView();
    });

    // ESC key to close any modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('open')) closeQuickView();
            const inquiryModal = document.getElementById('inquiry-modal');
            if (inquiryModal && inquiryModal.classList.contains('open')) {
                inquiryModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
    });
}
