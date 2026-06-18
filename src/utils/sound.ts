class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  private playBubbleSound(volScale: number = 1.0, pitchScale: number = 1.0) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const time = this.ctx.currentTime;
      const duration = 0.12;

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      
      // Sweep frequency up rapidly for a bubble effect
      osc.frequency.setValueAtTime(400 * pitchScale, time);
      osc.frequency.exponentialRampToValueAtTime(1000 * pitchScale, time + duration);

      // Smooth attack and release
      oscGain.gain.setValueAtTime(0, time);
      oscGain.gain.linearRampToValueAtTime(0.4 * volScale, time + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  playHover() {
    this.playBubbleSound(0.2, 1.2);
  }

  playClick() {
    this.playBubbleSound(0.6, 0.9);
  }

  playType() {
    this.playBubbleSound(0.3, 1.5);
  }

  playWindowOpen() {
    this.playBubbleSound(0.5, 1.2);
  }

  playWindowClose() {
    this.playBubbleSound(0.4, 0.8);
  }

  playLogin() {
    this.playBubbleSound(0.4, 1.0);
    setTimeout(() => this.playBubbleSound(0.5, 1.2), 120);
    setTimeout(() => this.playBubbleSound(0.6, 1.5), 240);
  }
}

export const sounds = new SoundSystem();
