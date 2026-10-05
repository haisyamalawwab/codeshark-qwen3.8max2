/* Synth SFX ringan berbasis WebAudio — tanpa aset eksternal. */
class SFX {
  enabled = true;
  private ctx: AudioContext | null = null;

  private ensure(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType = "sine",
    vol = 0.12,
    delay = 0,
    slideTo = 0
  ) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo > 0) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  click() { this.tone(720, 0.06, "triangle", 0.1); }
  key(combo: number) { this.tone(460 + Math.min(combo, 40) * 14, 0.05, "square", 0.045); }
  err() { this.tone(160, 0.16, "sawtooth", 0.13, 0, 90); }
  line() { [523, 659, 784].forEach((f, i) => this.tone(f, 0.09, "triangle", 0.11, i * 0.055)); }
  hurt() { this.tone(330, 0.28, "sawtooth", 0.15, 0, 110); }
  count() { this.tone(440, 0.08, "sine", 0.11); }
  go() { this.tone(660, 0.2, "sine", 0.13, 0, 990); }
  win() { [523, 659, 784, 1046, 1318].forEach((f, i) => this.tone(f, 0.15, "triangle", 0.12, i * 0.09)); }
  lose() { [392, 330, 262, 184].forEach((f, i) => this.tone(f, 0.22, "sawtooth", 0.11, i * 0.14)); }
  coin() { this.tone(988, 0.07, "square", 0.08); this.tone(1319, 0.13, "square", 0.08, 0.06); }
  star() { this.tone(1568, 0.12, "triangle", 0.11); }
  quizOk() { this.tone(660, 0.1, "triangle", 0.11); this.tone(880, 0.14, "triangle", 0.11, 0.08); }
}

export const sfx = new SFX();
