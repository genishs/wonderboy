/**
 * Agent 6 (Audio & FX Manager) owns this file.
 *
 * Current state: procedural Web Audio API tones (no external files needed).
 * Replace _playBGMLoop() with actual audio file playback once assets/audio/ is populated.
 *
 * BGM loop point reference for audio files (frames @ 60fps):
 *   area1: intro=0–96, loop=96–end
 *   (Agent 6: document loop points for areas 2–7 here)
 */

export class AudioManager {
    constructor() {
        this._ctx          = null;
        this._bgmGain      = null;
        this._sfxGain      = null;
        this._masterGain   = null;
        this._bgmName      = null;
        this._bgmTimeout   = null;
        this._warnInterval = null;
        this._warnActive   = false;
        this.initialized   = false;
    }

    async init() {
        if (this.initialized) return;
        this._ctx        = new (window.AudioContext || window.webkitAudioContext)();
        this._masterGain = this._makeGain(0.70);
        this._masterGain.connect(this._ctx.destination);
        this._bgmGain  = this._makeGain(0.45);
        this._bgmGain.connect(this._masterGain);
        this._sfxGain  = this._makeGain(0.80);
        this._sfxGain.connect(this._masterGain);
        this.initialized = true;
    }

    // ── BGM ────────────────────────────────────────────────────────────────
    playBGM(name) {
        if (!this.initialized || this._bgmName === name) return;
        this.stopBGM();
        this._bgmName = name;
        this._playBGMLoop(name);
    }

    stopBGM() {
        clearTimeout(this._bgmTimeout);
        this._bgmName = null;
    }

    _playBGMLoop(name) {
        // Procedural 8-bit style theme
        // Agent 6: replace with AudioBuffer from assets/audio/bgm/{name}.ogg
        const themes = {
            area1: [
                [330,0.10],[392,0.10],[440,0.10],[494,0.10],
                [523,0.20],[494,0.10],[440,0.10],[392,0.10],
                [330,0.20],[294,0.10],[330,0.10],[392,0.20],
                [440,0.10],[494,0.10],[523,0.10],[587,0.10],
                [659,0.30],[587,0.10],[523,0.10],[494,0.10],
                [440,0.40],
            ],
        };
        const seq = themes[name] ?? themes['area1'];
        let t = this._ctx.currentTime;
        let total = 0;
        for (const [freq, dur] of seq) {
            this._note(freq, dur, t, 'square', this._bgmGain);
            t     += dur;
            total += dur;
        }
        this._bgmTimeout = setTimeout(() => {
            if (this._bgmName === name) this._playBGMLoop(name);
        }, total * 1000 - 30);
    }

    // ── SFX ────────────────────────────────────────────────────────────────
    /**
     * @param {'jump'|'axe'|'collect'|'hurt'|'stomp'|'skateboard_break'|'warning'} name
     */
    playSFX(name) {
        if (!this.initialized) return;
        const now = this._ctx.currentTime;
        switch (name) {
            case 'jump':            this._note(880, 0.08, now, 'square',   this._sfxGain); break;
            case 'axe':             this._note(660, 0.07, now, 'sawtooth', this._sfxGain); break;
            case 'stomp':           this._note(440, 0.06, now, 'square',   this._sfxGain); break;
            case 'hurt':            this._note(110, 0.25, now, 'sawtooth', this._sfxGain); break;
            case 'skateboard_break':this._note(220, 0.20, now, 'square',   this._sfxGain); break;
            case 'warning':         this._note(987, 0.05, now, 'square',   this._sfxGain); break;
            case 'collect':
                this._note(523, 0.05, now,       'sine', this._sfxGain);
                this._note(659, 0.05, now + 0.05,'sine', this._sfxGain);
                this._note(784, 0.08, now + 0.10,'sine', this._sfxGain);
                break;
        }
    }

    // ── Per-frame update ───────────────────────────────────────────────────
    update(dt, state) {
        if (!this.initialized) return;

        const lowHunger = state.hunger < 25 && state.gameState === 'PLAYING';
        if (lowHunger && !this._warnActive) {
            this._warnActive   = true;
            this._warnInterval = setInterval(() => {
                if (!this._warnActive) { clearInterval(this._warnInterval); return; }
                this.playSFX('warning');
            }, 800);
        } else if (!lowHunger && this._warnActive) {
            this._warnActive = false;
            clearInterval(this._warnInterval);
        }
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    _makeGain(value) {
        const g = this._ctx.createGain();
        g.gain.value = value;
        return g;
    }

    _note(freq, dur, start, type, dest) {
        const osc  = this._ctx.createOscillator();
        const gain = this._ctx.createGain();
        osc.type            = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(start);
        osc.stop(start + dur + 0.01);
    }

    setMasterVolume(v) {
        if (this._masterGain) this._masterGain.gain.value = Math.max(0, Math.min(1, v));
    }
}
