# Enter Zen From There - Interactive Website

## Overview
An interactive website featuring an immersive cosmic zen background with WebGL 3D effects and an interactive book element. The experience combines visual elements inspired by zen philosophy with subtle audio elements to create a meditative digital space.

## Features
- Advanced WebGL cosmic background
- Interactive 3D elements with parallax effects
- Energy flows, mandalas, and sacred geometry patterns
- Zen quotes that appear occasionally
- Ambient audio experience with meditation bells
- Interactive book element as the focal point
- Responsive design for different screen sizes

## Documentation
All documentation is available in the [docs](/docs) folder:
- [WebGL Zen Space Documentation](/docs/WEBGL_ZEN_SPACE.md)
- [Loading Fixes Documentation](/docs/LOADING_FIXES.md)
- [Project Tracker](/docs/ZEN_SPACE_PROJECT_TRACKER.md)
- [Architecture Overview](/docs/ARCHITECTURE.md)
- [Integration Instructions](/docs/INTEGRATION_INSTRUCTIONS.md)
- [Todo List](/docs/todo.md)
- [Documentation Overview](/docs/README.md)

## Getting Started
1. Clone this repository
2. Open index.html in your browser
3. Interact with the book element to enter the zen experience

## Development
The project is built with:
- HTML5
- CSS3
- JavaScript
- Three.js for WebGL rendering

To make modifications, edit the relevant files:
- index.html - Main structure
- css/ - Styling files
- js/ - JavaScript implementation
  - webgl-zen.js - WebGL background
  - zen-audio.js - Audio implementation
  - zen-elements.js - DOM-based elements (fallback)

## Debug Mode
Press Alt+D to activate debug mode if you encounter issues. This enables:
- FPS counter
- WebGL information
- Wireframe view
- Fallback option

## Fallback Support
For browsers without WebGL support, a fallback DOM-based background is provided automatically.