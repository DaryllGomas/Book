/**
 * Zen-themed cosmic background elements
 * This script adds subtle zen elements to the cosmic background:
 * - Rotating mandalas
 * - Energy centers (pulsing points)
 * - Harmonic waves
 * - Sacred geometry
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize zen cosmic elements
    initZenCosmicElements();
    
    /**
     * Initialize all zen-themed cosmic elements
     */
    function initZenCosmicElements() {
        createMandalas();
        createEnergyCenters();
        createHarmonicWaves();
        createSacredGeometry();
    }
    
    /**
     * Create subtle rotating mandalas in the background
     */
    function createMandalas() {
        const cosmicBackground = document.querySelector('.cosmic-background');
        const mandalaContainer = document.createElement('div');
        mandalaContainer.className = 'mandala-container';
        
        // Create 3 different mandalas positioned randomly
        const mandalaCount = 3;
        const mandalaTypes = ['mandala-pattern-1', 'mandala-pattern-2', 'metatron-cube', 'sri-yantra'];
        
        for (let i = 0; i < mandalaCount; i++) {
            const mandala = document.createElement('div');
            mandala.className = 'mandala';
            
            // Random position within viewport (ensuring it's still visible)
            const posX = 10 + Math.random() * 80; // 10% to 90% of viewport width
            const posY = 10 + Math.random() * 80; // 10% to 90% of viewport height
            
            // Random size (proportional to screen size)
            const size = 20 + Math.random() * 30; // 20% to 50% of viewport
            
            // Random initial rotation
            const rotation = Math.random() * 360;
            
            // Random rotation speed (very slow)
            const rotationSpeed = 0.02 + Math.random() * 0.08; // 0.02 to 0.1 degrees per frame
            const direction = Math.random() > 0.5 ? 1 : -1; // Clockwise or counter-clockwise
            
            // Random opacity (very subtle)
            const opacity = 0.03 + Math.random() * 0.05;
            
            // Random mandala type
            const mandalaType = mandalaTypes[Math.floor(Math.random() * mandalaTypes.length)];
            
            // Set styles
            mandala.style.cssText = `
                position: absolute;
                left: ${posX}%;
                top: ${posY}%;
                width: ${size}vmin;
                height: ${size}vmin;
                opacity: ${opacity};
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><use href="%23${mandalaType}" /></svg>');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                transform: rotate(${rotation}deg);
                pointer-events: none;
                mix-blend-mode: screen;
                transition: transform 0.5s ease-out;
            `;
            
            // Add to container
            mandalaContainer.appendChild(mandala);
            
            // Animate rotation
            animateMandala(mandala, rotationSpeed, direction);
        }
        
        // Add to cosmic background
        cosmicBackground.appendChild(mandalaContainer);
        
        console.log('Zen mandalas created');
    }
    
    /**
     * Animate a mandala's rotation
     */
    function animateMandala(mandala, speed, direction) {
        let rotation = parseFloat(mandala.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
        
        function rotateMandala() {
            rotation += speed * direction;
            mandala.style.transform = `rotate(${rotation}deg)`;
            requestAnimationFrame(rotateMandala);
        }
        
        requestAnimationFrame(rotateMandala);
    }
    
    /**
     * Create subtle energy centers that pulse
     */
    function createEnergyCenters() {
        const cosmicBackground = document.querySelector('.cosmic-background');
        const energyContainer = document.createElement('div');
        energyContainer.className = 'energy-centers-container';
        
        // Create multiple energy centers
        const centerCount = 5; // 5 energy points distributed across the screen
        
        for (let i = 0; i < centerCount; i++) {
            const energyCenter = document.createElement('div');
            energyCenter.className = 'energy-center';
            
            // Random position
            const posX = 10 + Math.random() * 80;
            const posY = 10 + Math.random() * 80;
            
            // Random base size
            const baseSize = 2 + Math.random() * 3; // 2-5vmin
            
            // Random colors (subtle cosmic hues)
            const colors = [
                'rgba(120, 100, 255, 0.3)', // Purple
                'rgba(100, 180, 255, 0.3)', // Blue
                'rgba(255, 210, 100, 0.3)', // Gold
                'rgba(255, 150, 100, 0.3)'  // Orange
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Random pulsing speed
            const pulseSpeed = 2 + Math.random() * 4; // 2-6 seconds per pulse
            
            // Set styles
            energyCenter.style.cssText = `
                position: absolute;
                left: ${posX}%;
                top: ${posY}%;
                width: ${baseSize}vmin;
                height: ${baseSize}vmin;
                border-radius: 50%;
                background: radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%);
                filter: blur(5px);
                mix-blend-mode: screen;
                pointer-events: none;
                opacity: 0.5;
                transform: scale(1);
                z-index: -1;
            `;
            
            // Add to container
            energyContainer.appendChild(energyCenter);
            
            // Animate pulsing
            animateEnergyCenter(energyCenter, pulseSpeed);
        }
        
        // Add to cosmic background
        cosmicBackground.appendChild(energyContainer);
        
        console.log('Energy centers created');
    }
    
    /**
     * Animate an energy center's pulsing
     */
    function animateEnergyCenter(center, speed) {
        // Create the CSS animation dynamically with random values
        const minScale = 0.8 + Math.random() * 0.2; // 0.8-1.0
        const maxScale = 1.2 + Math.random() * 0.3; // 1.2-1.5
        const minOpacity = 0.4 + Math.random() * 0.3; // 0.4-0.7
        const maxOpacity = 0.7 + Math.random() * 0.3; // 0.7-1.0
        
        // Create a unique animation name
        const animName = 'pulse-' + Math.floor(Math.random() * 1000000);
        
        // Create the style element with keyframes
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes ${animName} {
                0%, 100% {
                    transform: scale(${minScale});
                    opacity: ${minOpacity};
                }
                50% {
                    transform: scale(${maxScale});
                    opacity: ${maxOpacity};
                }
            }
        `;
        document.head.appendChild(style);
        
        // Apply the animation
        center.style.animation = `${animName} ${speed}s ease-in-out infinite`;
    }
    
    /**
     * Create harmonic waves that flow across the background
     */
    function createHarmonicWaves() {
        const cosmicBackground = document.querySelector('.cosmic-background');
        const wavesContainer = document.createElement('div');
        wavesContainer.className = 'harmonic-waves-container';
        
        // Create multiple wave layers
        const waveCount = 3;
        
        for (let i = 0; i < waveCount; i++) {
            const waveLayer = document.createElement('div');
            waveLayer.className = 'wave-layer';
            
            // Position at different heights
            const posY = 20 + (i * 30); // Distribute waves vertically
            
            // Different speeds
            const animDuration = 15 + (i * 5); // 15-25 seconds per cycle
            
            // Different transparencies
            const opacity = 0.04 - (i * 0.01); // 0.04-0.02 opacity
            
            // Create the actual wave
            const wave = document.createElement('div');
            wave.className = 'wave';
            
            // Set styles for the wave layer
            waveLayer.style.cssText = `
                position: absolute;
                left: 0;
                top: ${posY}%;
                width: 100%;
                height: 10%;
                overflow: hidden;
                opacity: ${opacity};
                pointer-events: none;
                z-index: -2;
            `;
            
            // Wave specific styles
            wave.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                width: 200%;
                height: 100%;
                background: repeating-linear-gradient(
                    90deg,
                    rgba(255,255,255,0.5) 0%,
                    rgba(255,255,255,0) 50%,
                    rgba(255,255,255,0.5) 100%
                );
                mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100"><path d="M0,50 Q300,0 600,50 T1200,50" fill="white" /></svg>');
                mask-size: 100% 100%;
                mask-repeat: repeat-x;
                -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100"><path d="M0,50 Q300,0 600,50 T1200,50" fill="white" /></svg>');
                -webkit-mask-size: 100% 100%;
                -webkit-mask-repeat: repeat-x;
                mix-blend-mode: overlay;
                transform: translateX(0);
            `;
            
            // Add to containers
            waveLayer.appendChild(wave);
            wavesContainer.appendChild(waveLayer);
            
            // Animate the wave
            animateWave(wave, animDuration, i % 2 === 0);
        }
        
        // Add to cosmic background
        cosmicBackground.appendChild(wavesContainer);
        
        console.log('Harmonic waves created');
    }
    
    /**
     * Animate a wave's movement
     */
    function animateWave(wave, duration, isLeftToRight) {
        // Create keyframes for the wave animation
        const animName = 'wave-' + Math.floor(Math.random() * 1000000);
        
        // Direction of animation
        const from = isLeftToRight ? '0' : '-100%';
        const to = isLeftToRight ? '-100%' : '0';
        
        // Create styles
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes ${animName} {
                from {
                    transform: translateX(${from});
                }
                to {
                    transform: translateX(${to});
                }
            }
        `;
        document.head.appendChild(style);
        
        // Apply animation
        wave.style.animation = `${animName} ${duration}s linear infinite`;
    }
    
    /**
     * Create sacred geometry elements that fade in and out
     */
    function createSacredGeometry() {
        const cosmicBackground = document.querySelector('.cosmic-background');
        const geometryContainer = document.createElement('div');
        geometryContainer.className = 'sacred-geometry-container';
        
        // Create multiple sacred geometry elements
        const geometryCount = 3;
        const geometryTypes = ['mandala-pattern-1', 'mandala-pattern-2', 'metatron-cube', 'sri-yantra'];
        
        for (let i = 0; i < geometryCount; i++) {
            const geometry = document.createElement('div');
            geometry.className = 'sacred-geometry';
            
            // Random position
            const posX = 10 + Math.random() * 80;
            const posY = 10 + Math.random() * 80;
            
            // Random size
            const size = 15 + Math.random() * 15; // 15-30vmin
            
            // Random opacity (very subtle)
            const opacity = 0.02 + Math.random() * 0.03; // 0.02-0.05
            
            // Random geometry pattern
            const geometryType = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
            
            // Set styles
            geometry.style.cssText = `
                position: absolute;
                left: ${posX}%;
                top: ${posY}%;
                width: ${size}vmin;
                height: ${size}vmin;
                opacity: 0;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><use href="%23${geometryType}" /></svg>');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                pointer-events: none;
                mix-blend-mode: screen;
                z-index: -1;
            `;
            
            // Add to container
            geometryContainer.appendChild(geometry);
            
            // Animate fade in/out
            animateGeometry(geometry, opacity);
        }
        
        // Add to cosmic background
        cosmicBackground.appendChild(geometryContainer);
        
        console.log('Sacred geometry created');
    }
    
    /**
     * Animate sacred geometry fade in/out
     */
    function animateGeometry(geometry, maxOpacity) {
        // Random durations for appearance/disappearance
        const visibleDuration = 10 + Math.random() * 15; // 10-25 seconds visible
        const hiddenDuration = 20 + Math.random() * 30; // 20-50 seconds hidden
        const fadeDuration = 5 + Math.random() * 5; // 5-10 second fade transition
        
        // Initial state is hidden
        let isVisible = false;
        
        function toggleVisibility() {
            isVisible = !isVisible;
            
            if (isVisible) {
                // Fade in
                geometry.style.transition = `opacity ${fadeDuration}s ease-in`;
                geometry.style.opacity = maxOpacity;
                setTimeout(toggleVisibility, visibleDuration * 1000);
            } else {
                // Fade out
                geometry.style.transition = `opacity ${fadeDuration}s ease-out`;
                geometry.style.opacity = 0;
                setTimeout(toggleVisibility, hiddenDuration * 1000);
            }
        }
        
        // Start with random delay so they don't all appear at once
        setTimeout(toggleVisibility, Math.random() * 10000);
    }
});

// Make SVG mandalas available in the DOM
function addMandalaDefinitions() {
    // The SVG is already in the HTML, so we don't need to add it again
    console.log('Mandala definitions available in SVG element');
}

// Call when page loads
window.addEventListener('load', addMandalaDefinitions);