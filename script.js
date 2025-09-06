// =====================================================
// CINEMATIC FLOW - Premium Video Portfolio JavaScript
// =====================================================

// Configuration globale
const CONFIG = {
    smoothScroll: true,
    magneticStrength: 0.2,
    cursorLag: 0.1,
    videoPreloadDelay: 300,
    snapScrollThreshold: 50,
    parallaxSpeed: 0.5
};

// =====================================================
// LOADER & INITIALIZATION
// =====================================================
window.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const loaderText = document.querySelectorAll('.loader-text span');
    
    // Animation du texte du loader
    loaderText.forEach((span, i) => {
        span.style.setProperty('--i', i);
    });
    
    // Masquer le loader après le chargement
    setTimeout(() => {
        loader.classList.add('hidden');
        initializeApp();
    }, 2000);
});

function initializeApp() {
    initCustomCursor();
    initSnapScroll();
    initNavigation();
    initVideoPreview();
    initVideoModal();
    initAnimations();
    initParallax();
    initFormHandling();
    initSoundToggle();
    initFilters();
    initCounters();
    updateTime();
}

// =====================================================
// CUSTOM CURSOR
// =====================================================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const cursorText = document.querySelector('.cursor-text');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let cursorX = 0, cursorY = 0;
    
    // Mise à jour de la position de la souris
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation fluide du curseur
    function animateCursor() {
        // Curseur principal avec léger lag
        cursorX += (mouseX - cursorX) * 0.9;
        cursorY += (mouseY - cursorY) * 0.9;
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        // Follower avec plus de lag
        followerX += (mouseX - followerX) * CONFIG.cursorLag;
        followerY += (mouseY - followerY) * CONFIG.cursorLag;
        follower.style.left = followerX - 20 + 'px';
        follower.style.top = followerY - 20 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('button, a, .video-card, .menu-toggle, .nav-dot, .filter-tab');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            
            // Texte spécial pour les vidéos
            if (el.classList.contains('video-card')) {
                cursorText.textContent = 'VIEW';
                cursorText.classList.add('visible');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorText.classList.remove('visible');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
    
    // Position du texte du curseur
    document.addEventListener('mousemove', (e) => {
        cursorText.style.left = e.clientX + 30 + 'px';
        cursorText.style.top = e.clientY - 30 + 'px';
    });
}

// =====================================================
// NAVIGATION SIMPLE
// =====================================================
function initSnapScroll() {
    const navDots = document.querySelectorAll('.nav-dot');
    const progressBar = document.querySelector('.progress-bar-global');
    const sections = document.querySelectorAll('.section');
    
    // Progress bar au scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / height) * 100;
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    });
    
    // Observer pour les dots de navigation
    const observerOptions = {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.dataset.section);
                if (!isNaN(index)) {
                    navDots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                    triggerSectionAnimations(entry.target);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Click sur les dots pour naviguer
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Click sur le bouton CTA
    const ctaBtn = document.querySelector('.cta-primary');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            document.getElementById('works').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// =====================================================
// NAVIGATION & MENU
// =====================================================
function initNavigation() {
    const nav = document.querySelector('.nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const socialLinks = document.querySelectorAll('.social-link');
    
    // Menu toggle
    menuToggle.addEventListener('click', () => {
        const isActive = menuToggle.classList.toggle('active');
        menuOverlay.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
        
        // Reset animations
        if (isActive) {
            menuLinks.forEach((link, i) => {
                link.style.animation = 'none';
                setTimeout(() => {
                    link.style.animation = '';
                }, 10);
            });
        }
    });
    
    // Fermer le menu au clic sur un lien
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            // Fermer le menu
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Attendre la fermeture puis scroller
            setTimeout(() => {
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Nav background on scroll
    const heroSection = document.getElementById('hero');
    const observer = new IntersectionObserver(
        ([entry]) => {
            nav.classList.toggle('scrolled', !entry.isIntersecting);
        },
        { threshold: 0.9 }
    );
    observer.observe(heroSection);
}

// =====================================================
// VIDEO PREVIEW ON HOVER
// =====================================================
function initVideoPreview() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        const video = card.querySelector('.preview-video');
        const poster = card.querySelector('.video-poster');
        let hoverTimeout;
        
        card.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                if (video && video.readyState >= 2) {
                    video.play().catch(err => console.log('Autoplay prevented:', err));
                }
            }, CONFIG.videoPreloadDelay);
        });
        
        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });
}

// =====================================================
// VIDEO MODAL PLAYER
// =====================================================
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = document.getElementById('closeModal');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const progressBar = modal.querySelector('.progress-bar');
    const videoTime = modal.querySelector('.video-time');
    
    const watchBtns = document.querySelectorAll('.watch-btn');
    
    // Ouvrir le modal
    watchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.video-card');
            const videoSrc = card.querySelector('.preview-video source').src;
            const title = card.querySelector('.video-title').textContent;
            
            modalVideo.src = videoSrc;
            modal.querySelector('.modal-video-title').textContent = title;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            modalVideo.play();
        });
    });
    
    // Fermer le modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalVideo.pause();
        modalVideo.src = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Contrôles vidéo custom
    playPauseBtn.addEventListener('click', () => {
        if (modalVideo.paused) {
            modalVideo.play();
            playPauseBtn.classList.add('playing');
        } else {
            modalVideo.pause();
            playPauseBtn.classList.remove('playing');
        }
    });
    
    // Mise à jour de la progression
    modalVideo.addEventListener('timeupdate', () => {
        const progress = (modalVideo.currentTime / modalVideo.duration) * 100;
        progressBar.style.width = progress + '%';
        
        const currentMinutes = Math.floor(modalVideo.currentTime / 60);
        const currentSeconds = Math.floor(modalVideo.currentTime % 60);
        const durationMinutes = Math.floor(modalVideo.duration / 60);
        const durationSeconds = Math.floor(modalVideo.duration % 60);
        
        videoTime.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')} / ${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;
    });
    
    // Click sur la barre de progression
    const videoProgress = modal.querySelector('.video-progress');
    videoProgress.addEventListener('click', (e) => {
        const rect = videoProgress.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        modalVideo.currentTime = pos * modalVideo.duration;
    });
    
    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            modal.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
    
    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                playPauseBtn.click();
                break;
            case 'Escape':
                closeModal();
                break;
            case 'f':
                fullscreenBtn.click();
                break;
            case 'ArrowLeft':
                modalVideo.currentTime -= 10;
                break;
            case 'ArrowRight':
                modalVideo.currentTime += 10;
                break;
        }
    });
}

// =====================================================
// ANIMATIONS & SCROLL TRIGGERS
// =====================================================
function initAnimations() {
    // Animation des lettres du titre
    const heroLetters = document.querySelectorAll('.hero .letter');
    heroLetters.forEach((letter, i) => {
        letter.style.setProperty('--i', i);
    });
    
    // Animation des mots du sous-titre
    const subtitleWords = document.querySelectorAll('.subtitle-word');
    subtitleWords.forEach((word, i) => {
        word.style.setProperty('--i', i);
    });
    
    // Observer pour les animations au scroll
    const animatedElements = document.querySelectorAll('.video-card, .stat-item, .service-tag');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Pour les cartes vidéo, animer avec un délai
                if (entry.target.classList.contains('video-card')) {
                    const index = entry.target.dataset.index;
                    entry.target.style.setProperty('--index', index);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
}

// =====================================================
// PARALLAX EFFECTS
// =====================================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-speed]');
    const container = document.querySelector('.scroll-container');
    
    container.addEventListener('scroll', () => {
        const scrolled = container.scrollTop;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// =====================================================
// MAGNETIC BUTTONS
// =====================================================
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * CONFIG.magneticStrength}px, ${y * CONFIG.magneticStrength}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// =====================================================
// FORM HANDLING
// =====================================================
function initFormHandling() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animation du bouton
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '<span class="btn-text">SENDING...</span><div class="btn-bg"></div>';
        
        // Simulation d'envoi (remplacer par vraie API)
        setTimeout(() => {
            formSuccess.classList.add('show');
            
            // Reset après 3 secondes
            setTimeout(() => {
                formSuccess.classList.remove('show');
                form.reset();
                submitBtn.innerHTML = '<span class="btn-text">SEND MESSAGE</span><div class="btn-bg"></div>';
            }, 3000);
        }, 1500);
    });
    
    // Animation des labels flottants
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

// =====================================================
// SOUND TOGGLE
// =====================================================
function initSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    const soundLabel = soundToggle.querySelector('.sound-label');
    const heroVideo = document.getElementById('heroVideo');
    let isMuted = true;
    
    soundToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        heroVideo.muted = isMuted;
        
        soundToggle.classList.toggle('playing', !isMuted);
        soundLabel.textContent = isMuted ? 'SOUND OFF' : 'SOUND ON';
    });
}

// =====================================================
// FILTERS
// =====================================================
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const videoCards = document.querySelectorAll('.video-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter cards
            videoCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// =====================================================
// COUNTERS ANIMATION
// =====================================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const countUp = (counter) => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => countUp(counter), 10);
        } else {
            counter.innerText = target;
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// =====================================================
// SMOOTH SCROLL FOR CTA - SUPPRIMÉ CAR DÉJÀ DANS HTML
// =====================================================
function initSmoothScroll() {
    // Fonction vide car le onclick est directement dans le HTML
}

// =====================================================
// TIME UPDATE
// =====================================================
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    
    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    update();
    setInterval(update, 1000);
}

// =====================================================
// TRIGGER SECTION ANIMATIONS
// =====================================================
function triggerSectionAnimations(section) {
    // Animation spécifique par section
    const sectionId = section.id;
    
    switch(sectionId) {
        case 'hero':
            // Relancer l'animation du titre si nécessaire
            break;
        case 'works':
            // Animer les cartes vidéo en cascade
            const cards = section.querySelectorAll('.video-card');
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.classList.add('reveal');
                }, i * 100);
            });
            break;
        case 'about':
            // Animer les stats
            break;
        case 'contact':
            // Focus sur le premier champ
            break;
    }
}

// =====================================================
// LOAD MORE FUNCTIONALITY
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.classList.add('loading');
            
            // Simulation du chargement (remplacer par vraie API)
            setTimeout(() => {
                // Ajouter plus de vidéos ici
                this.classList.remove('loading');
                
                // Si plus de vidéos, masquer le bouton
                // this.style.display = 'none';
            }, 2000);
        });
    }
});

// =====================================================
// PERFORMANCE OPTIMIZATIONS
// =====================================================

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =====================================================
// INIT EVERYTHING ON LOAD
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize smooth scroll for CTA
    initSmoothScroll();
    
    // Initialize magnetic buttons
    initMagneticButtons();
    
    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
    
    // Prevent default drag behavior on images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
    
    // Add subtle page transition
    const links = document.querySelectorAll('a[href^="#"]');
    const transitionLayer = document.querySelector('.page-transition');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (target && target !== '#') {
                transitionLayer.classList.add('active');
                setTimeout(() => {
                    transitionLayer.classList.remove('active');
                }, 600);
            }
        });
    });
    


    console.log('🎬 CINEMATIC FLOW - Portfolio initialized successfully!');
});
// --- Kill ambience only on *click* "Watch now" ---
(function () {
  const audio  = document.getElementById('ambienceAudio');
  const toggle = document.getElementById('soundToggle');
  const label  = toggle?.querySelector('.sound-label');
  if (!toggle || !audio) return;

  function killAmbience() {
    toggle.classList.remove('playing');
    if (label) label.textContent = 'SOUND OFF';
    try { audio.pause(); } catch {}
    audio.currentTime = 0;
  }

  // Couper UNIQUEMENT au clic sur un bouton/lien "Watch now"
  document.addEventListener('click', (e) => {
    const el = e.target.closest(
      '.watch-now, [data-watch-now], a[href*="watch"], button[aria-label*="Watch"], a[aria-label*="Watch"]'
    );
    if (el) killAmbience();
  }, false); // pas en capture
})();
// --- Kill ambience ONLY on click "Watch now" (robuste) ---
(function () {
  const audio  = document.getElementById('ambienceAudio');
  const toggle = document.getElementById('soundToggle');
  const label  = toggle?.querySelector('.sound-label');
  if (!toggle || !audio) return;

  function killAmbience() {
    toggle.classList.remove('playing');
    if (label) label.textContent = 'SOUND OFF';
    try { audio.pause(); } catch {}
    audio.currentTime = 0;
  }

  // Capture tôt pour ne pas rater le clic même si d'autres scripts stoppent la propagation
  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('[data-watch-now]');
    if (el) killAmbience();
  }, true);
})();


// Curseur toujours visible dès qu'on lance "Watch now" ; redevient normal à la fermeture
(function () {
  const enable = () => document.body.classList.add('force-cursor');
  const disable = () => document.body.classList.remove('force-cursor');

  // Au clic sur "Watch now" (adapter le sélecteur si besoin)
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-watch-now], .watch-now, a[href*="watch"]');
    if (el) enable();
  }, false);

  // À la fermeture du player (bouton close / ESC)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.modal-close, .lightbox-close, [data-close], .btn-close')) disable();
  }, false);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') disable(); });

  // En plein écran, garde le curseur visible
  document.addEventListener('fullscreenchange', enable);
})();
