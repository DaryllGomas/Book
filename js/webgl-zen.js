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
    sacredGeometry: []
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
    elapsed: 0
  },
  
  // Configuration
  config: {
    particleCount: {
      stars: 2000,
      energyStream: 500,
      floatingParticles: 300
    },
    colors: {
      background: new THREE.Color(0x050718),
      nebula: {
        primary: new THREE.Color(0x0a0a2a),
        secondary: new THREE.Color(0x1a102a),
        accent: new THREE.Color(0x4a1a4a)
      },
      stars: [
        new THREE.Color(0xffffff),
        new THREE.Color(0xeeeeff),
        new THREE.Color(0xffffee),
        new THREE.Color(0xeeffff)
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
      color: new THREE.Color(0x050718),
      density: 0.0015
    },
    bloom: {
      strength: 1.5,
      radius: 0.75,
      threshold: 0.2
    }
  },
  
  // Shader materials
  shaders: {
    nebula: null,
    energyStream: null,
    mandala: null
  },
  
  // Zen quotes that will appear occasionally
  zenQuotes: [
    "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.",
    "The obstacle is the path.",
    "When you reach the top of the mountain, keep climbing.",
    "The journey of a thousand miles begins with a single step.",
    "If you meet the Buddha on the road, kill him.",
    "When hungry, eat; when tired, sleep.",
    "The quieter you become, the more you can hear.",
    "Zen is not some kind of excitement, but concentration on our usual everyday routine.",
    "No snowflake ever falls in the wrong place.",
    "To follow the path, look to the master, follow the master, walk with the master, see through the master, become the master."
  ],
  
  // Initialize the WebGL scene
  init: function(containerId) {
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
    this.createNebula();
    this.createStars();
    this.createEnergyStreams();
    this.createZenElements();
    
    // Start animation loop
    this.animate();
    
    console.log('WebGL Zen Space initialized');
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
    this.composer.setSize(window.innerWidth, window.innerHeight);
  },
  
  // Handle mouse movement
  onMouseMove: function(event) {
    // Update mouse position for raycasting
    this.interaction.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.interaction.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Slight camera movement based on mouse position
    const camMovementX = this.interaction.mouse.x * 2;
    const camMovementY = this.interaction.mouse.y * 2;
    
    // Smoothly move camera
    gsap.to(this.camera.position, {
      x: camMovementX,
      y: camMovementY,
      duration: 2,
      ease: 'power2.out'
    });
  },
  
  // Handle mouse click
  onMouseClick: function(event) {
    // Create ripple effect at click position
    this.createRipple(event.clientX, event.clientY);
  },
  
  // Create cosmic nebula background
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
        uColorAccent: { value: this.config.colors.nebula.accent }
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
          
          // Create base color from nebula colors
          float nebulaNoise = snoise(vec3(p * 1.5, uTime * 0.05)) * 0.5 + 0.5;
          float nebulaNoiseSmall = snoise(vec3(p * 5.0, uTime * 0.03)) * 0.5 + 0.5;
          
          // Mix colors based on noise
          vec3 color = mix(uColorPrimary, uColorSecondary, nebulaNoise);
          color = mix(color, uColorAccent, nebulaNoiseSmall * 0.3);
          
          // Add some depth with vignette effect
          float vignette = 1.0 - length(p * 0.7);
          vignette = smoothstep(0.0, 1.0, vignette);
          color *= vignette * 1.5;
          
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
      
      // Size - random between 0.1 and 1.0
      sizes[i] = 0.1 + Math.random() * 0.9;
      
      // Color - select from star colors
      const colorIndex = Math.floor(Math.random() * this.config.colors.stars.length);
      const color = this.config.colors.stars[colorIndex];
      colors[i * 3] = color.r;     // r
      colors[i * 3 + 1] = color.g; // g
      colors[i * 3 + 2] = color.b; // b
      
      // Opacity - random between 0.2 and 1.0
      opacities[i] = 0.2 + Math.random() * 0.8;
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
        uSize: { value: 200 }
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
          
          // Add subtle movement to stars
          float angle = uTime * 0.05;
          float amplitude = 0.1;
          modelPosition.x += sin(uTime * 0.1 + position.z * 0.5) * amplitude;
          modelPosition.y += cos(uTime * 0.1 + position.x * 0.5) * amplitude;
          
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;
          
          // Size attenuation - smaller with distance
          gl_PointSize = size * uSize * uPixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          
          // Pass data to fragment shader
          vColor = color;
          
          // Animate opacity based on time for twinkling
          float twinkle = sin(uTime * (1.0 + size) + position.x * 100.0) * 0.5 + 0.5;
          vOpacity = opacity * (0.6 + twinkle * 0.4);
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
          
          // Star glow
          vec3 color = vColor;
          
          // Apply radial fade for glow effect
          float glow = exp(-distanceToCenter * 4.0);
          
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
    // Create 4 energy streams from different directions
    const streamDirections = [
      { x: -40, y: 20, z: -20 },   // Top left
      { x: 40, y: 20, z: -20 },    // Top right
      { x: 40, y: -20, z: -20 },   // Bottom right
      { x: -40, y: -20, z: -20 }   // Bottom left
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
      
      // Add some randomness to spread particles around the path
      const spread = 2 * (1 - Math.pow(t, 0.5)); // More spread at start, less at end
      positions[i * 3] = x + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * spread;
      
      // Random size - smaller near start, larger near end
      sizes[i] = 0.1 + Math.pow(t, 2) * 0.9;
      
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
        uSize: { value: 100 },
        uColor: { value: color },
        uSpeed: { value: 0.2 + Math.random() * 0.1 }
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
          
          // Create soft circle shape
          float strength = smoothstep(0.5, 0.0, distanceToCenter);
          
          // Create tail effect based on progress
          float tail = smoothstep(0.0, 0.8, vProgress) * smoothstep(1.0, 0.8, vProgress);
          
          // Combine for final color
          vec3 color = uColor;
          float alpha = strength * tail;
          
          // Additional glow for head of particle
          float headGlow = smoothstep(0.8, 1.0, vProgress) * 2.0;
          alpha += headGlow * strength * 0.5;
          
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
    // Mandala positions around the scene
    const positions = [
      { x: -30, y: 15, z: -15 },
      { x: 30, y: 20, z: -20 },
      { x: 5, y: -25, z: -10 }
    ];
    
    // Create each mandala
    positions.forEach((position, index) => {
      // Create geometry (simple circle with lots of segments)
      const radius = 2 + Math.random() * 3;
      const geometry = new THREE.CircleGeometry(radius, 32);
      
      // Create shader material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: this.getRandomMandalaTexture() },
          uColor: { value: this.config.colors.energy[index % this.config.colors.energy.length] },
          uOpacity: { value: 0.2 + Math.random() * 0.3 }
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
            
            // Rotate texture coordinates based on time
            float angle = uTime * 0.1;
            vec2 rotatedUv = vec2(
              centeredUv.x * cos(angle) - centeredUv.y * sin(angle),
              centeredUv.x * sin(angle) + centeredUv.y * cos(angle)
            ) + 0.5;
            
            // Sample texture
            vec4 texColor = texture2D(uTexture, rotatedUv);
            
            // Create edge fade
            float fade = smoothstep(1.0, 0.8, distanceToCenter * 2.0);
            
            // Animate opacity
            float pulseOpacity = uOpacity * (0.8 + 0.2 * sin(uTime * 0.2 + distanceToCenter * 10.0));
            
            // Combine for final color
            vec3 color = uColor * texColor.rgb;
            float alpha = texColor.a * fade * pulseOpacity;
            
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
      
      // Store rotation speed for animation
      mandala.userData = {
        rotationSpeed: 0.01 + Math.random() * 0.03,
        floatSpeed: 0.2 + Math.random() * 0.3,
        floatAmplitude: 0.2 + Math.random() * 0.3
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
      
      // Create geometry (sphere for energy center)
      const radius = index === 0 ? 1.5 : 0.5 + Math.random() * 0.5;
      const geometry = new THREE.SphereGeometry(radius, 16, 16);
      
      // Create material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: color },
          uIntensity: { value: index === 0 ? 1.0 : 0.6 + Math.random() * 0.4 }
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
            // Edge glow effect
            float rim = 1.0 - max(0.0, dot(normalize(vNormal), normalize(-vPosition)));
            rim = pow(rim, 2.0) * 2.0;
            
            // Pulse effect
            float pulse = (0.5 + 0.5 * sin(uTime * 0.5)) * uIntensity;
            
            // Combine for final color
            vec3 color = uColor * (1.0 + pulse * 0.5);
            float alpha = rim * (0.6 + pulse * 0.4);
            
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
      
      // Create light for the energy center (only for main/center)
      if (index === 0) {
        const light = new THREE.PointLight(
          color,
          0.5,  // Intensity
          30    // Distance
        );
        light.position.copy(energyCenter.position);
        this.scene.add(light);
        
        // Store light with energy center
        energyCenter.userData = {
          light: light,
          pulseSpeed: 0.5,
          floatSpeed: 0.3,
          floatAmplitude: 0.3
        };
      } else {
        // Store animation data
        energyCenter.userData = {
          pulseSpeed: 0.3 + Math.random() * 0.5,
          floatSpeed: 0.2 + Math.random() * 0.4,
          floatAmplitude: 0.1 + Math.random() * 0.5
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
  },
  
  // Create Flower of Life geometry
  createFlowerOfLife: function() {
    // Position in scene
    const position = { x: -25, y: -15, z: -10 };
    
    // Group to hold all circles
    const flowerGroup = new THREE.Group();
    
    // Parameters
    const radius = 0.8;  // Radius of each circle
    const color = this.config.colors.energy[1]; // Use energy color
    
    // Create center circle
    const center = { x: 0, y: 0 };
    this.createSacredCircle(flowerGroup, center.x, center.y, radius, color);
    
    // Create first ring (6 circles)
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = center.x + radius * 2 * Math.cos(angle);
      const y = center.y + radius * 2 * Math.sin(angle);
      this.createSacredCircle(flowerGroup, x, y, radius, color);
    }
    
    // Position group in scene
    flowerGroup.position.set(position.x, position.y, position.z);
    
    // Add rotation animation
    flowerGroup.userData = {
      rotationSpeed: 0.005,
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
    
    // Parameters
    const radius = 0.4;
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
    
    // Create lines connecting vertices
    const lineMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
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
    
    // Add rotation animation
    cubeGroup.userData = {
      rotationSpeed: 0.01,
      floatSpeed: 0.2,
      floatAmplitude: 0.2,
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
  
  // Helper to create circles for sacred geometry
  createSacredCircle: function(group, x, y, radius, color, z = 0) {
    // Create geometry
    const geometry = new THREE.CircleGeometry(radius, 32);
    
    // Create material
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
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
    
    // Create ripple material
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
          
          // Create ring shape
          float innerRadius = uRadius - uWidth * 0.5;
          float outerRadius = uRadius + uWidth * 0.5;
          float ring = smoothstep(innerRadius, innerRadius + 0.01, distanceToCenter) * 
                       smoothstep(outerRadius, outerRadius - 0.01, distanceToCenter);
          
          // Output final color
          gl_FragColor = vec4(uColor, ring * uAlpha);
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
        
        // Update radius
        const radius = 0.1 + progress * 10;
        ripple.material.uniforms.uRadius.value = radius;
        
        // Update width
        const width = 0.05 + progress * 0.5;
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
      // Create canvas for texture
      const canvas = document.createElement('canvas');
      canvas.width = 256; // Reduced from 512 for better performance
      canvas.height = 256; // Reduced from 512 for better performance
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Create a simpler mandala pattern for better performance
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      
      // Draw circles
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30 + i * 40, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw lines
      const lines = 12;
      for (let i = 0; i < lines; i++) {
        const angle = (Math.PI * 2 / lines) * i;
        const x1 = centerX + Math.cos(angle) * 20;
        const y1 = centerY + Math.sin(angle) * 20;
        const x2 = centerX + Math.cos(angle) * 120;
        const y2 = centerY + Math.sin(angle) * 120;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
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
  
  // These complex mandala drawing functions are removed for better performance
  // and replaced with the simpler mandala pattern in getRandomMandalaTexture

  
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
    this.composer.render();
  },
  
  // Update material uniforms with current time
  updateMaterials: function() {
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
      
      // Floating movement
      const floatY = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
      mesh.position.y = originalPos.y + floatY;
      
      // Update light if present
      if (userData.light) {
        userData.light.position.copy(mesh.position);
        
        // Pulsing light intensity
        const pulse = 0.5 + 0.3 * Math.sin(this.time.elapsed * userData.pulseSpeed);
        userData.light.intensity = pulse;
      }
    });
    
    // Update sacred geometry
    this.zenElements.sacredGeometry.forEach(geometry => {
      const mesh = geometry.mesh;
      const userData = mesh.userData;
      
      // Rotate geometry
      mesh.rotation.z += userData.rotationSpeed * this.time.delta;
      mesh.rotation.y += userData.rotationSpeed * 0.5 * this.time.delta;
      
      // Floating movement
      const floatY = Math.sin(this.time.elapsed * userData.floatSpeed) * userData.floatAmplitude;
      mesh.position.y = userData.originalY + floatY;
    });
  },
  
  // Update other effects (e.g., zen quotes)
  updateEffects: function() {
    // Check if it's time to show a zen quote
    if (Math.random() < 0.0005) { // 0.05% chance per frame
      this.showZenQuote();
    }
  },
  
  // Show a zen quote
  showZenQuote: function() {
    // Check if a quote is already showing
    if (document.querySelector('.zen-quote')) {
      return;
    }
    
    // Get random quote
    const quote = this.zenQuotes[Math.floor(Math.random() * this.zenQuotes.length)];
    
    // Create quote element
    const quoteElement = document.createElement('div');
    quoteElement.className = 'zen-quote';
    quoteElement.textContent = quote;
    
    // Style quote
    quoteElement.style.cssText = `
      position: fixed;
      color: rgba(255, 255, 255, 0);
      font-family: 'Zen Old Mincho', serif;
      font-size: 24px;
      text-align: center;
      padding: 20px;
      top: ${30 + Math.random() * 40}%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      pointer-events: none;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      opacity: 0;
      transition: opacity 4s, color 4s;
    `;
    
    // Add to document
    document.body.appendChild(quoteElement);
    
    // Fade in
    setTimeout(() => {
      quoteElement.style.opacity = '0.8';
      quoteElement.style.color = 'rgba(255, 255, 255, 0.8)';
    }, 100);
    
    // Fade out and remove
    setTimeout(() => {
      quoteElement.style.opacity = '0';
      quoteElement.style.color = 'rgba(255, 255, 255, 0)';
      
      // Remove after fade out
      setTimeout(() => {
        if (quoteElement.parentNode) {
          quoteElement.parentNode.removeChild(quoteElement);
        }
      }, 4000);
    }, 8000);
  }
};
