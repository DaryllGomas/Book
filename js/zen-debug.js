/**
 * Debug utilities for WebGL Zen Space
 * This script adds debugging capabilities to help troubleshoot WebGL rendering issues
 */

const ZenDebug = {
  // Debug state
  active: false,
  
  // Stats display
  stats: null,
  
  // Store original functions for restoration
  original: {
    init: null,
    animate: null
  },
  
  // Debug panel
  panel: null,
  
  // Initialize debug mode
  init: function() {
    // Create debug panel
    this.createDebugPanel();
    
    // Store original functions
    if (window.ZenSpace) {
      this.original.init = window.ZenSpace.init;
      this.original.animate = window.ZenSpace.animate;
      
      // Override init function to add debugging
      window.ZenSpace.init = function(containerId) {
        // Start debug mode before initialization
        ZenDebug.start();
        
        // Call original init
        const result = ZenDebug.original.init.call(window.ZenSpace, containerId);
        
        // Log initialization result
        console.log('ZenSpace init result:', result);
        
        return result;
      };
      
      // Override animate function to add performance monitoring
      window.ZenSpace.animate = function() {
        // Update stats if active
        if (ZenDebug.active && ZenDebug.stats) {
          ZenDebug.stats.begin();
        }
        
        // Call original animate
        const result = ZenDebug.original.animate.call(window.ZenSpace);
        
        // Update stats if active
        if (ZenDebug.active && ZenDebug.stats) {
          ZenDebug.stats.end();
          
          // Update FPS in debug panel
          const fpsDisplay = document.getElementById('zen-debug-fps');
          if (fpsDisplay) {
            fpsDisplay.textContent = Math.round(ZenDebug.stats.fps || 0);
          }
        }
        
        return result;
      };
    }
    
    // Add debug keyboard shortcut (Alt+D)
    document.addEventListener('keydown', function(event) {
      if (event.altKey && event.key === 'd') {
        ZenDebug.toggle();
      }
    });
    
    console.log('Debug mode ready (Alt+D to toggle)');
  },
  
  // Create debug panel
  createDebugPanel: function() {
    // Create panel
    const panel = document.createElement('div');
    panel.id = 'zen-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.7);
      color: #00ff00;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 5px;
      z-index: 9999;
      display: none;
      width: 250px;
    `;
    
    // Create content
    panel.innerHTML = `
      <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
        <span>FPS: <span id="zen-debug-fps">0</span></span>
        <button id="zen-debug-close" style="background: none; border: none; color: white; cursor: pointer;">×</button>
      </div>
      <div style="margin-bottom: 10px;">
        <label>
          <input type="checkbox" id="zen-debug-wireframe"> Show Wireframes
        </label>
      </div>
      <div style="margin-bottom: 10px;">
        <button id="zen-debug-fallback" style="background: #333; color: white; border: 1px solid #555; padding: 5px; cursor: pointer; width: 100%;">
          Switch to Fallback
        </button>
      </div>
      <div>
        <button id="zen-debug-info" style="background: #333; color: white; border: 1px solid #555; padding: 5px; cursor: pointer; width: 100%;">
          Show WebGL Info
        </button>
      </div>
    `;
    
    // Append to body
    document.body.appendChild(panel);
    this.panel = panel;
    
    // Add event listeners
    document.getElementById('zen-debug-close').addEventListener('click', () => {
      this.stop();
    });
    
    document.getElementById('zen-debug-wireframe').addEventListener('change', (event) => {
      this.toggleWireframe(event.target.checked);
    });
    
    document.getElementById('zen-debug-fallback').addEventListener('click', () => {
      this.switchToFallback();
    });
    
    document.getElementById('zen-debug-info').addEventListener('click', () => {
      this.showWebGLInfo();
    });
  },
  
  // Start debug mode
  start: function() {
    if (this.active) return;
    this.active = true;
    
    // Load stats.js if available
    if (!this.stats) {
      try {
        // Create stats panel
        this.stats = {
          fps: 0,
          begin: function() {
            this.startTime = performance.now();
          },
          end: function() {
            const endTime = performance.now();
            const frameTime = endTime - this.startTime;
            this.fps = 1000 / frameTime;
          }
        };
      } catch (error) {
        console.warn('Could not initialize stats:', error);
      }
    }
    
    // Show debug panel
    if (this.panel) {
      this.panel.style.display = 'block';
    }
    
    console.log('Debug mode started');
  },
  
  // Stop debug mode
  stop: function() {
    if (!this.active) return;
    this.active = false;
    
    // Hide debug panel
    if (this.panel) {
      this.panel.style.display = 'none';
    }
    
    // Restore normal rendering
    this.toggleWireframe(false);
    
    console.log('Debug mode stopped');
  },
  
  // Toggle debug mode
  toggle: function() {
    if (this.active) {
      this.stop();
    } else {
      this.start();
    }
  },
  
  // Toggle wireframe mode
  toggleWireframe: function(enabled) {
    if (!window.ZenSpace || !window.ZenSpace.scene) return;
    
    // Apply wireframe to all materials
    window.ZenSpace.scene.traverse(function(object) {
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => {
            if (mat.wireframe !== undefined) {
              mat.wireframe = enabled;
            }
          });
        } else if (object.material.wireframe !== undefined) {
          object.material.wireframe = enabled;
        }
      }
    });
  },
  
  // Switch to fallback DOM background
  switchToFallback: function() {
    // Hide WebGL container
    const container = document.getElementById('zen-space-container');
    if (container) {
      container.style.display = 'none';
    }
    
    // Show DOM background
    const background = document.querySelector('.cosmic-background');
    if (background) {
      background.style.display = 'block';
    }
    
    // Hide WebGL controls
    const audioControls = document.getElementById('zen-audio-controls');
    const balanceIndicator = document.getElementById('balance-indicator');
    
    if (audioControls) audioControls.style.display = 'none';
    if (balanceIndicator) balanceIndicator.style.display = 'none';
    
    // Hide loading screen if still visible
    const loadingScreen = document.getElementById('zen-loading');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
    
    // Show book container
    const bookContainer = document.querySelector('.book-container');
    if (bookContainer) {
      bookContainer.style.opacity = '1';
    }
    
    console.log('Switched to fallback background');
  },
  
  // Show WebGL information
  showWebGLInfo: function() {
    if (!window.ZenSpace || !window.ZenSpace.renderer) {
      alert('WebGL renderer not available');
      return;
    }
    
    const gl = window.ZenSpace.renderer.getContext();
    if (!gl) {
      alert('WebGL context not available');
      return;
    }
    
    // Get WebGL info
    const info = {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxCubeMapTextureSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
      maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      maxVertexTextureImageUnits: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxTextureImageUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
      maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
      maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
      maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      aliasedLineWidthRange: gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE),
      aliasedPointSizeRange: gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
      extensions: gl.getSupportedExtensions()
    };
    
    // Format info for display
    let infoText = 'WebGL Information:\n\n';
    for (const key in info) {
      if (key === 'extensions') {
        infoText += `${key}: ${info[key].length} extensions supported\n`;
      } else if (Array.isArray(info[key])) {
        infoText += `${key}: ${info[key].join(', ')}\n`;
      } else {
        infoText += `${key}: ${info[key]}\n`;
      }
    }
    
    // Display info
    console.log('WebGL Info:', info);
    alert(infoText);
  }
};

// Initialize debug mode
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    ZenDebug.init();
  }, 1000); // Wait for ZenSpace to be defined
});
