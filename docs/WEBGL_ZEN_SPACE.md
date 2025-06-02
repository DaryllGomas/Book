# WebGL Zen Space Documentation

## Overview
The WebGL Zen Space is an immersive 3D cosmic background built with Three.js. It replaces the original DOM-based background with a more sophisticated, interactive 3D experience that includes visual elements inspired by zen philosophy, sacred geometry, and chakra energy systems.

## Files Structure

### JavaScript Files
- **webgl-zen.js**: Main WebGL implementation with Three.js
  - Creates the 3D scene, camera, renderer
  - Implements cosmic nebula background with shaders
  - Creates 3D star field with twinkling effect
  - Generates energy streams flowing toward the center
  - Implements mandala elements with procedural textures
  - Creates energy centers based on chakra system
  - Implements sacred geometry patterns (Flower of Life, Metatron's Cube, Sri Yantra)
  - Creates floating sacred geometry around book (Platonic solids, Seed of Life, Vesica Piscis, Merkaba, Golden Spiral)
  - Adds interactive ripple effects on click
  - Shows zen quotes occasionally

- **zen-audio.js**: Audio implementation
  - Creates ambient drone background sound
  - Generates meditation bell sounds
  - Implements water drop sounds
  - Adds audio reactivity with user interactions

### CSS Files
- **webgl-zen.css**: Styling for WebGL elements
  - Zen space container styling
  - Canvas positioning
  - Zen quote styling
  - Loading overlay
  - Audio controls
  - Chakra info popup
  - Balance indicator (Yin-Yang)

### HTML Integration
The implementation is integrated into the main index.html file with:
- WebGL container
- Yin-Yang balance indicator
- Audio controls
- Loading screen
- Chakra info popup template

## Features

### Visual Elements
- **Cosmic Nebula Background**: Shader-based implementation with slowly shifting colors
- **3D Star Field**: Thousands of stars with twinkling effect
- **Energy Streams**: Particle streams flowing toward the center (book) from different directions
- **Mandala Elements**: Procedurally generated mandala textures on 3D circles
- **Energy Centers**: Glowing spheres representing the chakra system with different colors
- **Sacred Geometry**: Flower of Life, Metatron's Cube, and Sri Yantra patterns
- **Floating Sacred Geometry** (New): Ancient mystical shapes floating around the book:
  - **Platonic Solids**: Tetrahedron, Octahedron, Icosahedron, Dodecahedron with wireframe and glowing cores
  - **Seed of Life**: Seven interconnected circles with pulsing animation
  - **Vesica Piscis**: Two overlapping circles with breathing scale effect
  - **Merkaba**: Gold star tetrahedron with counter-rotating parts
  - **Golden Spiral**: 3D spiral based on golden ratio with particle effects
- **Interactive Ripples**: Click anywhere to create expanding ripple effects
- **Zen Quotes**: Occasional zen quotes that fade in and out

### Audio Elements
- **Ambient Drone**: Low-frequency drone sound with harmonic relationships
- **Meditation Bells**: Occasional bell sounds with harmonics and decay
- **Water Drops**: Random water drop sounds for atmosphere
- **Interactive Audio**: Sounds that respond to user interactions (clicking)

### UI Elements
- **Loading Screen**: Shows while the WebGL scene initializes
- **Audio Controls**: Toggle button to mute/unmute the audio
- **Yin-Yang Symbol**: Balance indicator that slowly pulses
- **Chakra Info**: Popups that show information about chakras when hovering

## Technical Implementation

### WebGL/Three.js
- Uses Three.js for 3D rendering
- Implements custom shader materials for various effects
- Uses post-processing (UnrealBloomPass) for glow effects
- Implements particle systems for stars and energy streams
- Creates procedural textures for mandalas using Canvas API

### Web Audio API
- Uses Web Audio API for sound generation
- Creates sounds procedurally through oscillators and gain nodes
- Implements custom envelopes for various sound effects
- Schedules sounds to play at random intervals

### Animation
- Uses requestAnimationFrame for smooth animation
- Uses GSAP for camera movements and transitions
- Implements time-based animation for consistent speed across devices
- Uses shader-based animation for efficient GPU-accelerated effects

## Usage Notes

### Performance Considerations
- The WebGL implementation is more resource-intensive than the DOM-based background
- Falls back to the original DOM-based background if Three.js doesn't load
- Adjust `particleCount` in the config for better performance on slower devices

### Audio Notes
- Audio is muted by default and must be enabled by the user
- The Web Audio API requires user interaction to start (click on audio control)
- Audio is generated procedurally to avoid loading large sound files

### Accessibility
- All WebGL elements are marked with `aria-hidden="true"`
- Include proper focus management for interactive elements
- Provides fallback content when WebGL is not available

## Future Enhancements
- Optimize performance for mobile devices
- Add more chakra visualizations and information
- Implement user preferences for visual and audio intensity
- Add more sacred geometry patterns
- Enhance interaction with the book element
