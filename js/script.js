/**
 * Interactive Book Animation and Navigation
 * This script provides interactivity for the book landing page.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const elements = {
        book: document.querySelector('.book'),
        bookContainer: document.querySelector('.book-container'),
        container: document.querySelector('.container'),
        pageTurningEffect: document.querySelector('.page-turning-effect'),
        accessibilityHelp: document.querySelector('.accessibility-help'),
        loadingIndicator: document.querySelector('.loading-indicator')
    };
    
    const config = {
        targetUrl: 'https://daryllgomas.github.io/website/zen-story',
        animationDuration: 1800, // in milliseconds
        enableFloating: false // Set to true to enable floating animation
    };
    
    console.log('Script initialized, elements found:', elements);
    
    // Debug helper - accessible from browser console
    window.debugBookAnimation = {
        open: function() {
            console.log('Debug: Opening book...');
            elements.book.classList.add('open');
            return 'Added .open class to book';
        },
        close: function() {
            console.log('Debug: Closing book...');
            elements.book.classList.remove('open');
            return 'Removed .open class from book';
        },
        toggle: function() {
            console.log('Debug: Toggling book...');
            elements.book.classList.toggle('open');
            return 'Toggled .open class on book';
        },
        getStyles: function() {
            const bookCover = document.querySelector('.book-cover');
            const computedStyle = window.getComputedStyle(bookCover);
            console.log('Book cover computed styles:', {
                transform: computedStyle.transform,
                transition: computedStyle.transition,
                transformOrigin: computedStyle.transformOrigin,
                backfaceVisibility: computedStyle.backfaceVisibility
            });
            return 'Logged book cover computed styles';
        }
    };
    
    /**
     * Floating animation for the book
     */
    const floatBook = () => {
        if (!config.enableFloating) return;
        
        const randomX = Math.random() * 5 - 2.5;
        const randomY = Math.random() * 5 - 2.5;
        const randomDuration = Math.random() * 2000 + 3000;
        
        gsap.to(elements.bookContainer, {
            x: randomX,
            y: randomY,
            duration: randomDuration / 1000,
            ease: "sine.inOut",
            onComplete: floatBook
        });
    };
    
    /**
     * Setup GSAP fallback if not available
     */
    if (typeof gsap === 'undefined') {
        console.log('GSAP not found, using fallback');
        window.gsap = {
            to: function(element, props) {
                const duration = props.duration || 1;
                const ease = props.ease || 'linear';
                const onComplete = props.onComplete;
                
                element.style.transition = `transform ${duration}s ${ease}`;
                element.style.transform = `translate(${props.x || 0}px, ${props.y || 0}px)`;
                
                if (onComplete) {
                    setTimeout(onComplete, duration * 1000);
                }
            },
            killTweensOf: function() {
                console.log('Killing animations (fallback)');
            }
        };
    }
    
    // Start floating animation if enabled
    floatBook();
    
    /**
     * Opens the book and handles the transition
     */
    function openBook() {
        console.log('Opening book...');
        
        // Debug: Log class list before adding .open
        console.log('Before adding .open class:', elements.book.className);
        
        // Stop floating animation
        gsap.killTweensOf(elements.bookContainer);
        
        // Reset any previously applied inline styles that might interfere
        elements.book.style.transform = '';
        elements.bookContainer.style.transform = '';
        
        // Play page turning sound
        playPageTurnSound();
        
        // Add open class to trigger the book opening animation
        elements.book.classList.add('open');
        
        // Trigger particle burst
        createParticleBurst();
        
        // Debug: Log class list after adding .open
        console.log('After adding .open class:', elements.book.className);
        
        // Check computed style to see if transform is being applied
        setTimeout(function() {
            const bookCover = document.querySelector('.book-cover');
            const computedStyle = window.getComputedStyle(bookCover);
            console.log('Book cover computed transform:', computedStyle.transform);
        }, 100);
        
        // After book opens, start fade out animation and redirect
        setTimeout(function() {
            console.log('Adding fade-out class to container');
            elements.container.classList.add('fade-out');
            
            // Show loading indicator
            elements.loadingIndicator.classList.add('active');
            
            // Redirect to the target page after animations complete
            setTimeout(function() {
                console.log('Redirecting to:', config.targetUrl);
                window.location.href = config.targetUrl;
            }, config.animationDuration);
        }, config.animationDuration);
    }
    
    /**
     * Creates a burst of particles originating from the book spine area
     */
    function createParticleBurst() {
        const particleContainer = elements.book; // Burst relative to the book itself
        const particleCount = 20;
        const particleColor = '#FFD700'; // Gold color

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = `${Math.random() * 4 + 2}px`; // Size 2px to 6px
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = particleColor;
            particle.style.borderRadius = '50%';
            particle.style.left = '5px'; // Start near the spine (adjust if spine width changes)
            particle.style.top = `${Math.random() * 100}%`; // Random vertical position along spine
            particle.style.opacity = 1;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = 15; // Ensure particles are above pages but potentially below effects
            
            particleContainer.appendChild(particle);

            // Animation using GSAP (or fallback if needed)
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 300, // Spread horizontally
                y: (Math.random() - 0.5) * 400, // Spread vertically
                opacity: 0,
                scale: 0.2,
                duration: Math.random() * 1 + 0.5, // Duration 0.5s to 1.5s
                ease: 'power2.out',
                onComplete: () => {
                    particle.remove(); // Clean up particle after animation
                }
            });
        }
        console.log('Particle burst created');
    }
    
    /**
     * Plays a very faint, low-frequency background hum
     */
    function playBackgroundHum() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create Oscillator for the fundamental low hum
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'sine'; // Smooth sound
            oscillator.frequency.setValueAtTime(40, audioContext.currentTime); // Very low frequency (40Hz)
            
            // Create Gain node to control volume
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.008, audioContext.currentTime); // VERY quiet

            // Connect nodes: Oscillator -> Gain -> Destination
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Start the oscillator
            oscillator.start();
            
            // Looping isn't directly supported, but for a continuous hum, 
            // just letting it run indefinitely is effectively the same.
            // oscillator.loop = true; // Not standard Web Audio API
            
            console.log('Background hum started');

        } catch (e) {
            console.error('Web Audio API not supported for background hum:', e);
        }
    }
    
    /**
     * Plays a page turning sound effect
     */
    function playPageTurnSound() {
        try {
            // Create sound effect using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            gainNode.gain.value = 0.1;
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
            console.log('Sound effect played');
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }
    
    /**
     * Creates and animates background stars with parallax effect
     */
    const createStars = () => {
        const cosmicBackground = document.querySelector('.cosmic-background');
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        
        const starCounts = { small: 70, medium: 40, large: 20 }; // Adjust counts as needed
        const starClasses = {
            small: 'star star-small',
            medium: 'star star-medium',
            large: 'star star-large'
        };

        for (const size in starCounts) {
            for (let i = 0; i < starCounts[size]; i++) {
                const star = document.createElement('div');
                star.className = starClasses[size];
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                // Delay and duration variations can be adjusted in CSS per class
                star.style.animationDelay = `${Math.random() * 5}s`; 
                starsContainer.appendChild(star);
            }
        }
        
        // Add the container with all stars to the background
        cosmicBackground.appendChild(starsContainer);
        console.log('Multi-layer stars created and added to background');
    };
    
    /**
     * Event Listeners
     */
    
    // Click event
    elements.bookContainer.addEventListener('click', function(event) {
        // Prevent any default browser behavior
        event.preventDefault();
        event.stopPropagation();
        openBook();
    });
    
    // Keyboard navigation
    elements.bookContainer.addEventListener('keydown', function(event) {
        // Enter or Space key
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openBook();
        }
    });
    
    // Initialize the stars
    createStars();
    
    // Initialize background sound
    playBackgroundHum();

    // Preload the target page to make transition smoother
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'document';
    preloadLink.href = config.targetUrl;
    document.head.appendChild(preloadLink);
    console.log('Target page preloaded:', config.targetUrl);
});
