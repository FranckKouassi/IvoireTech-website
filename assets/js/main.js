/**
 * IvTech Solutions — Main JavaScript
 * Version: 2.1 — perf + a11y
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const $header = document.getElementById('header');
    const $navMenu = document.getElementById('nav-menu');
    const $navToggle = document.getElementById('nav-toggle');
    const $navClose = document.getElementById('nav-close');
    const $navLinks = document.querySelectorAll('.nav__link');
    const $scrollUp = document.getElementById('scroll-up');
    const $themeButton = document.getElementById('theme-button');
    const $html = document.documentElement;
    const logoImg = document.querySelector('.nav__logo img');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ===== Helpers ===== */
    const rafThrottle = (fn) => {
        let ticking = false;
        return () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                fn();
                ticking = false;
            });
        };
    };

    /* ===== Menu mobile ===== */
    const openMenu = () => {
        if (!$navMenu) return;
        $navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden';
        if ($navToggle) {
            $navToggle.setAttribute('aria-expanded', 'true');
            $navToggle.setAttribute('aria-label', 'Fermer le menu');
        }
        const firstLink = $navMenu.querySelector('.nav__link');
        if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
        if (!$navMenu) return;
        $navMenu.classList.remove('show-menu');
        document.body.style.overflow = '';
        if ($navToggle) {
            $navToggle.setAttribute('aria-expanded', 'false');
            $navToggle.setAttribute('aria-label', 'Ouvrir le menu');
        }
    };

    if ($navToggle) {
        $navToggle.setAttribute('aria-controls', 'nav-menu');
        $navToggle.setAttribute('aria-expanded', 'false');
        $navToggle.addEventListener('click', () => {
            $navMenu && $navMenu.classList.contains('show-menu') ? closeMenu() : openMenu();
        });
    }
    if ($navClose) $navClose.addEventListener('click', closeMenu);
    $navLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && $navMenu && $navMenu.classList.contains('show-menu')) {
            closeMenu();
            if ($navToggle) $navToggle.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (!$navMenu || !$navMenu.classList.contains('show-menu')) return;
        if ($navMenu.contains(e.target) || ($navToggle && $navToggle.contains(e.target))) return;
        closeMenu();
    });

    /* ===== Header + scroll-up + progression de lecture (throttled, passive) ===== */
    const $hero = document.querySelector('.hero');
    const $heroCanvas = document.getElementById('hero-canvas');

    const onScroll = rafThrottle(() => {
        const y = window.scrollY;
        if ($header) $header.classList.toggle('scrolled', y >= 40);
        if ($scrollUp) $scrollUp.classList.toggle('show-scroll', y >= 500);

        // Barre de progression : indicateur d'avancement dans la page.
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
        $html.style.setProperty('--scroll-progress', progress.toFixed(4));

        // Parallaxe du hero : le contenu s'efface pendant que le bloc
        // suivant glisse par-dessus. Effet cinématique, coût nul (transform).
        if ($hero && !reduceMotion) {
            const heroH = $hero.offsetHeight || 1;
            const t = Math.min(y / heroH, 1);
            $hero.style.setProperty('--hero-shift', (t * 70).toFixed(2) + 'px');
            $hero.style.setProperty('--hero-fade', Math.max(0, 1 - t * 1.35).toFixed(3));
        }
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ===== Lien actif selon l'URL ===== */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else if (!href.startsWith('#')) {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    /* ===== Bouton retour en haut ===== */
    if ($scrollUp) {
        $scrollUp.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ===== Défilement fluide + décalage header ===== */
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const [path, hash] = href.split('#');
            const current = window.location.pathname.split('/').pop() || 'index.html';
            if ((!path || path === current) && hash) {
                const target = document.getElementById(hash);
                if (target) {
                    e.preventDefault();
                    const offset = target.getBoundingClientRect().top + window.pageYOffset - ($header ? $header.offsetHeight : 0) - 20;
                    window.history.pushState(null, '', '#' + hash);
                    window.scrollTo({ top: offset, behavior: reduceMotion ? 'auto' : 'smooth' });
                }
            }
        });
    });

    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const offset = target.getBoundingClientRect().top + window.pageYOffset - ($header ? $header.offsetHeight : 0) - 20;
                window.scrollTo({ top: offset, behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        }, 200);
    }

    /* ===== Révélation au scroll =====
       Le délai passe par une variable CSS (transition-delay) plutôt que par
       un setTimeout : l'enchaînement reste régulier même pendant un scroll
       rapide, et l'animation reste pilotée par le compositeur. */
    const revealEls = document.querySelectorAll('[data-aos]');

    // Cascade automatique pour les enfants directs d'une grille qui
    // n'ont pas de délai explicite dans le HTML.
    const STAGGER_CONTAINERS = '.services__grid, .sectors-grid, .grid, .stats__grid, .home-team-roster__grid, .footer__top';
    document.querySelectorAll(STAGGER_CONTAINERS).forEach(container => {
        let rank = 0;
        Array.from(container.children).forEach(child => {
            if (!child.hasAttribute('data-aos')) return;
            if (!child.hasAttribute('data-aos-delay')) {
                child.setAttribute('data-aos-delay', String(Math.min(rank * 70, 420)));
            }
            rank++;
        });
    });

    const armReveal = (el) => {
        const delay = Number(el.getAttribute('data-aos-delay')) || 0;
        if (delay) el.style.setProperty('--aos-delay', delay + 'ms');
        el.classList.add('is-arming');
        el.classList.add('aos-animate');
        // La promotion GPU n'a plus lieu d'être une fois la transition finie.
        const cleanup = () => {
            el.classList.remove('is-arming');
            el.style.removeProperty('--aos-delay');
        };
        el.addEventListener('transitionend', cleanup, { once: true });
        setTimeout(cleanup, delay + 1400);
    };

    if (reduceMotion) {
        revealEls.forEach(el => el.classList.add('aos-animate'));
        $html.classList.add('no-aos');
    } else if ('IntersectionObserver' in window && revealEls.length) {
        // threshold 0 : un grand bloc dont seul le haut entre dans l'écran
        // doit se révéler. La marge basse négative évite qu'il s'anime
        // pendant qu'il est encore sous la ligne de flottaison.
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                armReveal(entry.target);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(el => revealObserver.observe(el));

        // Filet de sécurité : sans le moindre défilement, rien de ce qui est
        // déjà à l'écran ne doit rester invisible.
        setTimeout(() => {
            revealEls.forEach(el => {
                if (el.classList.contains('aos-animate')) return;
                const r = el.getBoundingClientRect();
                if (r.top < window.innerHeight && r.bottom > 0) {
                    revealObserver.unobserve(el);
                    armReveal(el);
                }
            });
        }, 1200);
    } else {
        $html.classList.add('no-aos');
    }

    /* ===== Compteurs animés ===== */
    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        if (Number.isNaN(target)) return;
        const item = el.closest('.stat__item');
        const decimals = (target % 1 !== 0) ? 1 : 0;

        if (reduceMotion) {
            el.textContent = target.toFixed(decimals);
            if (item) item.classList.add('is-counted');
            return;
        }

        // Décélération exponentielle : les derniers chiffres se posent
        // doucement au lieu de s'arrêter net.
        const duration = 1900;
        const delay = Number(el.getAttribute('data-count-delay')) || 0;
        const run = () => {
            const start = performance.now();
            const step = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
                el.textContent = (target * eased).toFixed(decimals);
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = target.toFixed(decimals);
            };
            if (item) item.classList.add('is-counted');
            requestAnimationFrame(step);
        };
        el.textContent = (0).toFixed(decimals);
        delay ? setTimeout(run, delay) : run();
    };

    const counters = document.querySelectorAll('.counter');
    if ('IntersectionObserver' in window && counters.length) {
        // Léger décalage entre les chiffres d'une même bande : la lecture
        // se fait de gauche à droite au lieu d'un bloc qui s'agite.
        counters.forEach((c, i) => c.setAttribute('data-count-delay', String(i * 140)));
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.45 });
        counters.forEach(c => counterObserver.observe(c));
    }

    /* ===== Thème clair / sombre ===== */
    const setLogo = (theme) => {
        if (!logoImg) return;
        logoImg.src = theme === 'dark'
            ? 'assets/images/IvTech-Logo-Horizontal-FondSombre.svg'
            : 'assets/images/IvTech-Logo-Horizontal-Couleur.svg';
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    $html.classList.toggle('dark-theme', savedTheme === 'dark');
    setLogo(savedTheme);
    if ($themeButton) {
        $themeButton.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
        $themeButton.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');
        $themeButton.setAttribute('aria-label', savedTheme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
        $themeButton.addEventListener('click', () => {
            const isDark = $html.classList.toggle('dark-theme');
            const theme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            $themeButton.innerHTML = isDark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
            $themeButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            $themeButton.setAttribute('aria-label', isDark ? 'Activer le thème clair' : 'Activer le thème sombre');
            setLogo(theme);
        });
    }

    /* ===== Formulaire de contact ===== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const statusEl = document.getElementById('form-status');
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }
            const lang = localStorage.getItem('selectedLang') || 'fr';
            const msg = (window.translations && window.translations[lang] && window.translations[lang].form_success)
                || 'Votre message a bien été envoyé ! Nous vous recontactons rapidement.';
            const btn = this.querySelector('button[type="submit"]');
            if (statusEl) {
                statusEl.textContent = msg;
                statusEl.classList.add('is-visible');
            }
            if (btn) {
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> <span>' + msg + '</span>';
                btn.disabled = true;
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    this.reset();
                    if (statusEl) {
                        statusEl.textContent = '';
                        statusEl.classList.remove('is-visible');
                    }
                }, 3500);
            } else {
                this.reset();
            }
        });
    }

    /* ===== Halo suivant le curseur sur les cartes média =====
       Deux variables CSS pilotent un pseudo-élément déjà positionné :
       aucune recomposition de mise en page, uniquement du transform. */
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (finePointer && !reduceMotion) {
        const spotlightCards = document.querySelectorAll('.media-card');
        let pointerFrame = 0;

        spotlightCards.forEach(card => {
            card.addEventListener('pointermove', (e) => {
                if (pointerFrame) return;
                pointerFrame = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                    card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
                    pointerFrame = 0;
                });
            }, { passive: true });

            card.addEventListener('pointerleave', () => {
                card.style.removeProperty('--mx');
                card.style.removeProperty('--my');
            });
        });

        /* ===== Aimantation discrète des appels à l'action =====
           Le bouton suit le curseur de quelques pixels dans sa zone :
           la cible paraît plus facile à atteindre (loi de Fitts). */
        const MAGNET_RANGE = 6;
        document.querySelectorAll('.btn--primary').forEach(btn => {
            let magnetFrame = 0;
            btn.addEventListener('pointermove', (e) => {
                if (magnetFrame) return;
                magnetFrame = requestAnimationFrame(() => {
                    const rect = btn.getBoundingClientRect();
                    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                    btn.style.setProperty('--magnet-x', (dx * MAGNET_RANGE).toFixed(2) + 'px');
                    btn.style.setProperty('--magnet-y', (dy * MAGNET_RANGE * 0.5).toFixed(2) + 'px');
                    magnetFrame = 0;
                });
            }, { passive: true });

            btn.addEventListener('pointerleave', () => {
                btn.style.setProperty('--magnet-x', '0px');
                btn.style.setProperty('--magnet-y', '0px');
            });
        });
    }

    /* ===== Apparition en fondu du canvas du hero ===== */
    if ($heroCanvas) {
        requestAnimationFrame(() => $heroCanvas.classList.add('is-ready'));
    }

    /* ===== Lazy native images fallback attribute ===== */
    document.querySelectorAll('img:not([loading])').forEach(img => {
        if (!img.closest('.nav__logo') && !img.closest('.footer__logo')) {
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
        }
    });
});
