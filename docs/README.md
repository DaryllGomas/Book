# Zen Space Website Documentation

## Overview
This folder contains documentation for the Zen Space Website project, an immersive cosmic background experience featuring WebGL visuals and interactive elements.

## Documents

### [WebGL Zen Space Documentation](WEBGL_ZEN_SPACE.md)
Comprehensive documentation of the WebGL implementation, including:
- File structure and purpose
- Visual elements (nebula, stars, energy streams, etc.)
- Audio implementation
- Technical details and rendering approach

### [Loading Fixes Documentation](LOADING_FIXES.md)
Documentation of fixes implemented to resolve loading screen issues:
- Robust error handling strategies
- Performance optimizations
- Debug tools
- Troubleshooting guidance

### [Project Tracker](ZEN_SPACE_PROJECT_TRACKER.md)
A comprehensive checklist of completed features and planned enhancements:
- Visual elements implementation status
- Audio elements implementation status
- UI components status
- Future development roadmap

### [Architecture Overview](ARCHITECTURE.md)
A detailed explanation of the system architecture:
- Component breakdown and relationships
- File structure and organization
- Data flow through the application
- Technical considerations and optimizations

### [Integration Instructions](INTEGRATION_INSTRUCTIONS.md)
Steps for integrating the WebGL Zen Space into existing websites:
- Required dependencies
- HTML structure
- CSS requirements
- JavaScript initialization

### [Todo List](todo.md)
Project tasks and progress tracking

## Project Structure
The Zen Space website consists of:
- WebGL-based cosmic background with zen elements
- Interactive book element in the foreground
- Audio experience with ambient sounds
- Fallback DOM-based background for compatibility

## Usage
To use the debug tools:
1. Press Alt+D to activate debug mode if experiencing issues
2. Use the debug panel to diagnose and resolve rendering problems
3. Consult LOADING_FIXES.md for common troubleshooting steps

## Development
See the source code in the js/ directory for implementation details:
- webgl-zen.js - Main WebGL implementation
- zen-audio.js - Audio implementation
- zen-debug.js - Debugging utilities
- zen-elements.js - Original DOM-based background elements