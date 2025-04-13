/**
 * Zen Space Audio Implementation
 * Adds ambient sounds and audio reactivity to the zen space
 */

// Add audio initialization method to ZenSpace
ZenSpace.initAudio = function() {
  // Check if audio listener exists
  if (!this.audio.listener) {
    console.error('Audio listener not initialized');
    return false;
  }
  
  // Set audio as initialized
  this.audio.initialized = true;
  this.audio.enabled = true;
  
  // Create audio context
  this.audio.context = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create ambient sound
  this.createAmbientSound();
  
  // Create meditation bell sound
  this.createMeditationBell();
  
  // Create water drop sound
  this.createWaterDrops();
  
  // Schedule occasional bells
  this.scheduleOccasionalBells();
  
  console.log('Zen audio initialized');
  return true;
};

// Create ambient background sound
ZenSpace.createAmbientSound = function() {
  // Create oscillators for ambient drone
  const numOscillators = 5;
  const oscillators = [];
  const gainNodes = [];
  
  for (let i = 0; i < numOscillators; i++) {
    // Create oscillator
    const oscillator = this.audio.context.createOscillator();
    
    // Create gain node for volume control
    const gainNode = this.audio.context.createGain();
    
    // Set very low volume
    gainNode.gain.value = 0.02 + (Math.random() * 0.03);
    
    // Connect oscillator to gain and gain to output
    oscillator.connect(gainNode);
    gainNode.connect(this.audio.context.destination);
    
    // Set oscillator type
    oscillator.type = i % 2 === 0 ? 'sine' : 'triangle';
    
    // Set frequency (low frequencies for ambient drone)
    // Base frequency of 60Hz with harmonic relationships
    const frequencies = [60, 90, 120, 180, 240];
    oscillator.frequency.value = frequencies[i];
    
    // Add slight random detune for richness (-10 to +10 cents)
    oscillator.detune.value = (Math.random() * 20) - 10;
    
    // Store oscillator and gain node
    oscillators.push(oscillator);
    gainNodes.push(gainNode);
    
    // Start oscillator
    oscillator.start();
    
    // Slowly fade in
    gainNode.gain.setValueAtTime(0, this.audio.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.02 + (Math.random() * 0.03), 
      this.audio.context.currentTime + 5 + (Math.random() * 5)
    );
  }
  
  // Store in audio sources
  this.audio.sources.ambient = {
    oscillators: oscillators,
    gainNodes: gainNodes,
    
    // Add method to adjust volume
    setVolume: (volume) => {
      gainNodes.forEach(gain => {
        gain.gain.linearRampToValueAtTime(
          volume * (0.02 + (Math.random() * 0.03)),
          this.audio.context.currentTime + 1
        );
      });
    }
  };
  
  // Set initial volume based on enabled state
  this.audio.sources.ambient.setVolume(this.audio.enabled ? 1 : 0);
  
  // Add slow pulsing to the drone
  this.pulseDrone();
};

// Create slow pulse for drone sound
ZenSpace.pulseDrone = function() {
  if (!this.audio.sources.ambient) return;
  
  const pulseTime = 40 + (Math.random() * 20); // 40-60 seconds per cycle
  const minVol = 0.6;
  const maxVol = 1.0;
  
  // Function to do one pulse cycle
  const doPulse = () => {
    if (!this.audio.enabled) return;
    
    // Fade up
    this.audio.sources.ambient.setVolume(maxVol);
    
    // Schedule fade down in half the cycle time
    setTimeout(() => {
      if (!this.audio.enabled) return;
      this.audio.sources.ambient.setVolume(minVol);
    }, pulseTime * 500);
    
    // Schedule next pulse
    setTimeout(doPulse, pulseTime * 1000);
  };
  
  // Start first pulse
  setTimeout(doPulse, pulseTime * 1000);
};

// Create meditation bell sound
ZenSpace.createMeditationBell = function() {
  // Create a buffer for the bell sound
  const createBell = () => {
    // Create buffer for 5 seconds of audio
    const duration = 5;
    const sampleRate = this.audio.context.sampleRate;
    const buffer = this.audio.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    // Fill buffer with bell sound
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      // Bell frequencies (harmonics)
      const frequencies = [329.63, 659.26, 984.33, 1318.51, 1567.98];
      const amplitudes = [0.5, 0.4, 0.3, 0.2, 0.1];
      
      // Fill with silence first
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = 0;
      }
      
      // Add bell harmonics
      for (let h = 0; h < frequencies.length; h++) {
        const frequency = frequencies[h];
        const amplitude = amplitudes[h];
        
        // Calculate samples per cycle
        const samplesPerCycle = sampleRate / frequency;
        
        for (let i = 0; i < channelData.length; i++) {
          // Calculate amplitude with exponential decay
          const decay = Math.exp(-i / (sampleRate * (0.5 + h * 0.3)));
          
          // Add sine wave with decay
          channelData[i] += amplitude * decay * Math.sin(2 * Math.PI * i / samplesPerCycle);
        }
      }
      
      // Add subtle noise for texture in the first 50ms
      for (let i = 0; i < sampleRate * 0.05; i++) {
        const noise = (Math.random() * 2 - 1) * 0.05;
        const decay = Math.exp(-i / (sampleRate * 0.01));
        channelData[i] += noise * decay;
      }
    }
    
    return buffer;
  };
  
  // Create and store bell buffer
  this.audio.sources.bell = {
    buffer: createBell(),
    
    // Method to play the bell
    play: (volume = 0.2) => {
      if (!this.audio.enabled) return;
      
      // Create buffer source
      const source = this.audio.context.createBufferSource();
      source.buffer = this.audio.sources.bell.buffer;
      
      // Create gain node
      const gainNode = this.audio.context.createGain();
      gainNode.gain.value = volume;
      
      // Connect
      source.connect(gainNode);
      gainNode.connect(this.audio.context.destination);
      
      // Play
      source.start();
      
      // Return source for potential control
      return source;
    }
  };
};

// Create water drop sounds
ZenSpace.createWaterDrops = function() {
  // Create a buffer for the water drop sound
  const createDrop = () => {
    // Create buffer for 1 second of audio
    const duration = 1;
    const sampleRate = this.audio.context.sampleRate;
    const buffer = this.audio.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    // Fill buffer with water drop sound
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      // Base frequency
      const frequency = 1200 + Math.random() * 1200; // 1200-2400 Hz
      
      // Calculate samples per cycle
      const samplesPerCycle = sampleRate / frequency;
      
      // Create drop sound
      for (let i = 0; i < channelData.length; i++) {
        // Frequency drop over time (water drop effect)
        const freqDrop = Math.max(0.5, 1 - i / (sampleRate * 0.15));
        const adjustedSamplesPerCycle = samplesPerCycle / freqDrop;
        
        // Amplitude envelope - fast attack, medium decay
        const attack = Math.min(1, i / (sampleRate * 0.002));
        const decay = Math.exp(-i / (sampleRate * 0.05));
        const amplitude = attack * decay * 0.5;
        
        // Add sine wave
        channelData[i] = amplitude * Math.sin(2 * Math.PI * i / adjustedSamplesPerCycle);
      }
    }
    
    return buffer;
  };
  
  // Create and store drop buffers (several variations)
  this.audio.sources.drops = [];
  
  // Create 5 different drop sounds
  for (let i = 0; i < 5; i++) {
    this.audio.sources.drops.push({
      buffer: createDrop(),
      
      // Method to play the drop
      play: (volume = 0.15) => {
        if (!this.audio.enabled) return;
        
        // Create buffer source
        const source = this.audio.context.createBufferSource();
        source.buffer = this.audio.sources.drops[i].buffer;
        
        // Create gain node
        const gainNode = this.audio.context.createGain();
        gainNode.gain.value = volume;
        
        // Add slight random pitch shift
        source.detune.value = (Math.random() * 400) - 200; // -200 to +200 cents
        
        // Connect
        source.connect(gainNode);
        gainNode.connect(this.audio.context.destination);
        
        // Play
        source.start();
        
        // Return source for potential control
        return source;
      }
    });
  }
  
  // Schedule random water drops
  this.scheduleWaterDrops();
};

// Schedule random water drops
ZenSpace.scheduleWaterDrops = function() {
  const scheduleNextDrop = () => {
    if (!this.audio.enabled) {
      // Try again later if audio is disabled
      setTimeout(scheduleNextDrop, 10000);
      return;
    }
    
    // Random delay between drops (3-15 seconds)
    const delay = 3000 + Math.random() * 12000;
    
    setTimeout(() => {
      // Play random drop sound
      const dropIndex = Math.floor(Math.random() * this.audio.sources.drops.length);
      const volume = 0.05 + Math.random() * 0.1; // Random volume
      
      this.audio.sources.drops[dropIndex].play(volume);
      
      // Schedule next drop
      scheduleNextDrop();
    }, delay);
  };
  
  // Start scheduling
  scheduleNextDrop();
};

// Schedule occasional meditation bells
ZenSpace.scheduleOccasionalBells = function() {
  const scheduleNextBell = () => {
    if (!this.audio.enabled) {
      // Try again later if audio is disabled
      setTimeout(scheduleNextBell, 30000);
      return;
    }
    
    // Random delay between bells (30-120 seconds)
    const delay = 30000 + Math.random() * 90000;
    
    setTimeout(() => {
      // Play bell sound
      const volume = 0.1 + Math.random() * 0.1; // Random volume
      
      this.audio.sources.bell.play(volume);
      
      // Schedule next bell
      scheduleNextBell();
    }, delay);
  };
  
  // Start scheduling with initial delay (start after 20-40 seconds)
  setTimeout(scheduleNextBell, 20000 + Math.random() * 20000);
};

// Add audio update method to be called in animation loop
ZenSpace.updateAudio = function() {
  // Skip if audio not initialized or enabled
  if (!this.audio.initialized || !this.audio.enabled) return;
  
  // Update audio parameters based on scene state
  
  // Volume linked to breathing effect
  if (this.audio.sources.ambient) {
    // Subtle volume changes based on cosmic breathing
    const breathCycle = Math.sin(this.time.elapsed * 0.1) * 0.5 + 0.5;
    const volumeRange = 0.02; // Small range of change
    
    // Apply to ambient drone
    this.audio.sources.ambient.gainNodes.forEach(gain => {
      const baseVolume = parseFloat(gain.userData?.baseVolume || 0.02);
      gain.gain.value = baseVolume + breathCycle * volumeRange;
    });
  }
};

// Add audio control methods for various interactions

// Play energy pulse sound when energy centers pulse
ZenSpace.playEnergyPulse = function() {
  if (!this.audio.enabled || !this.audio.initialized) return;
  
  // Create oscillator for pulse
  const oscillator = this.audio.context.createOscillator();
  const gainNode = this.audio.context.createGain();
  
  // Set oscillator properties
  oscillator.type = 'sine';
  oscillator.frequency.value = 200 + Math.random() * 100;
  
  // Set gain to create pulse shape
  gainNode.gain.value = 0;
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(this.audio.context.destination);
  
  // Start oscillator
  oscillator.start();
  
  // Create pulse envelope
  gainNode.gain.setValueAtTime(0, this.audio.context.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, this.audio.context.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, this.audio.context.currentTime + 0.5);
  
  // Stop oscillator after pulse
  oscillator.stop(this.audio.context.currentTime + 0.5);
};

// Play interaction sound for ripple effect
ZenSpace.playRippleSound = function() {
  if (!this.audio.enabled || !this.audio.initialized) return;
  
  // Create oscillator for ripple
  const oscillator = this.audio.context.createOscillator();
  const gainNode = this.audio.context.createGain();
  
  // Set oscillator properties
  oscillator.type = 'sine';
  oscillator.frequency.value = 300;
  
  // Frequency drop for ripple effect
  oscillator.frequency.setValueAtTime(300, this.audio.context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, this.audio.context.currentTime + 0.5);
  
  // Set gain to create ripple shape
  gainNode.gain.value = 0;
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(this.audio.context.destination);
  
  // Start oscillator
  oscillator.start();
  
  // Create ripple envelope
  gainNode.gain.setValueAtTime(0, this.audio.context.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.08, this.audio.context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, this.audio.context.currentTime + 0.8);
  
  // Stop oscillator after pulse
  oscillator.stop(this.audio.context.currentTime + 0.8);
};

// Hook into onMouseClick to play ripple sound
const originalOnMouseClick = ZenSpace.onMouseClick;
ZenSpace.onMouseClick = function(event) {
  // Call original function
  originalOnMouseClick.call(this, event);
  
  // Play ripple sound
  this.playRippleSound();
};

// Add audio update to animation loop
const originalAnimate = ZenSpace.animate;
ZenSpace.animate = function() {
  // Call original animate
  originalAnimate.call(this);
  
  // Update audio
  this.updateAudio();
};
