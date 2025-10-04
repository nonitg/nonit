document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    console.log("Click the fluid toggle button 4 times :)")
    // Toggle menu
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('toggle');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside (overlay)
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !burger.contains(e.target)) {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Header scroll effect with glassmorphism - optimized for smoothness
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateHeader = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect on abstract visual
    const abstractVisual = document.querySelector('.abstract-visual');
    if (abstractVisual) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            
            // Move the entire visual
            abstractVisual.style.transform = `translate(${x}px, ${y}px)`;
            
            // Individual parallax for shapes
            const shapes = abstractVisual.querySelectorAll('.geometric-shape');
            shapes.forEach((shape, index) => {
                const depth = (index + 1) * 0.5;
                shape.style.transform = `translate(${x * depth}px, ${y * depth}px) rotateX(${y * 0.5}deg) rotateY(${x * 0.5}deg)`;
            });
            
            // Parallax for particles
            const particles = abstractVisual.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                const depth = (index + 1) * 0.3;
                particle.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
            
            // Parallax for spheres
            const spheres = abstractVisual.querySelectorAll('.gradient-sphere');
            spheres.forEach((sphere, index) => {
                const depth = (index + 1) * 0.2;
                sphere.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });
    }
    
    // Fluid Simulation Toggle (always starts enabled, no persistence)
    const fluidToggle = document.getElementById('fluid-toggle');
    const mobileFluidToggle = document.getElementById('mobile-fluid-toggle');
    const fluidCanvas = document.getElementById('fluid-canvas');
    let isFluidEnabled = true;
    
    // Easter egg tracking
    let clickCount = 0;
    let clickTimer = null;
    const CLICK_WINDOW = 2000; // 2 seconds to click 4 times
    const REQUIRED_CLICKS = 4;
    
    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth <= 768;
    
    // Ensure fluid sim is enabled on load (wait for it to be fully initialized)
    const ensureFluidEnabled = () => {
        // Check if fluid sim exists AND has been properly initialized with framebuffers ready
        if (window.fluidSim && window.fluidSim.canvas && window.fluidSim.isInitialized && window.fluidSim.framebuffersReady) {
            window.fluidSim.enabled = true;
            fluidCanvas.classList.remove('hidden');
            // Force canvas to be visible
            fluidCanvas.style.opacity = '1';
            fluidCanvas.style.display = 'block';
            if (fluidToggle) fluidToggle.classList.remove('disabled');
            if (mobileFluidToggle) mobileFluidToggle.classList.remove('disabled');
            console.log('✓ Fluid simulation active and rendering');
            
            // Verify it's actually rendering after a short delay
            setTimeout(() => {
                if (window.fluidSim && window.fluidSim.frameCount > 0) {
                    console.log(`✓ Confirmed: ${window.fluidSim.frameCount} frames rendered`);
                } else {
                    console.warn('⚠ Fluid simulation started but no frames rendered yet');
                }
            }, 500);
        } else {
            // Retry if not yet initialized (max 5 seconds with exponential backoff)
            if (!ensureFluidEnabled.attempts) ensureFluidEnabled.attempts = 0;
            ensureFluidEnabled.attempts++;
            
            if (ensureFluidEnabled.attempts < 50) {
                // Exponential backoff: start fast, slow down if taking longer
                const delay = Math.min(100 * Math.pow(1.1, ensureFluidEnabled.attempts), 500);
                setTimeout(ensureFluidEnabled, delay);
            } else {
                console.error('✗ Fluid simulation initialization timeout - please refresh');
            }
        }
    };
    // Start checking immediately
    ensureFluidEnabled();
    
    // Toggle function
    const toggleFluid = () => {
        // Check if fluid sim is properly initialized
        if (!window.fluidSim || !window.fluidSim.canvas || !window.fluidSim.isInitialized) {
            console.warn('⚠ Fluid simulation not ready - please wait a moment');
            return;
        }
        
        isFluidEnabled = !isFluidEnabled;
        
        if (isFluidEnabled) {
            if (fluidToggle) fluidToggle.classList.remove('disabled');
            if (mobileFluidToggle) mobileFluidToggle.classList.remove('disabled');
            fluidCanvas.classList.remove('hidden');
            fluidCanvas.style.opacity = '1';
            window.fluidSim.enabled = true;
            console.log('✓ Fluid effect enabled');
        } else {
            if (fluidToggle) fluidToggle.classList.add('disabled');
            if (mobileFluidToggle) mobileFluidToggle.classList.add('disabled');
            fluidCanvas.classList.add('hidden');
            window.fluidSim.enabled = false;
            console.log('✓ Fluid effect disabled');
        }
    };
    
    // Easter egg handler
    const handleEasterEgg = () => {
        clickCount++;
        
        // Reset timer
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, CLICK_WINDOW);
        
        // Check if reached required clicks
        if (clickCount >= REQUIRED_CLICKS) {
            clickCount = 0;
            clearTimeout(clickTimer);
            openFluidPlayground();
        }
    };
    
    // Open fluid playground
    const openFluidPlayground = () => {
        const playground = document.getElementById('fluid-playground');
        if (playground) {
            playground.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Init playground canvas with vibrant settings
            if (!window.playgroundSim) {
                window.playgroundSim = new FluidSimulation('playground-canvas', true);
                // Set initial vibrant settings
                window.playgroundSim.setColorIntensity(0.07);
                window.playgroundSim.config.CURL = 2.5;
                window.playgroundSim.config.DENSITY_DISSIPATION = 0.96;
                window.playgroundSim.config.SPLAT_RADIUS = 0.18;
            } else {
                window.playgroundSim.enabled = true;
            }
        }
    };
    
    // Close fluid playground
    window.closeFluidPlayground = () => {
        const playground = document.getElementById('fluid-playground');
        if (playground) {
            playground.classList.remove('active');
            document.body.style.overflow = '';
            
            if (window.playgroundSim) {
                window.playgroundSim.enabled = false;
            }
        }
    };
    
    // Desktop toggle
    if (fluidToggle) {
        fluidToggle.addEventListener('click', () => {
            handleEasterEgg();
            toggleFluid();
        });
    }
    
    // Mobile toggle
    if (mobileFluidToggle) {
        mobileFluidToggle.addEventListener('click', () => {
            handleEasterEgg();
            toggleFluid();
            // Close menu after toggling
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Playground controls
    const setupPlaygroundControls = () => {
        const colorIntensity = document.getElementById('color-intensity');
        const swirlAmount = document.getElementById('swirl-amount');
        const fadeSpeed = document.getElementById('fade-speed');
        const splatSize = document.getElementById('splat-size');
        const resetBtn = document.getElementById('playground-reset');
        const minimizeBtn = document.getElementById('controls-minimize');
        const controlsPanel = document.getElementById('playground-controls');
        
        // Minimize/maximize controls
        if (minimizeBtn && controlsPanel) {
            minimizeBtn.addEventListener('click', () => {
                controlsPanel.classList.toggle('minimized');
            });
        }
        
        if (colorIntensity) {
            colorIntensity.addEventListener('input', (e) => {
                if (window.playgroundSim) {
                    window.playgroundSim.setColorIntensity(parseFloat(e.target.value) / 100);
                }
            });
        }
        
        if (swirlAmount) {
            swirlAmount.addEventListener('input', (e) => {
                if (window.playgroundSim) {
                    window.playgroundSim.config.CURL = parseFloat(e.target.value) / 10;
                }
            });
        }
        
        if (fadeSpeed) {
            fadeSpeed.addEventListener('input', (e) => {
                if (window.playgroundSim) {
                    window.playgroundSim.config.DENSITY_DISSIPATION = parseFloat(e.target.value) / 100;
                }
            });
        }
        
        if (splatSize) {
            splatSize.addEventListener('input', (e) => {
                if (window.playgroundSim) {
                    window.playgroundSim.config.SPLAT_RADIUS = parseFloat(e.target.value) / 100;
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reset controls
                if (colorIntensity) colorIntensity.value = 7;
                if (swirlAmount) swirlAmount.value = 25;
                if (fadeSpeed) fadeSpeed.value = 96;
                if (splatSize) splatSize.value = 18;
                
                // Reinit simulation
                if (window.playgroundSim) {
                    window.playgroundSim = new FluidSimulation('playground-canvas', true);
                }
            });
        }
    };
    
    setupPlaygroundControls();
});