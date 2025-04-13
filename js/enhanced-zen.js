/**
 * Advanced Zen Effects for Cosmic Background
 * This script adds more dynamic and impactful zen elements:
 * - Particle streams flowing toward the book
 * - Energy connections between energy centers
 * - Synchronized cosmic breathing effect
 * - Occasional cosmic "flares"
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize advanced effects after a small delay to ensure other elements are loaded
    setTimeout(initAdvancedZenEffects, 1000);
    
    /**
     * Initialize all advanced zen effects
     */
    function initAdvancedZenEffects() {
        // Create particle streams
        createParticleStreams();
        
        // Create energy connections between energy centers
        createEnergyConnections();
        
        // Add synchronized cosmic breathing effect
        setupCosmicBreathing();
        
        // Add occasional cosmic flares
        setupCosmicFlares();
        
        console.log('Advanced zen effects initialized');
    }
    
    /**
     * Create particle streams flowing toward the book
     */
    function createParticleStreams() {
        const cosmicBackground = document.querySelector('.cosmic-background');
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-stream-container';
        
        // Add to cosmic background
        cosmicBackground.appendChild(particleContainer);
        
        // Get book position (center of screen as default)
        const bookElement = document.querySelector('.book-container');
        const bookRect = bookElement ? bookElement.getBoundingClientRect() : null;
        
        const bookCenterX = bookRect ? bookRect.left + bookRect.width / 2 : window.innerWidth / 2;
        const bookCenterY = bookRect ? bookRect.top + bookRect.height / 2 : window.innerHeight / 2;
        
        // Create 4 particle emitters at different screen positions
        const emitterPositions = [
            { x: '10%', y: '20%' },
            { x: '85%', y: '15%' },
            { x: '75%', y: '85%' },
            { x: '15%', y: '80%' }
        ];
        
        // Create particle emitters
        emitterPositions.forEach((position, index) => {
            createParticleEmitter(
                particleContainer,
                position,
                { x: bookCenterX, y: bookCenterY },
                10 + index * 2, // particles per emitter
                index + 1       // emitter ID
            );
        });
        
        console.log('Particle streams created');
    }
    
    /**
     * Create a particle emitter that sends particles toward the target
     */
    function createParticleEmitter(container, position, target, particleCount, emitterId) {
        // Convert percentage position to pixels
        const emitterX = parseFloat(position.x) / 100 * window.innerWidth;
        const emitterY = parseFloat(position.y) / 100 * window.innerHeight;
        
        // Create particles for this emitter
        for (let i = 0; i < particleCount; i++) {
            createParticle(container, emitterX, emitterY, target, i, emitterId);
        }
    }
    
    /**
     * Create a single particle and animate it
     */
    function createParticle(container, startX, startY, target, delay, emitterId) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Generate a unique ID for this particle
        const particleId = `particle-${emitterId}-${delay}`;
        particle.id = particleId;
        
        // Random slight offset to start position
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetY = (Math.random() - 0.5) * 50;
        
        // Set initial position
        particle.style.left = `${startX + offsetX}px`;
        particle.style.top = `${startY + offsetY}px`;
        
        // Random size (very small)
        const size = 1 + Math.random() * 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        const opacity = 0.3 + Math.random() * 0.5;
        particle.style.opacity = opacity.toString();
        
        // Random color (subtle cosmic hues)
        const colors = [
            'rgba(255, 255, 255, 0.8)',    // White
            'rgba(200, 200, 255, 0.8)',    // Pale blue
            'rgba(255, 240, 220, 0.8)',    // Pale gold
            'rgba(230, 210, 255, 0.8)'     // Pale purple
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        // Random particle speed
        const speed = 10 + Math.random() * 10; // seconds to reach target
        
        // Add to container
        container.appendChild(particle);
        
        // Animate the particle
        animateParticle(particle, target, speed, delay);
    }
    
    /**
     * Animate a particle moving toward the target
     */
    function animateParticle(particle, target, speed, delay) {
        // Get current position
        const currentRect = particle.getBoundingClientRect();
        const startX = currentRect.left;
        const startY = currentRect.top;
        
        // Calculate distance to target
        const distanceX = target.x - startX;
        const distanceY = target.y - startY;
        
        // Create keyframes for this specific particle's journey
        const particleAnimId = `particle-anim-${Math.floor(Math.random() * 1000000)}`;
        const style = document.createElement('style');
        
        // Create the trail effect with more intermediate points
        const trailSteps = 5; // Number of intermediate steps for trail effect
        let keyframes = `@keyframes ${particleAnimId} {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: ${particle.style.opacity};
            }`;
        
        // Add trail effect with intermediate steps
        for (let i = 1; i <= trailSteps; i++) {
            const step = i / (trailSteps + 1);
            // Add some random waviness to the path
            const waveX = (Math.random() - 0.5) * 50 * (1 - step);
            const waveY = (Math.random() - 0.5) * 50 * (1 - step);
            
            keyframes += `
            ${step * 100}% {
                transform: translate(${distanceX * step + waveX}px, ${distanceY * step + waveY}px) scale(${1 - 0.3 * step});
                opacity: ${parseFloat(particle.style.opacity) * (1 - 0.3 * step)};
            }`;
        }
        
        // Final state
        keyframes += `
            100% {
                transform: translate(${distanceX}px, ${distanceY}px) scale(0.2);
                opacity: 0;
            }
        }`;
        
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        
        // Delay start of animation
        setTimeout(() => {
            // Apply the animation with infinite repeat
            particle.style.animation = `${particleAnimId} ${speed}s ease-in-out forwards`;
            
            // When animation ends, reset the particle to start position
            setTimeout(() => {
                // Reset particle
                particle.style.animation = 'none';
                
                // Restart the animation after a short delay
                setTimeout(() => {
                    animateParticle(particle, target, speed, 0);
                }, 100);
            }, speed * 1000);
        }, delay * 1000);
    }
    
    /**
     * Create energy connections between energy centers
     */
    function createEnergyConnections() {
        const cosmicBackground = document.querySelector('.cosmic-background');
        const connectionContainer = document.createElement('div');
        connectionContainer.className = 'energy-connection-container';
        
        // Add to cosmic background
        cosmicBackground.appendChild(connectionContainer);
        
        // Get all energy centers
        const energyCenters = document.querySelectorAll('.energy-center');
        
        // Create connections between nearby centers
        if (energyCenters.length > 1) {
            // Track connections to avoid duplicates
            const connections = [];
            
            // Create connections between centers
            for (let i = 0; i < energyCenters.length; i++) {
                for (let j = i + 1; j < energyCenters.length; j++) {
                    // Get center positions
                    const center1Rect = energyCenters[i].getBoundingClientRect();
                    const center2Rect = energyCenters[j].getBoundingClientRect();
                    
                    const center1X = center1Rect.left + center1Rect.width / 2;
                    const center1Y = center1Rect.top + center1Rect.height / 2;
                    const center2X = center2Rect.left + center2Rect.width / 2;
                    const center2Y = center2Rect.top + center2Rect.height / 2;
                    
                    // Calculate distance between centers
                    const distance = Math.sqrt(
                        Math.pow(center2X - center1X, 2) + 
                        Math.pow(center2Y - center1Y, 2)
                    );
                    
                    // Only connect centers that are not too far apart
                    // Window diagonal / 3 is a good maximum distance
                    const maxDistance = Math.sqrt(
                        Math.pow(window.innerWidth, 2) + 
                        Math.pow(window.innerHeight, 2)
                    ) / 3;
                    
                    if (distance < maxDistance) {
                        // Create connection
                        createEnergyConnection(
                            connectionContainer,
                            { x: center1X, y: center1Y },
                            { x: center2X, y: center2Y },
                            i, j
                        );
                        
                        // Track this connection
                        connections.push(`${i}-${j}`);
                    }
                }
            }
            
            console.log(`Created ${connections.length} energy connections`);
        }
    }
    
    /**
     * Create a single energy connection between two points
     */
    function createEnergyConnection(container, point1, point2, id1, id2) {
        const connection = document.createElement('div');
        connection.className = 'energy-connection';
        connection.id = `connection-${id1}-${id2}`;
        
        // Calculate connection properties
        const deltaX = point2.x - point1.x;
        const deltaY = point2.y - point1.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        // Set connection styles
        connection.style.cssText = `
            width: ${distance}px;
            left: ${point1.x}px;
            top: ${point1.y}px;
            transform: rotate(${angle}deg);
            opacity: 0;
        `;
        
        // Add to container
        container.appendChild(connection);
        
        // Animate connection appearance/disappearance
        animateConnection(connection);
    }
    
    /**
     * Animate energy connection appearing and disappearing
     */
    function animateConnection(connection) {
        // Random visibility timing
        const visibleDuration = 3 + Math.random() * 7; // 3-10 seconds visible
        const hiddenDuration = 5 + Math.random() * 15; // 5-20 seconds hidden
        const fadeDuration = 2 + Math.random() * 3; // 2-5 second fade
        
        // Initial state
        let isVisible = false;
        
        function toggleConnection() {
            isVisible = !isVisible;
            
            if (isVisible) {
                // Fade in
                connection.style.transition = `opacity ${fadeDuration}s ease-in`;
                connection.style.opacity = `${0.1 + Math.random() * 0.4}`; // Random opacity
                setTimeout(toggleConnection, visibleDuration * 1000);
            } else {
                // Fade out
                connection.style.transition = `opacity ${fadeDuration}s ease-out`;
                connection.style.opacity = '0';
                setTimeout(toggleConnection, hiddenDuration * 1000);
            }
        }
        
        // Start with random delay
        setTimeout(toggleConnection, Math.random() * 10000);
    }
    
    /**
     * Setup synchronized cosmic breathing effect
     * All elements occasionally pulse together
     */
    function setupCosmicBreathing() {
        // Setup cosmic breathing interval
        const breathInterval = 40000; // 40 seconds between cosmic breaths
        
        // Function to trigger synchronized pulsing
        function triggerCosmicBreath() {
            // Get all zen elements
            const zenElements = document.querySelectorAll('.mandala, .energy-center, .sacred-geometry');
            
            // Add breathing class to all elements
            zenElements.forEach(element => {
                element.classList.add('cosmic-breathing');
            });
            
            // Remove class after breathing completes
            setTimeout(() => {
                zenElements.forEach(element => {
                    element.classList.remove('cosmic-breathing');
                });
            }, 10000); // 10 second breathing duration
        }
        
        // Start cosmic breathing with initial delay
        setTimeout(() => {
            triggerCosmicBreath();
            // Setup interval for future breaths
            setInterval(triggerCosmicBreath, breathInterval);
        }, 15000); // First breath after 15 seconds
        
        console.log('Cosmic breathing initialized');
    }
    
    /**
     * Setup occasional cosmic flares
     * Random elements occasionally flare brighter
     */
    function setupCosmicFlares() {
        // Get all zen elements that can flare
        const mandalaElements = document.querySelectorAll('.mandala');
        const energyElements = document.querySelectorAll('.energy-center');
        const geometryElements = document.querySelectorAll('.sacred-geometry');
        
        // Combine all element types
        const allElements = [
            ...Array.from(mandalaElements),
            ...Array.from(energyElements),
            ...Array.from(geometryElements)
        ];
        
        // Schedule random flares
        function scheduleRandomFlare() {
            // Random delay between flares (5-15 seconds)
            const delay = 5000 + Math.random() * 10000;
            
            setTimeout(() => {
                // Select a random element to flare
                const randomIndex = Math.floor(Math.random() * allElements.length);
                const elementToFlare = allElements[randomIndex];
                
                // Store original opacity as custom property
                const currentOpacity = parseFloat(window.getComputedStyle(elementToFlare).opacity);
                elementToFlare.style.setProperty('--base-opacity', currentOpacity);
                
                // Add flare animation
                elementToFlare.style.animation = 'elementFlare 4s ease-in-out';
                
                // Remove animation after it completes
                setTimeout(() => {
                    elementToFlare.style.animation = '';
                }, 4000);
                
                // Schedule next flare
                scheduleRandomFlare();
            }, delay);
        }
        
        // Start scheduling flares
        scheduleRandomFlare();
        
        console.log('Cosmic flares initialized');
    }
    
    /**
     * Create one special high-energy center that's more intense
     */
    function createMainEnergyCenter() {
        // Get existing energy centers container
        const energyCentersContainer = document.querySelector('.energy-centers-container');
        
        if (energyCentersContainer) {
            // Create a special high-energy center
            const mainEnergyCenter = document.createElement('div');
            mainEnergyCenter.className = 'energy-center energy-center-strong';
            
            // Position in center of screen
            mainEnergyCenter.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                width: 7vmin;
                height: 7vmin;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,210,100,0.4) 0%, rgba(0,0,0,0) 70%);
                filter: blur(5px);
                mix-blend-mode: screen;
                pointer-events: none;
                opacity: 0.7;
                transform: translate(-50%, -50%);
                z-index: -1;
            `;
            
            // Add to container
            energyCentersContainer.appendChild(mainEnergyCenter);
            
            // Create unique pulse animation
            const animName = 'mainEnergyPulse';
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes ${animName} {
                    0%, 100% {
                        transform: translate(-50%, -50%) scale(0.9);
                        opacity: 0.5;
                        filter: blur(5px) brightness(0.8);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 0.8;
                        filter: blur(4px) brightness(1.2);
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Apply animation
            mainEnergyCenter.style.animation = `${animName} 8s ease-in-out infinite`;
            
            console.log('Main energy center created');
        }
    }
    
    // Call this function after initial zen effects are loaded
    setTimeout(createMainEnergyCenter, 2000);
});