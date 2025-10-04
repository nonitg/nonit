document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
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
    
    // Fluid Simulation Toggle with persistence
    const fluidToggle = document.getElementById('fluid-toggle');
    const fluidCanvas = document.getElementById('fluid-canvas');
    
    // Load saved state from localStorage (default: enabled)
    const savedState = localStorage.getItem('fluidEffectEnabled');
    let isFluidEnabled = savedState === null ? true : savedState === 'true';
    
    // Apply initial state
    const updateFluidState = (enabled) => {
        isFluidEnabled = enabled;
        localStorage.setItem('fluidEffectEnabled', enabled);
        
        if (enabled) {
            fluidToggle.classList.remove('disabled');
            fluidCanvas.classList.remove('hidden');
            if (window.fluidSim) {
                window.fluidSim.enabled = true;
            }
        } else {
            fluidToggle.classList.add('disabled');
            fluidCanvas.classList.add('hidden');
            if (window.fluidSim) {
                window.fluidSim.enabled = false;
            }
        }
    };
    
    // Wait for fluid sim to initialize, then apply state
    const initFluidState = () => {
        if (window.fluidSim) {
            updateFluidState(isFluidEnabled);
        } else {
            // Wait a bit for fluid sim to initialize
            setTimeout(initFluidState, 50);
        }
    };
    
    initFluidState();
    
    // Toggle on click
    if (fluidToggle) {
        fluidToggle.addEventListener('click', () => {
            updateFluidState(!isFluidEnabled);
        });
    }
});