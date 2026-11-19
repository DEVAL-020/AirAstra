// Web Audio API Synthesizer for AirAstra (no external assets required)

class SoundFX {
  private ctx: AudioContext | null = null;
  private ambientNoiseNode: AudioNode | null = null;
  private isAmbientPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  // Play pleasant positive chime (on completing eco action or routine step)
  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Chime chord: E5 (659.25Hz) and B5 (987.77Hz)
      osc1.frequency.setValueAtTime(659.25, now);
      osc2.frequency.setValueAtTime(987.77, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch {
      // Audio autoplay policy catch
    }
  }

  // Play subtle warning tone (emergency smog threshold)
  playWarning() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  // Toggle relaxing HEPA filter air-flow ambient sound (soft pink noise)
  toggleHepaHum(on?: boolean): boolean {
    try {
      this.initCtx();
      if (!this.ctx) return false;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (this.isAmbientPlaying || on === false) {
        if (this.ambientNoiseNode) {
          this.ambientNoiseNode.disconnect();
          this.ambientNoiseNode = null;
        }
        this.isAmbientPlaying = false;
        return false;
      }

      // Generate brown/pink noise buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to simulate smooth muffled airflow
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.045, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.ambientNoiseNode = gain;
      this.isAmbientPlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  isPlayingAmbient(): boolean {
    return this.isAmbientPlaying;
  }
}

export const soundFX = new SoundFX();
