/**
 * Advanced WebGL Zen Space Background
 * Uses Three.js to create an immersive 3D cosmic experience
 */

// Create namespace for our WebGL zen space
const ZenSpace = {
  // Scene elements
  scene: null,
  camera: null,
  renderer: null,
  clock: null,
  
  // Post-processing
  composer: null,
  
  // Container elements
  container: null,
  
  // Particle systems
  particles: {
    stars: null,
    energyStreams: [],
    floatingParticles: null
  },
  
  // Zen elements
  zenElements: {
    mandalas: [],
    energyCenters: [],
    sacredGeometry: [],
    floatingGeometry: [] // New: Sacred geometry specifically around the book
  },
  
  // Interactive elements
  interaction: {
    mouse: new THREE.Vector2(),
    raycaster: new THREE.Raycaster(),
    hoverObjects: [],
    ripples: []
  },
  
  // Audio elements
  audio: {
    listener: null,
    sources: {},
    enabled: false,
    initialized: false
  },
  
  // Timing and animation
  time: {
    current: 0,
    previous: 0,
    delta: 0,
    elapsed: 0,
    lastQuoteTime: 0 // Track when last quote was shown
  },
  
  // Configuration
  config: {
    particleCount: {
      stars: 3000,          // INCREASED from 2000 for more stars
      energyStream: 800,    // INCREASED from 500 for denser streams
      floatingParticles: 500 // INCREASED from 300
    },
    portal: {
      radius: 25,
      depth: 50,
      segments: 64,
      rings: 8,
      speed: 0.2
    },
    colors: {
      background: new THREE.Color(0x030412), // DARKENED for more contrast
      nebula: {
        primary: new THREE.Color(0x0c0c3a),   // ENHANCED saturation
        secondary: new THREE.Color(0x220f3a), // ENHANCED saturation
        accent: new THREE.Color(0x6a1a6a)     // ENHANCED saturation
      },
      stars: [
        new THREE.Color(0xffffff),
        new THREE.Color(0xeeeeff),
        new THREE.Color(0xffffee),
        new THREE.Color(0xeeffff),
        new THREE.Color(0xffeeee),  // ADDED more star colors
        new THREE.Color(0xeeffee)   // ADDED more star colors
      ],
      energy: [
        new THREE.Color(0x88aaff), // Blue
        new THREE.Color(0xffaa88), // Orange
        new THREE.Color(0xaaddff), // Cyan
        new THREE.Color(0xffdd88), // Gold
        new THREE.Color(0xaa88ff)  // Purple
      ],
      chakra: [
        new THREE.Color(0xff0000), // Root - Red
        new THREE.Color(0xff7f00), // Sacral - Orange
        new THREE.Color(0xffff00), // Solar Plexus - Yellow
        new THREE.Color(0x00ff00), // Heart - Green
        new THREE.Color(0x0000ff), // Throat - Blue
        new THREE.Color(0x4b0082), // Third Eye - Indigo
        new THREE.Color(0x9400d3)  // Crown - Violet
      ]
    },
    fog: {
      color: new THREE.Color(0x030412), // DARKENED to match background
      density: 0.001                    // DECREASED for more clarity
    },
    bloom: {
      strength: 2.5,   // INCREASED from 1.5
      radius: 0.85,    // INCREASED from 0.75
      threshold: 0.15  // DECREASED from 0.2 to make more elements glow
    }
  },
  
  // Shader materials
  shaders: {
    nebula: null,
    energyStream: null,
    mandala: null,
    portal: null
  },
  
  // Portal effect
  portal: {
    mesh: null,
    target: new THREE.Vector3(0, 0, -40)
  },
  
  // Zen quotes that will appear occasionally
  zenQuotes: [
    "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.",
    "The obstacle is the path.",
    "Great acts are made up of small deeds. - Lao Tzu",
    "When you reach the top of the mountain, keep climbing.",
    "What you are looking for is already in you… You already are everything you are seeking. — Thich Nhat Hanh",
    "The journey of a thousand miles begins with a single step.",
    "He who conquers others is strong; He who conquers himself is mighty. - Lao Tzu",
    "Enter Zen From Here.",
    "You may believe yourself out of harmoney with life and the eternal, but you can not be, because you are life and exist now.", 
    "When hungry, eat; when tired, sleep.",
    "The quieter you become, the more you can hear.",
    "Zen is not some kind of excitement, but concentration on our usual everyday routine. Shunryu Suzuki",
    "No snowflake ever falls in the wrong place.",
    "To follow the path, look to the master, follow the master, walk with the master, see through the master, become the master.",
  ],
  
  // Initialize the WebGL scene
  init: function(containerId) {
    // Check WebGL availability
    if (!window.WebGLRenderingContext) {
      console.error('WebGL not supported in this browser');
      return false;
    }
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not available');
      return false;
    }
    
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Container element not found');
      return false;
    }
    
    // Create clock for timing
    this.clock = new THREE.Clock();
    
    // Initialize core Three.js components
    this.initRenderer();
    this.initScene();
    this.initCamera();
    
    // Initialize post-processing
    this.initPostProcessing();
    
    // Add window event listeners
    this.addEventListeners();
    
    // Create scene elements
    this.createPortal(); // Add portal effect first (at the back)
    this.createNebula();
    this.createStars();
    this.createEnergyStreams();
    this.createZenElements();
    
    // Start animation loop
    this.animate();
    
    console.log('WebGL Zen Space initialized');
    console.log('Scene children:', this.scene.children.length);
    console.log('Camera position:', this.camera.position);
    return true;
  },
  
  // Initialize renderer
  initRenderer: function() {
    // Create WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    // Configure renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this.renderer.setClearColor(this.config.colors.background, 1);
    this.renderer.autoClear = false;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Add canvas to container
    this.container.appendChild(this.renderer.domElement);
    
    // Style canvas
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.zIndex = '-10';
    this.renderer.domElement.style.pointerEvents = 'none';
  },
  
  // Initialize scene
  initScene: function() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Add fog for depth
    this.scene.fog = new THREE.FogExp2(
      this.config.fog.color,
      this.config.fog.density
    );
  },
  
  // Initialize camera
  initCamera: function() {
    // Create perspective camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 50;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    this.camera.lookAt(0, 0, 0);
    
    // Add camera to scene
    this.scene.add(this.camera);
    
    // Initialize audio listener on camera if supported
    if (window.AudioContext || window.webkitAudioContext) {
      this.audio.listener = new THREE.AudioListener();
      this.camera.add(this.audio.listener);
    }
  },
  
  // Initialize post-processing for glow effects
  initPostProcessing: function() {
    try {
      // Check if post-processing classes are available
      if (typeof THREE.EffectComposer !== 'undefined') {
        // Create composer for post-processing
        this.composer = new THREE.EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add unreal bloom pass for glow effect
        const bloomPass = new THREE.UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          this.config.bloom.strength,
          this.config.bloom.radius,
          this.config.bloom.threshold
        );
        this.composer.addPass(bloomPass);
      } else if (window.POSTPROCESSING) {
        // Alternative: use POSTPROCESSING namespace if available
        const { EffectComposer, RenderPass, BloomEffect, EffectPass } = POSTPROCESSING;
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        
        const bloomEffect = new BloomEffect({
          intensity: this.config.bloom.strength,
          luminanceThreshold: this.config.bloom.threshold,
          luminanceSmoothing: this.config.bloom.radius
        });
        
        this.composer.addPass(new EffectPass(this.camera, bloomEffect));
      } else {
        console.warn('Post-processing not available, using basic renderer');
        this.composer = null;
      }
    } catch (error) {
      console.error('Error initializing post-processing:', error);
      this.composer = null;
    }
  },
  
  // Add event listeners
  addEventListeners: function() {
    // Resize event
    window.addEventListener('resize', () => this.onWindowResize(), false);
    
    // Mouse move event
    document.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    
    // Mouse click event
    document.addEventListener('click', (event) => this.onMouseClick(event), false);
  },
  
  // Handle window resize
  onWindowResize: function() {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }
  },
  
  // Handle mouse movement
  onMouseMove: function(event) {
    // Update mouse position for raycasting
    this.interaction.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.interaction.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Enhanced camera movement based on mouse position
    const camMovementX = this.interaction.mouse.x * 3; // INCREASED from 2
    const camMovementY = this.interaction.mouse.y * 3; // INCREASED from 2
    
    // Smoothly move camera
    gsap.to(this.camera.position, {
      x: camMovementX,
      y: camMovementY,
      duration: 2,
      ease: 'power2.out'
    });
    
    // Move portal based on mouse (more subtle effect for depth parallax)
    if (this.portal.mesh) {
      gsap.to(this.portal.mesh.position, {
        x: this.interaction.mouse.x * -1.5, // Inverse movement for parallax
        y: this.interaction.mouse.y * -1.5, // Inverse movement for parallax
        duration: 2,
        ease: 'power2.out'
      });
      
      // Also move the portal light
      if (this.portal.light) {
        gsap.to(this.portal.light.position, {
          x: this.portal.target.x + this.interaction.mouse.x * -2,
          y: this.portal.target.y + this.interaction.mouse.y * -2,
          duration: 2,
          ease: 'power2.out'
        });
      }
    }
  },
  
  // Handle mouse click
  onMouseClick: function(event) {
    // Create ripple effect at click position
    this.createRipple(event.clientX, event.clientY);
  },
  
  // Create cosmic portal effect
  createPortal: function() {
    // Create geometry for the portal rings
    const geometry = new THREE.TorusGeometry(
      this.config.portal.radius,
      0.5,
      this.config.portal.segments,
      this.config.portal.segments
    );
    
    // Create shader material for the portal
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uDepth: { value: this.config.portal.depth },
        uRings: { value: this.config.portal.rings },
        uColor1: { value: new THREE.Color(0x8800ff) },  // Deep purple
        uColor2: { value: new THREE.Color(0x0088ff) },  // Bright blue
        uPortalRadius: { value: this.config.portal.radius }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uDepth;
        uniform float uRings;
        
        varying vec2 vUv;
        varying float vDepth;
        varying float vRingIndex;
        
        void main() {
          vUv = uv;
          
          // Calculate ring index based on instance id
          vRingIndex = float(gl_InstanceID);
          
          // Calculate depth based on ring index
          vDepth = vRingIndex / (uRings - 1.0);
          
          // Position the ring in 3D space based on its depth
          vec3 pos = position;
          
          // Scale down rings as they go deeper
          float scale = 1.0 - (vDepth * 0.7);
          pos *= scale;
          
          // Move rings along z-axis based on depth
          float z = -vDepth * uDepth;
          
          // Add some movement based on time
          float movementSpeed = uTime * (0.2 + vDepth * 0.8); // Faster movement for deeper rings
          z -= mod(movementSpeed, uDepth);
          
          // Final position
          vec4 modelPosition = modelMatrix * vec4(pos.x, pos.y, z, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uPortalRadius;
        
        varying vec2 vUv;
        varying float vDepth;
        varying float vRingIndex;
        
        void main() {
          // Create a glowing effect based on depth
          float glow = 1.0 - vDepth;
          
          // Pulse effect
          float pulse = 0.5 + 0.5 * sin(uTime * 0.5 + vRingIndex * 0.2);
          glow *= (0.7 + 0.3 * pulse);
          
          // Mix colors based on depth and time
          float colorMix = sin(uTime * 0.2 + vDepth * 3.14) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, colorMix);
          
          // Apply glow to color
          color *= glow * 1.5;
          
          // Create ring shape
          float ring = 0.5 - abs(vUv.y - 0.5);
          ring = smoothstep(0.0, 0.5, ring);
          
          // Final alpha with pulse effect
          float alpha = ring * glow * (0.5 + 0.5 * pulse);
          
          // Output final color
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    
    // Store shader material for updates
    this.shaders.portal = material;
    
    // Create instanced mesh for efficient rendering of multiple rings
    const mesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.config.portal.rings
    );
    
    // Set instance matrix for each ring
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < this.config.portal.rings; i++) {
      mesh.setMatrixAt(i, matrix);
    }
    
    // Position the portal
    mesh.position.copy(this.portal.target);
    
    // Add to scene
    this.scene.add(mesh);
    
    // Store reference to mesh
    this.portal.mesh = mesh;
    
    // Create a point light at the center of the portal
    const portalLight = new THREE.PointLight(
      new THREE.Color(0x6633ff), // Purple light
      1.0,  // Intensity
      80    // Distance
    );
    portalLight.position.copy(this.portal.target);
    this.scene.add(portalLight);
    
    // Store light with portal
    this.portal.light = portalLight;
  },
  
  // Create cosmic nebula background with portal effect
  createNebula: function() {
    // Create geometry (simple plane that fills view)
    const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    
    // Create shader material for nebula
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uColorPrimary: { value: this.config.colors.nebula.primary },
        uColorSecondary: { value: this.config.colors.nebula.secondary },
        uColorAccent: { value: this.config.colors.nebula.accent },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) } // For portal interaction
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColorPrimary;
        uniform vec3 uColorSecondary;
        uniform vec3 uColorAccent;
        
        varying vec2 vUv;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          // First corner
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          // Permutations
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                
          // Gradients
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          // Create coordinate system centered at the middle
          vec2 p = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
          p.x *= uResolution.x / uResolution.y;
          
          // ENHANCED: Create more dynamic base color from nebula colors with faster time
          float nebulaNoise = snoise(vec3(p * 1.8, uTime * 0.08)) * 0.5 + 0.5; // Increased scale and speed
          float nebulaNoiseSmall = snoise(vec3(p * 6.0, uTime * 0.05)) * 0.5 + 0.5; // Increased scale and speed
          
          // ENHANCED: Mix colors with more contrast
          vec3 color = mix(uColorPrimary, uColorSecondary, nebulaNoise);
          color = mix(color, uColorAccent, nebulaNoiseSmall * 0.5); // Increased from 0.3
          
          // ENHANCED: Add some depth with stronger vignette effect
          float vignette = 1.0 - length(p * 0.8); // Increased from 0.7
          vignette = pow(smoothstep(0.0, 1.0, vignette), 1.5); // Added pow for more pronounced effect
          color *= vignette * 2.0; // Increased from 1.5
          
          // ENHANCED: Add subtle color pulsing over time
          color *= 1.0 + 0.2 * sin(uTime * 0.2); // Add subtle breathing effect to the entire nebula
          
          // Output final color
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
    
    // Store shader material for updates
    this.shaders.nebula = material;
    
    // Create mesh and position it behind everything
    const nebula = new THREE.Mesh(geometry, material);
    nebula.position.z = -50;
    nebula.scale.set(2, 2, 1);
    
    // Add to scene
    this.scene.add(nebula);
  },
  
  // Create star field
  createStars: function() {
    // Create geometry for star particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.config.particleCount.stars * 3);
    const sizes = new Float32Array(this.config.particleCount.stars);
    const colors = new Float32Array(this.config.particleCount.stars * 3);
    const opacities = new Float32Array(this.config.particleCount.stars);
    
    // Populate star data
    for (let i = 0; i < this.config.particleCount.stars; i++) {
      // Position - random in a sphere
      const radius = 50 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);       // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);   // y
      positions[i * 3 + 2] = radius * Math.cos(phi) - 40;                // z (pull back to be behind nebula)
      
      // ENHANCED: Size - random between 0.1 and 1.5 (increased from 0.9)
      sizes[i] = 0.1 + Math.random() * 1.5;
      
      // Color - select from star colors
      const colorIndex = Math.floor(Math.random() * this.config.colors.stars.length);
      const color = this.config.colors.stars[colorIndex];
      colors[i * 3] = color.r;     // r
      colors[i * 3 + 1] = color.g; // g
      colors[i * 3 + 2] = color.b; // b
      
      // ENHANCED: Opacity - random between 0.3 and 1.0 (increased from 0.2)
      opacities[i] = 0.3 + Math.random() * 0.7;
    }
    
    // Set attributes for geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    // Create shader material for stars
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 350 } // INCREASED from 200 for larger stars
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        
        attribute float size;
        attribute vec3 color;
        attribute float opacity;
        
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          // Position
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          // ENHANCED: Add more pronounced movement to stars
          float angle = uTime * 0.08; // Increased from 0.05
          float amplitude = 0.2; // Increased from 0.1
          modelPosition.x += sin(uTime * 0.15 + position.z * 0.5) * amplitude; // Increased speed
          modelPosition.y += cos(uTime * 0.15 + position.x * 0.5) * amplitude; // Increased speed
          
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;
          
          // Size attenuation - smaller with distance
          gl_PointSize = size * uSize * uPixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          
          // Pass data to fragment shader
          vColor = color;
          
          // ENHANCED: Animate opacity based on time for more dramatic twinkling
          float twinkle = sin(uTime * (1.5 + size) + position.x * 100.0) * 0.5 + 0.5; // Increased speed
          vOpacity = opacity * (0.5 + twinkle * 0.5); // More pronounced effect (0.5 to 1.0 range)
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          // Calculate distance from center of point
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          
          // Create circle shape with soft edge
          float strength = smoothstep(0.5, 0.0, distanceToCenter);
          
          // ENHANCED: Star glow with more brightness
          vec3 color = vColor * 1.2; // Increased brightness
          
          // ENHANCED: Apply stronger radial fade for more pronounced glow effect
          float glow = exp(-distanceToCenter * 3.0); // Decreased from 4.0 for wider glow
          
          // Output final color
          gl_FragColor = vec4(color, vOpacity * strength * glow);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    // Create particle system for stars
    this.particles.stars = new THREE.Points(geometry, material);
    
    // Add to scene
    this.scene.add(this.particles.stars);
  },
  
  // Create energy streams
  createEnergyStreams: function() {
    // ENHANCED: Create 6 energy streams instead of 4
    const streamDirections = [
      { x: -40, y: 20, z: -20 },   // Top left
      { x: 40, y: 20, z: -20 },    // Top right
      { x: 40, y: -20, z: -20 },   // Bottom right
      { x: -40, y: -20, z: -20 },  // Bottom left
      { x: 0, y: 35, z: -20 },     // Top center (NEW)
      { x: 0, y: -35, z: -20 }     // Bottom center (NEW)
    ];
    
    // Target is center of scene where book is
    const target = new THREE.Vector3(0, 0, 0);
    
    // Create each stream
    streamDirections.forEach((position, index) => {
      this.createEnergyStream(
        new THREE.Vector3(position.x, position.y, position.z),
        target,
        this.config.colors.energy[index % this.config.colors.energy.length],
        index
      );
    });
  },
  
  // Create a single energy stream
  createEnergyStream: function(startPosition, targetPosition, color, index) {
    // Create geometry for particles
    const geometry = new THREE.BufferGeometry();
    const particleCount = this.config.particleCount.energyStream;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const progresses = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);
    
    // Direction vector from start to target
    const direction = new THREE.Vector3()
      .subVectors(targetPosition, startPosition)
      .normalize();
    
    // Calculate the distance
    const distance = startPosition.distanceTo(targetPosition);
    
    // Calculate the stream path (with a slight curve)
    const controlPoint = new THREE.Vector3()
      .copy(startPosition)
      .add(targetPosition)
      .divideScalar(2); // Midpoint
    
    // Add some offset to control point to create curve
    controlPoint.x += (Math.random() - 0.5) * 20;
    controlPoint.y += (Math.random() - 0.5) * 20;
    controlPoint.z += (Math.random() - 0.5) * 5;
    
    // Initialize particle data
    for (let i = 0; i < particleCount; i++) {
      // Random progress along the stream path
      const progress = Math.random();
      progresses[i] = progress;
      
      // Calculate position along curved path using quadratic bezier
      const t = progress;
      const p0 = startPosition;
      const p1 = controlPoint;
      const p2 = targetPosition;
      
      // Quadratic bezier formula: B(t) = (1-t)²p0 + 2(1-t)tp1 + t²p2
      const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
      const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
      const z = Math.pow(1 - t, 2) * p0.z + 2 * (1 - t) * t * p1.z + Math.pow(t, 2) * p2.z;
      
      // ENHANCED: Reduce spread for a more focused stream
      const spread = 1.8 * (1 - Math.pow(t, 0.5)); // Decreased from 2.0
      positions[i * 3] = x + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * spread;
      
      // ENHANCED: Size - larger particles overall
      sizes[i] = 0.2 + Math.pow(t, 2) * 1.2; // Increased from 0.1 and 0.9
      
      // Random value for animation
      randoms[i] = Math.random();
    }
    
    // Set attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('progress', new THREE.BufferAttribute(progresses, 1));
    geometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1));
    
    // Create shader material for energy stream
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 150 },  // INCREASED from 100
        uColor: { value: color },
        uSpeed: { value: 0.3 + Math.random() * 0.1 } // INCREASED from 0.2
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        uniform float uSpeed;
        
        attribute float size;
        attribute float progress;
        attribute float random;
        
        varying float vProgress;
        
        void main() {
          // Position
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;
          
          // Size attenuation
          gl_PointSize = size * uSize * uPixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          
          // Animate progress for flowing effect
          vProgress = fract(progress + uTime * uSpeed * (0.8 + random * 0.4));
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        
        varying float vProgress;
        
        void main() {
          // Calculate distance from center
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          
          // ENHANCED: Create softer circle shape with wider glow
          float strength = smoothstep(0.5, 0.1, distanceToCenter); // Changed from 0.0 to 0.1
          
          // ENHANCED: Create more pronounced tail effect based on progress
          float tail = smoothstep(0.0, 0.7, vProgress) * smoothstep(1.0, 0.7, vProgress); // Changed from 0.8
          
          // ENHANCED: Combine for final color with higher intensity
          vec3 color = uColor * 1.3; // Increased brightness
          float alpha = strength * tail * 1.2; // Increased from 1.0
          
          // ENHANCED: Additional glow for head of particle
          float headGlow = smoothstep(0.8, 1.0, vProgress) * 3.0; // Increased from 2.0
          alpha += headGlow * strength * 0.7; // Increased from 0.5
          
          // Discard transparent pixels
          if (alpha < 0.01) discard;
          
          // Output final color
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    // Create particle system
    const particles = new THREE.Points(geometry, material);
    
    // Store in energy streams array
    this.particles.energyStreams.push({
      particles,
      material
    });
    
    // Add to scene
    this.scene.add(particles);
  },
  
  // Create zen elements (mandalas, energy centers, sacred geometry)
  createZenElements: function() {
    // Create mandalas
    this.createMandalas();
    
    // Create energy centers
    this.createEnergyCenters();
    
    // Create sacred geometry
    this.createSacredGeometry();
  },
  
  // Create 3D mandala elements
  createMandalas: function() {
    // ENHANCED: More mandala positions around the scene
    const positions = [
      { x: -30, y: 15, z: -15 },
      { x: 30, y: 20, z: -20 },
      { x: 5, y: -25, z: -10 },
      { x: -25, y: -5, z: -12 }, // NEW
      { x: 25, y: 5, z: -18 }    // NEW
    ];
    
    // Create each mandala
    positions.forEach((position, index) => {
      // ENHANCED: Create larger mandala circles
      const radius = 3 + Math.random() * 4; // Increased from 2 + random * 3
      const geometry = new THREE.CircleGeometry(radius, 32);
      
      // Create shader material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: this.getRandomMandalaTexture() },
          uColor: { value: this.config.colors.energy[index % this.config.colors.energy.length] },
          uOpacity: { value: 0.4 + Math.random() * 0.3 } // INCREASED from 0.2
        },
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform sampler2D uTexture;
          uniform vec3 uColor;
          uniform float uOpacity;
          
          varying vec2 vUv;
          
          void main() {
            // Calculate distance from center
            vec2 centeredUv = vUv - 0.5;
            float distanceToCenter = length(centeredUv);
            
            // ENHANCED: Rotate texture coordinates based on time with faster rotation
            float angle = uTime * 0.15; // Increased from 0.1
            vec2 rotatedUv = vec2(
              centeredUv.x * cos(angle) - centeredUv.y * sin(angle),
              centeredUv.x * sin(angle) + centeredUv.y * cos(angle)
            ) + 0.5;
            
            // Sample texture
            vec4 texColor = texture2D(uTexture, rotatedUv);
            
            // Create edge fade
            float fade = smoothstep(1.0, 0.7, distanceToCenter * 2.0); // Changed from 0.8
            
            // ENHANCED: Animate opacity with more pronounced pulsing
            float pulseOpacity = uOpacity * (0.7 + 0.3 * sin(uTime * 0.3 + distanceToCenter * 12.0)); // Increased effect
            
            // ENHANCED: Combine for final color with higher intensity
            vec3 color = uColor * texColor.rgb * 1.3; // Increased brightness
            float alpha = texColor.a * fade * pulseOpacity * 1.2; // Increased visibility
            
            // Output final color
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      
      // Create mesh
      const mandala = new THREE.Mesh(geometry, material);
      
      // Position in scene
      mandala.position.set(position.x, position.y, position.z);
      
      // Random rotation
      mandala.rotation.z = Math.random() * Math.PI * 2;
      
      // ENHANCED: More varied animation speeds
      mandala.userData = {
        rotationSpeed: 0.015 + Math.random() * 0.035, // Increased from 0.01 + random * 0.03
        floatSpeed: 0.2 + Math.random() * 0.3,
        floatAmplitude: 0.3 + Math.random() * 0.4 // Increased from 0.2 + random * 0.3
      };
      
      // Add to mandalas array
      this.zenElements.mandalas.push({
        mesh: mandala,
        material: material
      });
      
      // Add to scene
      this.scene.add(mandala);
    });
  },
  
  // Create 3D energy centers
  createEnergyCenters: function() {
    // Energy center positions
    const positions = [
      { x: 0, y: 0, z: 5 },        // Center/Main
      { x: -20, y: 10, z: -10 },   // Top left
      { x: 20, y: 15, z: -15 },    // Top right
      { x: 15, y: -15, z: -5 },    // Bottom right
      { x: -15, y: -20, z: -10 }   // Bottom left
    ];
    
    // Create each energy center
    positions.forEach((position, index) => {
      // Use chakra colors in sequence
      const colorIndex = index % this.config.colors.chakra.length;
      const color = this.config.colors.chakra[colorIndex];
      
      // ENHANCED: Create larger energy centers
      const radius = index === 0 ? 2.0 : 0.8 + Math.random() * 0.7; // Increased from 1.5 and 0.5
      const geometry = new THREE.SphereGeometry(radius, 16, 16);
      
      // Create material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: color },
          uIntensity: { value: index === 0 ? 1.3 : 0.8 + Math.random() * 0.5 } // Increased from 1.0 and 0.6
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normal;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uIntensity;
          
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            // ENHANCED: Stronger edge glow effect
            float rim = 1.0 - max(0.0, dot(normalize(vNormal), normalize(-vPosition)));
            rim = pow(rim, 1.7) * 2.5; // Changed from 2.0 and 2.0
            
            // ENHANCED: More pronounced pulse effect
            float pulse = (0.5 + 0.5 * sin(uTime * 0.6)) * uIntensity; // Increased from 0.5
            
            // ENHANCED: Combine for final color with higher intensity
            vec3 color = uColor * (1.0 + pulse * 0.7); // Increased from 0.5
            float alpha = rim * (0.7 + pulse * 0.5); // Increased from 0.6 and 0.4
            
            // Output final color
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      // Create mesh
      const energyCenter = new THREE.Mesh(geometry, material);
      
      // Position in scene
      energyCenter.position.set(position.x, position.y, position.z);
      
      // ENHANCED: Brighter light for the energy center (only for main/center)
      if (index === 0) {
        const light = new THREE.PointLight(
          color,
          0.8,  // Increased from 0.5
          40    // Increased from 30
        );
        light.position.copy(energyCenter.position);
        this.scene.add(light);
        
        // Store light with energy center
        energyCenter.userData = {
          light: light,
          pulseSpeed: 0.6, // Increased from 0.5
          floatSpeed: 0.3,
          floatAmplitude: 0.4 // Increased from 0.3
        };
      } else {
        // ENHANCED: More dramatic animation
        energyCenter.userData = {
          pulseSpeed: 0.4 + Math.random() * 0.6, // Increased from 0.3 + random * 0.5
          floatSpeed: 0.2 + Math.random() * 0.4,
          floatAmplitude: 0.2 + Math.random() * 0.6 // Increased from 0.1 + random * 0.5
        };
      }
      
      // Add to energy centers array
      this.zenElements.energyCenters.push({
        mesh: energyCenter,
        material: material,
        originalPosition: { ...position }
      });
      
      // Add to scene
      this.scene.add(energyCenter);
    });
  },
  
  // Create sacred geometry elements
  createSacredGeometry: function() {
    // Create Flower of Life pattern
    this.createFlowerOfLife();
    
    // Create Metatron's Cube 
    this.createMetatronCube();
    
    // ENHANCED: Create Sri Yantra (new sacred geometry pattern)
    this.createSriYantra();
    
    // NEW: Create floating sacred geometry around the book
    this.createFloatingGeometry();
  },
  
  // Create Flower of Life geometry
  createFlowerOfLife: function() {
    // Position in scene
    const position = { x: -25, y: -15, z: -10 };
    
    // Group to hold all circles
    const flowerGroup = new THREE.Group();
    
    // ENHANCED: Larger radius
    const radius = 1.0;  // Increased from 0.8
    const color = this.config.colors.energy[1]; // Use energy color
    
    // Create center circle
    const center = { x: 0, y: 0 };
    this.createSacredCircle(flowerGroup, center.x, center.y, radius, color);
    
    // ENHANCED: Create two rings of circles (was only one)
    // First ring (6 circles)
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = center.x + radius * 2 * Math.cos(angle);
      const y = center.y + radius * 2 * Math.sin(angle);
      this.createSacredCircle(flowerGroup, x, y, radius, color);
    }
    
    // Second ring (12 circles)
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI / 6) * i;
      const x = center.x + radius * 4 * Math.cos(angle);
      const y = center.y + radius * 4 * Math.sin(angle);
      this.createSacredCircle(flowerGroup, x, y, radius, color);
    }
    
    // Position group in scene
    flowerGroup.position.set(position.x, position.y, position.z);
    
    // ENHANCED: Faster rotation animation
    flowerGroup.userData = {
      rotationSpeed: 0.007, // Increased from 0.005
      floatSpeed: 0.15,
      floatAmplitude: 0.3,
      originalY: position.y
    };
    
    // Add to sacred geometry array
    this.zenElements.sacredGeometry.push({
      mesh: flowerGroup,
      type: 'flowerOfLife'
    });
    
    // Add to scene
    this.scene.add(flowerGroup);
  },
  
  // Create Metatron's Cube geometry
  createMetatronCube: function() {
    // Position in scene
    const position = { x: 25, y: -10, z: -15 };
    
    // Group to hold all elements
    const cubeGroup = new THREE.Group();
    
    // ENHANCED: Larger radius
    const radius = 0.6; // Increased from 0.4
    const color = this.config.colors.energy[3]; // Use energy color
    
    // Create center circle
    this.createSacredCircle(cubeGroup, 0, 0, radius, color);
    
    // Create vertices of the cube
    const vertices = [
      { x: 0, y: 2 * radius, z: 0 },        // Top
      { x: 0, y: -2 * radius, z: 0 },       // Bottom
      { x: 2 * radius, y: 0, z: 0 },        // Right
      { x: -2 * radius, y: 0, z: 0 },       // Left
      { x: 0, y: 0, z: 2 * radius },        // Front
      { x: 0, y: 0, z: -2 * radius }        // Back
    ];
    
    // Create circles at vertices
    vertices.forEach(vertex => {
      this.createSacredCircle(cubeGroup, vertex.x, vertex.y, radius, color, vertex.z);
    });
    
    // ENHANCED: Create circles at the 8 corners of the cube
    const corners = [
      { x: radius, y: radius, z: radius },
      { x: -radius, y: radius, z: radius },
      { x: radius, y: -radius, z: radius },
      { x: -radius, y: -radius, z: radius },
      { x: radius, y: radius, z: -radius },
      { x: -radius, y: radius, z: -radius },
      { x: radius, y: -radius, z: -radius },
      { x: -radius, y: -radius, z: -radius }
    ];
    
    // Create circles at corners
    corners.forEach(corner => {
      this.createSacredCircle(cubeGroup, corner.x, corner.y, radius * 0.5, color, corner.z);
    });
    
    // Create lines connecting vertices
    const lineMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5, // INCREASED from 0.3
      blending: THREE.AdditiveBlending
    });
    
    // Connect all vertices to create the cube
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(vertices[i].x, vertices[i].y, vertices[i].z || 0),
          new THREE.Vector3(vertices[j].x, vertices[j].y, vertices[j].z || 0)
        ]);
        
        const line = new THREE.Line(geometry, lineMaterial);
        cubeGroup.add(line);
      }
    }
    
    // Position group in scene
    cubeGroup.position.set(position.x, position.y, position.z);
    
    // ENHANCED: Faster rotation animation
    cubeGroup.userData = {
      rotationSpeed: 0.015, // Increased from 0.01
      floatSpeed: 0.2,
      floatAmplitude: 0.25, // Increased from 0.2
      originalY: position.y
    };
    
    // Add to sacred geometry array
    this.zenElements.sacredGeometry.push({
      mesh: cubeGroup,
      type: 'metatronCube'
    });
    
    // Add to scene
    this.scene.add(cubeGroup);
  },
  
  // ENHANCED: New sacred geometry - Sri Yantra
  createSriYantra: function() {
    // Position in scene
    const position = { x: 0, y: -30, z: -18 };
    
    // Group to hold all elements
    const yantraGroup = new THREE.Group();
    
    // Use gold color
    const color = this.config.colors.energy[3];
    
    // Create outer circle
    this.createSacredCircle(yantraGroup, 0, 0, 4, color);
    
    // Create triangles - simplified Sri Yantra with just 2 triangles
    const triangleMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    // Upward triangle
    const upTriangleGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(-3 * Math.cos(Math.PI/6), -3 * Math.sin(Math.PI/6), 0),
      new THREE.Vector3(3 * Math.cos(Math.PI/6), -3 * Math.sin(Math.PI/6), 0),
      new THREE.Vector3(0, 3, 0)
    ]);
    
    const upTriangle = new THREE.Line(upTriangleGeometry, triangleMaterial);
    yantraGroup.add(upTriangle);
    
    // Downward triangle
    const downTriangleGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -3, 0),
      new THREE.Vector3(-3 * Math.cos(Math.PI/6), 3 * Math.sin(Math.PI/6), 0),
      new THREE.Vector3(3 * Math.cos(Math.PI/6), 3 * Math.sin(Math.PI/6), 0),
      new THREE.Vector3(0, -3, 0)
    ]);
    
    const downTriangle = new THREE.Line(downTriangleGeometry, triangleMaterial);
    yantraGroup.add(downTriangle);
    
    // Add inner circle (bindu)
    this.createSacredCircle(yantraGroup, 0, 0, 0.5, color);
    
    // Position group in scene
    yantraGroup.position.set(position.x, position.y, position.z);
    
    // Animation parameters
    yantraGroup.userData = {
      rotationSpeed: 0.005,
      floatSpeed: 0.12,
      floatAmplitude: 0.3,
      originalY: position.y
    };
    
    // Add to sacred geometry array
    this.zenElements.sacredGeometry.push({
      mesh: yantraGroup,
      type: 'sriYantra'
    });
    
    // Add to scene
    this.scene.add(yantraGroup);
  },
  
  // NEW: Create floating sacred geometry around the book
  createFloatingGeometry: function() {
    console.log('Creating floating sacred geometry...');
    // Create multiple sacred geometry patterns floating around the book
    
    // 1. Platonic Solids (Tetrahedron, Octahedron, Icosahedron)
    this.createPlatonicSolid({ x: -15, y: 8, z: 10 }, 'tetrahedron');
    this.createPlatonicSolid({ x: 18, y: -5, z: 8 }, 'octahedron');
    this.createPlatonicSolid({ x: -12, y: -12, z: 12 }, 'icosahedron');
    
    // 2. Seed of Life pattern
    this.createSeedOfLife({ x: 20, y: 12, z: 5 });
    
    // 3. Vesica Piscis
    this.createVesicaPiscis({ x: -18, y: 0, z: 7 });
    
    // 4. Merkaba (Star Tetrahedron)
    this.createMerkaba({ x: 0, y: 15, z: 6 });
    
    // 5. Golden Spiral
    this.createGoldenSpiral({ x: 15, y: -15, z: 9 });
    
    // 6. Dodecahedron (12-sided platonic solid)
    this.createPlatonicSolid({ x: -8, y: 18, z: 11 }, 'dodecahedron');
    
    console.log('Created', this.zenElements.floatingGeometry.length, 'floating geometry objects');
  },
  
  // Create Platonic Solid
  createPlatonicSolid: function(position, type) {
    let geometry;
    const radius = 1.2;
    const color = this.config.colors.energy[Math.floor(Math.random() * this.config.colors.energy.length)];
    
    switch(type) {
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(radius, 0);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(radius, 0);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(radius, 0);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(radius, 0);
        break;
      default:
        geometry = new THREE.TetrahedronGeometry(radius, 0);
    }
    
    // Create wireframe material for mystical look
    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    
    // Also create a glowing core
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    
    // Create both wireframe and solid versions
    const wireframeMesh = new THREE.Mesh(geometry, material);
    const coreMesh = new THREE.Mesh(geometry, coreMaterial);
    
    // Group them together
    const group = new THREE.Group();
    group.add(wireframeMesh);
    group.add(coreMesh);
    
    // Position the group
    group.position.set(position.x, position.y, position.z);
    
    // Animation parameters
    group.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      },
      floatSpeed: 0.3 + Math.random() * 0.2,
      floatAmplitude: 1 + Math.random() * 0.5,
      orbitRadius: 3 + Math.random() * 2,
      orbitSpeed: 0.1 + Math.random() * 0.1,
      originalPosition: { ...position },
      type: 'platonic'
    };
    
    // Add to floating geometry array
    this.zenElements.floatingGeometry.push({
      mesh: group,
      type: type
    });
    
    // Add to scene
    this.scene.add(group);
  },
  
  // Create Seed of Life pattern
  createSeedOfLife: function(position) {
    const group = new THREE.Group();
    const radius = 0.5;
    const color = this.config.colors.energy[2];
    
    // Center circle
    this.createSacredCircle(group, 0, 0, radius, color);
    
    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = radius * 2 * Math.cos(angle);
      const y = radius * 2 * Math.sin(angle);
      this.createSacredCircle(group, x, y, radius, color);
    }
    
    // Position group
    group.position.set(position.x, position.y, position.z);
    
    // Animation parameters
    group.userData = {
      rotationSpeed: 0.01,
      floatSpeed: 0.25,
      floatAmplitude: 0.8,
      pulseSpeed: 0.5,
      originalPosition: { ...position },
      type: 'seedOfLife'
    };
    
    // Add to floating geometry array
    this.zenElements.floatingGeometry.push({
      mesh: group,
      type: 'seedOfLife'
    });
    
    // Add to scene
    this.scene.add(group);
  },
  
  // Create Vesica Piscis
  createVesicaPiscis: function(position) {
    const group = new THREE.Group();
    const radius = 1.5;
    const color = this.config.colors.energy[4];
    
    // Create two overlapping circles
    const circle1 = this.createSacredCircle(group, -radius/2, 0, radius, color);
    const circle2 = this.createSacredCircle(group, radius/2, 0, radius, color);
    
    // Add central almond shape highlight
    const almondGeometry = new THREE.Shape();
    const angle1 = Math.acos(0.25); // Where circles intersect
    almondGeometry.moveTo(0, radius * Math.sin(angle1));
    almondGeometry.absarc(-radius/2, 0, radius, angle1, -angle1, false);
    almondGeometry.absarc(radius/2, 0, radius, Math.PI + angle1, Math.PI - angle1, false);
    
    const almondMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(almondGeometry),
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      })
    );
    
    group.add(almondMesh);
    
    // Position group
    group.position.set(position.x, position.y, position.z);
    
    // Animation parameters
    group.userData = {
      rotationSpeed: 0.008,
      floatSpeed: 0.2,
      floatAmplitude: 0.6,
      scaleSpeed: 0.3,
      originalPosition: { ...position },
      type: 'vesicaPiscis'
    };
    
    // Add to floating geometry array
    this.zenElements.floatingGeometry.push({
      mesh: group,
      type: 'vesicaPiscis'
    });
    
    // Add to scene
    this.scene.add(group);
  },
  
  // Create Merkaba (Star Tetrahedron)
  createMerkaba: function(position) {
    const group = new THREE.Group();
    const radius = 1.5;
    const color = new THREE.Color(0xffd700); // Gold color for merkaba
    
    // Create two tetrahedrons
    const geometry = new THREE.TetrahedronGeometry(radius, 0);
    
    // Upward pointing tetrahedron
    const material1 = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const tetra1 = new THREE.Mesh(geometry, material1);
    
    // Downward pointing tetrahedron
    const material2 = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const tetra2 = new THREE.Mesh(geometry.clone(), material2);
    tetra2.rotation.y = Math.PI;
    tetra2.rotation.z = Math.PI;
    
    group.add(tetra1);
    group.add(tetra2);
    
    // Add glowing center sphere
    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.2, 16, 16),
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      })
    );
    group.add(centerSphere);
    
    // Position group
    group.position.set(position.x, position.y, position.z);
    
    // Animation parameters - more complex rotation for merkaba
    group.userData = {
      rotationSpeed: {
        x: 0.01,
        y: 0.015,
        z: 0.005
      },
      floatSpeed: 0.15,
      floatAmplitude: 1.2,
      spinSpeed: 0.02,
      originalPosition: { ...position },
      type: 'merkaba'
    };
    
    // Add to floating geometry array
    this.zenElements.floatingGeometry.push({
      mesh: group,
      type: 'merkaba'
    });
    
    // Add to scene
    this.scene.add(group);
  },
  
  // Create Golden Spiral
  createGoldenSpiral: function(position) {
    const group = new THREE.Group();
    const color = this.config.colors.energy[3];
    
    // Create spiral using line geometry
    const points = [];
    const goldenRatio = 1.618;
    const turns = 4;
    const pointsPerTurn = 50;
    
    for (let i = 0; i < turns * pointsPerTurn; i++) {
      const t = i / pointsPerTurn;
      const angle = t * Math.PI * 2;
      const radius = Math.pow(goldenRatio, t * 0.5) * 0.1;
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = t * 0.1; // Slight 3D spiral
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const spiralGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const spiralMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const spiral = new THREE.Line(spiralGeometry, spiralMaterial);
    group.add(spiral);
    
    // Add glowing particles along the spiral
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(points.length * 3);
    
    points.forEach((point, i) => {
      particlePositions[i * 3] = point.x;
      particlePositions[i * 3 + 1] = point.y;
      particlePositions[i * 3 + 2] = point.z;
    });
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Position and scale group
    group.position.set(position.x, position.y, position.z);
    group.scale.set(3, 3, 3);
    
    // Animation parameters
    group.userData = {
      rotationSpeed: {
        x: 0.005,
        y: 0.01,
        z: 0.002
      },
      floatSpeed: 0.3,
      floatAmplitude: 0.5,
      originalPosition: { ...position },
      type: 'goldenSpiral'
    };
    
    // Add to floating geometry array
    this.zenElements.floatingGeometry.push({
      mesh: group,
      type: 'goldenSpiral'
    });
    
    // Add to scene
    this.scene.add(group);
  },
  
  // Helper to create circles for sacred geometry
  createSacredCircle: function(group, x, y, radius, color, z = 0) {
    // Create geometry
    const geometry = new THREE.CircleGeometry(radius, 32);
    
    // ENHANCED: More visible material
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5, // Increased from 0.3
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    
    // Create mesh
    const circle = new THREE.Mesh(geometry, material);
    circle.position.set(x, y, z);
    
    // Add to group
    group.add(circle);
    
    return circle;
  },
  
  // Create ripple effect at position
  createRipple: function(x, y) {
    // Convert screen position to scene position using raycasting
    const mouse = new THREE.Vector2(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );
    
    // Setup raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    
    // Create a plane at z=0 to intersect with
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, point);
    
    // Create ripple geometry
    const geometry = new THREE.CircleGeometry(0.1, 32);
    
    // ENHANCED: Brighter ripple material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffffff) },
        uRadius: { value: 0.1 },
        uWidth: { value: 0.05 },
        uAlpha: { value: 1.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uRadius;
        uniform float uWidth;
        uniform float uAlpha;
        
        varying vec2 vUv;
        
        void main() {
          // Calculate distance from center
          vec2 centeredUv = vUv - 0.5;
          float distanceToCenter = length(centeredUv);
          
          // ENHANCED: Create sharper ring shape
          float innerRadius = uRadius - uWidth * 0.5;
          float outerRadius = uRadius + uWidth * 0.5;
          float ring = smoothstep(innerRadius, innerRadius + 0.01, distanceToCenter) * 
                       smoothstep(outerRadius, outerRadius - 0.01, distanceToCenter);
          
          // ENHANCED: Add glow effect around the ring
          float glow = smoothstep(outerRadius + 0.1, outerRadius, distanceToCenter) * 0.5;
          
          // Output final color with glow
          gl_FragColor = vec4(uColor, (ring + glow) * uAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    
    // Create ripple mesh
    const ripple = new THREE.Mesh(geometry, material);
    ripple.position.copy(point);
    ripple.rotation.x = Math.PI / 2; // Lay flat on xz plane
    
    // Add to scene
    this.scene.add(ripple);
    
    // Store ripple data
    const rippleData = {
      mesh: ripple,
      material: material,
      creationTime: this.time.elapsed,
      duration: 3 // Duration in seconds
    };
    
    // Add to ripples array
    this.interaction.ripples.push(rippleData);
    
    return rippleData;
  },
  
  // Update ripple animations
  updateRipples: function() {
    // Loop through all ripples
    for (let i = this.interaction.ripples.length - 1; i >= 0; i--) {
      const ripple = this.interaction.ripples[i];
      
      // Calculate age of ripple
      const age = this.time.elapsed - ripple.creationTime;
      
      // Update ripple properties based on age
      if (age < ripple.duration) {
        // Calculate progress (0 to 1)
        const progress = age / ripple.duration;
        
        // ENHANCED: Larger ripple radius
        const radius = 0.1 + progress * 15; // Increased from 10
        ripple.material.uniforms.uRadius.value = radius;
        
        // ENHANCED: Wider ring
        const width = 0.05 + progress * 0.7; // Increased from 0.5
        ripple.material.uniforms.uWidth.value = width;
        
        // Update alpha
        const alpha = 1 - progress;
        ripple.material.uniforms.uAlpha.value = alpha;
        
        // Update scale
        ripple.mesh.scale.set(1 + progress * 5, 1 + progress * 5, 1);
      } else {
        // Remove ripple if too old
        this.scene.remove(ripple.mesh);
        this.interaction.ripples.splice(i, 1);
      }
    }
  },
  
  // Get a random mandala texture (procedurally generated)
  getRandomMandalaTexture: function() {
    try {
      // ENHANCED: Create higher resolution canvas for more detailed textures
      const canvas = document.createElement('canvas');
      canvas.width = 512; // Increased from 256
      canvas.height = 512; // Increased from 256
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // ENHANCED: Create more detailed mandala pattern
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Increased opacity from 0.1
      
      // Draw circles
      for (let i = 0; i < 5; i++) { // Increased from 3
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40 + i * 35, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw lines
      const lines = 18; // Increased from 12
      for (let i = 0; i < lines; i++) {
        const angle = (Math.PI * 2 / lines) * i;
        const x1 = centerX + Math.cos(angle) * 30;
        const y1 = centerY + Math.sin(angle) * 30;
        const x2 = centerX + Math.cos(angle) * 180; // Increased from 120
        const y2 = centerY + Math.sin(angle) * 180; // Increased from 120
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      // ENHANCED: Draw petal shapes
      for (let i = 0; i < lines/2; i++) {
        const angle = (Math.PI * 2 / (lines/2)) * i;
        const x1 = centerX + Math.cos(angle) * 80;
        const y1 = centerY + Math.sin(angle) * 80;
        
        ctx.beginPath();
        ctx.ellipse(x1, y1, 30, 15, angle, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      
      return texture;
    } catch (error) {
      console.error('Error creating mandala texture:', error);
      // Return a placeholder texture
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 64, 64);
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    }
  },
  
  // Animation loop
  animate: function() {
    // Request next frame
    requestAnimationFrame(() => this.animate());
    
    // Update timing
    this.time.current = this.clock.getElapsedTime();
    this.time.delta = this.time.current - this.time.previous;
    this.time.previous = this.time.current;
    this.time.elapsed += this.time.delta;
    
    // Update material uniforms
    this.updateMaterials();
    
    // Update particle movements
    this.updateParticles();
    
    // Update zen elements
    this.updateZenElements();
    
    // Update ripples
    this.updateRipples();
    
    // Update other effects
    this.updateEffects();
    
    // Render scene
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  },
  
  // Update material uniforms with current time
  updateMaterials: function() {
    // Update portal shader
    if (this.shaders.portal) {
      this.shaders.portal.uniforms.uTime.value = this.time.elapsed;
    }
    
    // Update nebula shader
    if (this.shaders.nebula) {
      this.shaders.nebula.uniforms.uTime.value = this.time.elapsed;
    }
    
    // Update stars shader
    if (this.particles.stars) {
      this.particles.stars.material.uniforms.uTime.value = this.time.elapsed;
    }
    
    // Update energy streams
    this.particles.energyStreams.forEach(stream => {
      stream.material.uniforms.uTime.value = this.time.elapsed;
    });
    
    // Update mandalas
    this.zenElements.mandalas.forEach(mandala => {
      mandala.material.uniforms.uTime.value = this.time.elapsed;
    });
    
    // Update energy centers
    this.zenElements.energyCenters.forEach(center => {
      center.material.uniforms.uTime.value = this.time.elapsed;
    });
    
    // Update portal light
    if (this.portal.light) {
      const intensity = 0.8 + 0.4 * Math.sin(this.time.elapsed * 0.3);
      this.portal.light.intensity = intensity;
    }
  },
  
  // Update particle movements
  updateParticles: function() {
    // Nothing specific needed here as particles are animated in shaders
  },
  
  // Update zen elements animations
  updateZenElements: function() {
    // Update mandalas
    this.zenElements.mandalas.forEach(mandala => {
      const mesh = mandala.mesh;
      const userData = mesh.userData;
      
      // Rotate mandala
      mesh.rotation.z += userData.rotationSpeed * this.time.delta;
      
      // Floating movement
      const floatY = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
      mesh.position.y += (floatY - mesh.position.y) * 0.05;
    });
    
    // Update energy centers
    this.zenElements.energyCenters.forEach(center => {
      const mesh = center.mesh;
      const userData = mesh.userData;
      const originalPos = center.originalPosition;
      
      // Pulsing effect already handled in shader
      
      // ENHANCED: More dramatic floating movement
      const floatY = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
      mesh.position.y = originalPos.y + floatY;
      
      // Update light if present
      if (userData.light) {
        userData.light.position.copy(mesh.position);
        
        // ENHANCED: More dramatic pulsing light intensity
        const pulse = 0.6 + 0.4 * Math.sin(this.time.elapsed * userData.pulseSpeed); // Increased from 0.5 + 0.3
        userData.light.intensity = pulse;
      }
    });
    
    // Update sacred geometry
    this.zenElements.sacredGeometry.forEach(geometry => {
      const mesh = geometry.mesh;
      const userData = mesh.userData;
      
      // ENHANCED: More dynamic rotation
      mesh.rotation.z += userData.rotationSpeed * this.time.delta;
      mesh.rotation.y += userData.rotationSpeed * 0.7 * this.time.delta; // Increased from 0.5
      
      // Floating movement
      const floatY = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
      mesh.position.y = userData.originalY + floatY;
    });
    
    // NEW: Update floating sacred geometry around the book
    this.zenElements.floatingGeometry.forEach(geometry => {
      const mesh = geometry.mesh;
      const userData = mesh.userData;
      const originalPos = userData.originalPosition;
      
      // Different animation based on type
      switch(userData.type) {
        case 'platonic':
          // Complex rotation on all axes
          mesh.rotation.x += userData.rotationSpeed.x * this.time.delta;
          mesh.rotation.y += userData.rotationSpeed.y * this.time.delta;
          mesh.rotation.z += userData.rotationSpeed.z * this.time.delta;
          
          // Orbital movement around the book
          const orbitAngle = this.time.elapsed * userData.orbitSpeed;
          const orbitX = originalPos.x + Math.cos(orbitAngle) * userData.orbitRadius;
          const orbitZ = originalPos.z + Math.sin(orbitAngle) * userData.orbitRadius * 0.5;
          
          mesh.position.x = orbitX;
          mesh.position.z = orbitZ;
          
          // Floating movement
          const floatY = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
          mesh.position.y = originalPos.y + floatY;
          break;
          
        case 'seedOfLife':
          // Gentle rotation
          mesh.rotation.z += userData.rotationSpeed * this.time.delta;
          
          // Pulsing scale effect
          const pulseScale = 1 + Math.sin(this.time.elapsed * userData.pulseSpeed) * 0.1;
          mesh.scale.set(pulseScale, pulseScale, pulseScale);
          
          // Floating movement
          const floatYSeed = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
          mesh.position.y = originalPos.y + floatYSeed;
          break;
          
        case 'vesicaPiscis':
          // Slow rotation
          mesh.rotation.z += userData.rotationSpeed * this.time.delta;
          
          // Scale breathing effect
          const scaleX = 1 + Math.sin(this.time.elapsed * userData.scaleSpeed) * 0.15;
          const scaleY = 1 + Math.sin(this.time.elapsed * userData.scaleSpeed + Math.PI/2) * 0.15;
          mesh.scale.set(scaleX, scaleY, 1);
          
          // Floating movement
          const floatYVesica = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
          mesh.position.y = originalPos.y + floatYVesica;
          break;
          
        case 'merkaba':
          // Complex rotation for star tetrahedron
          mesh.rotation.x += userData.rotationSpeed.x * this.time.delta;
          mesh.rotation.y += userData.rotationSpeed.y * this.time.delta;
          mesh.rotation.z += userData.rotationSpeed.z * this.time.delta;
          
          // Additional spin on its own axis
          mesh.children[0].rotation.y += userData.spinSpeed * this.time.delta;
          mesh.children[1].rotation.y -= userData.spinSpeed * this.time.delta;
          
          // Floating with slight wobble
          const floatYMerkaba = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
          const wobbleX = Math.sin(this.time.elapsed * userData.floatSpeed * 0.7) * 0.5;
          mesh.position.x = originalPos.x + wobbleX;
          mesh.position.y = originalPos.y + floatYMerkaba;
          break;
          
        case 'goldenSpiral':
          // Multi-axis rotation
          mesh.rotation.x += userData.rotationSpeed.x * this.time.delta;
          mesh.rotation.y += userData.rotationSpeed.y * this.time.delta;
          mesh.rotation.z += userData.rotationSpeed.z * this.time.delta;
          
          // Gentle floating
          const floatYSpiral = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
          mesh.position.y = originalPos.y + floatYSpiral;
          break;
      }
    });
  },
  
  // Update other effects (e.g., zen quotes)
  updateEffects: function() {
    // Show zen quotes every 10 seconds
    if (this.time.elapsed - this.time.lastQuoteTime > 10) {
      // Check if a quote is already showing
      if (!document.querySelector('.zen-quote')) {
        this.showZenQuote();
        this.time.lastQuoteTime = this.time.elapsed;
      }
    }
  },
  
  // Show a zen quote
  showZenQuote: function() {
    // Get random quote
    const quote = this.zenQuotes[Math.floor(Math.random() * this.zenQuotes.length)];
    
    // Create quote element
    const quoteElement = document.createElement('div');
    quoteElement.className = 'zen-quote';
    quoteElement.textContent = quote;
    
    // ENHANCED: More visible styling
    quoteElement.style.cssText = `
      position: fixed;
      color: rgba(255, 255, 255, 0);
      font-family: 'Zen Old Mincho', serif;
      font-size: 28px; // Increased from 24px
      text-align: center;
      padding: 20px;
      top: ${30 + Math.random() * 40}%;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      z-index: 100;
      pointer-events: none;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 215, 0, 0.2); // More ghostly glow
      opacity: 0;
      transition: all 3s ease-out;
      filter: blur(2px);
      letter-spacing: 2px;
    `;
    
    // Add to document
    document.body.appendChild(quoteElement);
    
    // Fade in with ghostly effect
    setTimeout(() => {
      quoteElement.style.opacity = '0.7'; // More translucent
      quoteElement.style.color = 'rgba(255, 255, 255, 0.7)'; // More ghostly
      quoteElement.style.transform = 'translateX(-50%) translateY(0)';
      quoteElement.style.filter = 'blur(0px)';
    }, 100);
    
    // Fade out and remove
    setTimeout(() => {
      quoteElement.style.opacity = '0';
      quoteElement.style.color = 'rgba(255, 255, 255, 0)';
      quoteElement.style.transform = 'translateX(-50%) translateY(-20px)';
      quoteElement.style.filter = 'blur(2px)';
      
      // Remove after fade out
      setTimeout(() => {
        if (quoteElement.parentNode) {
          quoteElement.parentNode.removeChild(quoteElement);
        }
      }, 3000);
    }, 10000); // Show for 10 seconds
  }
};
