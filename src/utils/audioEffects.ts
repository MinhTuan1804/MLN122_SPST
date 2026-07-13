let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playHoverSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Soft mechanical tick
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);

    gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  } catch (error) {
    // Silent fail if audio context is blocked
  }
};

export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Satisfying copper mechanical click (dual oscillator)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1100, now);
    osc1.frequency.exponentialRampToValueAtTime(550, now + 0.06);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1600, now);
    osc2.frequency.exponentialRampToValueAtTime(250, now + 0.06);

    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.06);
    osc2.stop(now + 0.08);
  } catch (error) {
    // Silent fail
  }
};

export const playCoinSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2500, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    
    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {}
};

export const playHammerSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    
    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {}
};
