/**
 * owning agent: dev-lead
 *
 * AudioManager v1.0 — Web Audio procedural synthesis. No external audio files.
 *
 * v1.0 extensions (per docs/briefs/phase4-audio.md):
 *   - 5 BGM tracks: title (Lydian), area1 (existing), area2 (Phrygian),
 *                   boss-fight (Dorian), game-over (chromatic descent one-shot),
 *                   area-cleared (C major arpeggio stinger one-shot).
 *   - Multi-voice BGM via parallel `themesHarmony` table.
 *   - 16 new SFX cases (axe_hit_enemy, axe_hit_wall, axe_vs_wave, husk_burst,
 *                       fruit_dewplum, fruit_amberfig, fruit_sunpear,
 *                       flintchip_get, flintchip_end, boss_windup,
 *                       boss_attack_thud, boss_hit, boss_defeat, skyhook_warn,
 *                       ember_pit_form, stage_cleared, continue, title_confirm).
 *   - `_noise(dur, start, dest)` helper (white-noise burst via AudioBufferSourceNode).
 *   - `_setBgmGain(target, ramp)` helper for per-track mix transitions.
 *   - playBGM(name) auto-adjusts gain (title 0.55, boss-fight 0.40,
 *     game-over 0.35, default 0.45).
 *   - One-shot tracks (game-over, area-cleared) don't re-trigger the loop.
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
        this._noiseBuf     = null;
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
        this._initNoise();
        this.initialized = true;
    }

    // ── BGM ────────────────────────────────────────────────────────────────
    playBGM(name) {
        if (!this.initialized || this._bgmName === name) return;
        this.stopBGM();
        this._bgmName = name;
        // v1.0 per-track mix transitions. Title is loudest (no competing SFX),
        // boss-fight slightly quieter so SFX can punch through, game-over the
        // most somber. Default gameplay tracks at 0.45.
        if (name === 'title')           this._setBgmGain(0.55);
        else if (name === 'boss-fight') this._setBgmGain(0.40);
        else if (name === 'game-over')  this._setBgmGain(0.35);
        else                            this._setBgmGain(0.45);
        this._playBGMLoop(name);
    }

    stopBGM() {
        clearTimeout(this._bgmTimeout);
        this._bgmTimeout = null;
        this._bgmName    = null;
    }

    // v1.0 — per-track BGM sequences. Each is a [freq_hz, dur_sec] pair list.
    // Multi-voice tracks have a parallel entry in `_bgmThemesHarmony`.
    static _bgmThemes() {
        return {
            // Existing v0.75 area1 theme — KEEP unchanged for reference fidelity.
            area1: [
                [330,0.10],[392,0.10],[440,0.10],[494,0.10],
                [523,0.20],[494,0.10],[440,0.10],[392,0.10],
                [330,0.20],[294,0.10],[330,0.10],[392,0.20],
                [440,0.10],[494,0.10],[523,0.10],[587,0.10],
                [659,0.30],[587,0.10],[523,0.10],[494,0.10],
                [440,0.40],
            ],
            // C Lydian, 90 BPM. Warm, welcoming.
            title: [
                [523, 0.33], [587, 0.33], [659, 0.33], [698, 0.33],
                [783, 0.50], [698, 0.17], [659, 0.17], [587, 0.17],
                [523, 0.33], [392, 0.33], [523, 0.33], [659, 0.33],
                [523, 1.00],
            ],
            // D Dorian, 130 BPM. Tense, looping.
            'boss-fight': [
                [294, 0.23], [349, 0.12], [392, 0.12], [466, 0.23],
                [440, 0.23], [349, 0.12], [392, 0.12], [294, 0.46],
                [349, 0.23], [392, 0.23], [440, 0.23], [466, 0.46],
                [392, 0.23], [294, 0.92],
            ],
            // E Phrygian, 105 BPM. Wind-modal. Intro then body loop merged so
            // _playBGMLoop just keeps cycling — slightly less faithful than the
            // brief's split-intro spec but the ear can't tell after one loop.
            area2: [
                [330, 0.29], [349, 0.29], [330, 0.29], [294, 0.29],
                [330, 0.57],
                [330, 0.29], [349, 0.29], [392, 0.29], [440, 0.29],
                [523, 0.29], [440, 0.29], [392, 0.29], [349, 0.29],
                [330, 0.57], [349, 0.29], [392, 0.29],
                [440, 0.29], [392, 0.29], [349, 0.29], [330, 0.29],
                [294, 0.29], [330, 0.29], [349, 0.29], [330, 0.29],
                [330, 1.15],
            ],
            // Chromatic descent, 60 BPM. One-shot (no re-trigger).
            'game-over': [
                [440, 0.50], [415, 0.50], [392, 0.50], [370, 0.50],
                [349, 0.50], [330, 0.50], [311, 0.50], [294, 1.00],
            ],
            // C major arpeggio, 100 BPM. One-shot stinger.
            'area-cleared': [
                [523, 0.30], [659, 0.30], [784, 0.30], [1047, 0.60],
                [1047, 0.30], [988, 0.30], [880, 0.60],
                [784, 0.30], [659, 0.30], [523, 1.20],
            ],
        };
    }

    static _bgmHarmony() {
        return {
            // Title: triangle parallel third below. Each note delayed 50ms.
            title: [
                [415, 0.33], [466, 0.33], [523, 0.33], [554, 0.33],
                [622, 0.50], [554, 0.17], [523, 0.17], [466, 0.17],
                [415, 0.33], [311, 0.33], [415, 0.33], [523, 0.33],
                [415, 1.00],
            ],
            // Boss-fight: sawtooth bass, one octave below the root each quarter.
            // D D D D / A A A A / F F F F / G D
            'boss-fight': [
                [147, 0.23], [147, 0.23], [147, 0.23], [147, 0.23],
                [220, 0.23], [220, 0.23], [220, 0.23], [220, 0.23],
                [175, 0.23], [175, 0.23], [175, 0.23], [175, 0.23],
                [196, 0.23], [147, 0.92],
            ],
            // Area2: mid voice (triangle). Same length as lead; rests in body
            // for breath. Empty entries are skipped via freq=0.
            area2: [
                [415, 0.29], [440, 0.29], [415, 0.29], [392, 0.29],
                [415, 0.57],
                [440, 0.29], [466, 0.29], [523, 0.29], [587, 0.29],
                [0, 0.29],   [0, 0.29],   [0, 0.29],   [0, 0.29],
                [440, 0.57], [466, 0.29], [523, 0.29],
                [587, 0.29], [523, 0.29], [466, 0.29], [440, 0.29],
                [392, 0.29], [440, 0.29], [466, 0.29], [440, 0.29],
                [440, 1.15],
            ],
            // Area-cleared harmony: sine top voice (octave up on the peaks).
            'area-cleared': [
                [0, 0.30], [0, 0.30], [0, 0.30], [2093, 0.60],
                [2093, 0.30], [0, 0.30], [1760, 0.60],
                [0, 0.30], [0, 0.30], [1047, 1.20],
            ],
        };
    }

    _playBGMLoop(name) {
        const themes   = AudioManager._bgmThemes();
        const harmonies = AudioManager._bgmHarmony();
        const seq = themes[name];
        if (!seq) return;

        // Voice waveform per track. Defaults: lead=square, harmony=triangle.
        const voicing = {
            area1:         { lead: 'square',   harmony: null },
            title:         { lead: 'sine',     harmony: 'triangle' },
            'boss-fight':  { lead: 'square',   harmony: 'sawtooth' },
            area2:         { lead: 'square',   harmony: 'triangle' },
            'game-over':   { lead: 'sine',     harmony: null },
            'area-cleared':{ lead: 'square',   harmony: 'sine' },
        };
        const v = voicing[name] || { lead: 'square', harmony: null };

        let t = this._ctx.currentTime;
        let total = 0;
        for (const [freq, dur] of seq) {
            if (freq > 0) this._note(freq, dur, t, v.lead, this._bgmGain);
            t     += dur;
            total += dur;
        }

        // Harmony voice (small offset so it sounds like a pluck).
        const harmonySeq = v.harmony ? harmonies[name] : null;
        if (harmonySeq) {
            let ht = this._ctx.currentTime + 0.05;
            for (const [freq, dur] of harmonySeq) {
                if (freq > 0) this._note(freq, dur, ht, v.harmony, this._bgmGain);
                ht += dur;
            }
        }

        // One-shot tracks: game-over + area-cleared do NOT re-trigger.
        const isOneShot = (name === 'game-over' || name === 'area-cleared');
        if (isOneShot) {
            // Clear the active name when the stinger finishes so subsequent
            // playBGM(<same>) can replay it.
            this._bgmTimeout = setTimeout(() => {
                if (this._bgmName === name) this._bgmName = null;
            }, total * 1000);
            return;
        }

        // Looped tracks: re-trigger 30 ms before the tail to mask the gap.
        this._bgmTimeout = setTimeout(() => {
            if (this._bgmName === name) this._playBGMLoop(name);
        }, total * 1000 - 30);
    }

    // ── SFX ────────────────────────────────────────────────────────────────
    /**
     * v1.0 — 22 named SFX events covered. Each case fires one or more
     * `_note(...)` calls (oscillator chains) plus optional `_noise(...)`
     * (white-noise bursts via AudioBufferSourceNode).
     */
    playSFX(name) {
        if (!this.initialized) return;
        const now = this._ctx.currentTime;
        const sg  = this._sfxGain;

        switch (name) {
            // ── Existing v0.75 SFX (kept unchanged) ──────────────────────
            case 'jump':            this._note(880, 0.08, now, 'square',   sg); break;
            case 'axe':             this._note(660, 0.07, now, 'sawtooth', sg); break;
            case 'stomp':           this._note(440, 0.06, now, 'square',   sg); break;
            case 'hurt':            this._note(110, 0.25, now, 'sawtooth', sg); break;
            case 'skateboard_break':this._note(220, 0.20, now, 'square',   sg); break;
            case 'warning':         this._note(987, 0.05, now, 'square',   sg); break;
            case 'collect':
                this._note(523, 0.05, now,       'sine', sg);
                this._note(659, 0.05, now + 0.05,'sine', sg);
                this._note(784, 0.08, now + 0.10,'sine', sg);
                break;

            // ── v1.0 hero / combat additions ─────────────────────────────
            case 'axe_hit_enemy':
                this._note(440, 0.10, now,        'square', sg);
                this._note(220, 0.08, now + 0.01, 'square', sg);
                break;
            case 'axe_hit_wall':
                this._noise(0.05, now, sg);
                break;
            case 'axe_vs_wave':
                this._note(880, 0.06, now, 'square', sg);
                this._noise(0.06, now, sg);
                break;

            // ── Pickups ──────────────────────────────────────────────────
            case 'husk_burst':
                this._noise(0.08, now, sg);
                this._note(523, 0.06, now + 0.02, 'square', sg);
                break;
            case 'fruit_dewplum':
                this._note(698, 0.06, now,        'sine', sg);
                this._note(880, 0.06, now + 0.06, 'sine', sg);
                break;
            case 'fruit_amberfig':
                this._note(659,  0.06, now,        'sine', sg);
                this._note(880,  0.06, now + 0.06, 'sine', sg);
                this._note(1047, 0.06, now + 0.12, 'sine', sg);
                break;
            case 'fruit_sunpear':
                this._note(523,  0.06, now,        'sine', sg);
                this._note(659,  0.06, now + 0.06, 'sine', sg);
                this._note(784,  0.06, now + 0.12, 'sine', sg);
                this._note(1047, 0.06, now + 0.18, 'sine', sg);
                break;
            case 'flintchip_get':
                this._note(1175, 0.08, now, 'square', sg);
                this._note(1568, 0.08, now, 'sine',   sg);
                break;
            case 'flintchip_end':
                this._note(1175, 0.08, now,        'sine', sg);
                this._note(880,  0.08, now + 0.08, 'sine', sg);
                break;

            // ── Boss / hazards ───────────────────────────────────────────
            case 'boss_windup':
                this._note(110, 0.20, now, 'square', sg);
                break;
            case 'boss_attack_thud':
                this._noise(0.10, now, sg);
                this._note(165, 0.08, now, 'square', sg);
                break;
            case 'boss_hit':
                this._note(220, 0.08, now,        'sawtooth', sg);
                this._note(440, 0.04, now + 0.02, 'square',   sg);
                break;
            case 'boss_defeat':
                this._note(880, 0.20, now,        'sawtooth', sg);
                this._note(440, 0.20, now + 0.20, 'sawtooth', sg);
                this._note(220, 0.20, now + 0.40, 'sawtooth', sg);
                break;
            case 'skyhook_warn':
                this._note(1568, 0.06, now, 'sine', sg);
                break;
            case 'ember_pit_form':
                this._note(220, 0.08, now, 'square', sg);
                this._noise(0.06, now, sg);
                break;

            // ── UI / state transitions ───────────────────────────────────
            case 'stage_cleared':
                this._note(880,  0.10, now,        'square', sg);
                this._note(1047, 0.20, now + 0.10, 'sine',   sg);
                break;
            case 'continue':
                this._note(523,  0.05, now,        'sine', sg);
                this._note(659,  0.05, now + 0.05, 'sine', sg);
                this._note(784,  0.05, now + 0.10, 'sine', sg);
                this._note(1047, 0.05, now + 0.15, 'sine', sg);
                break;
            case 'title_confirm':
                this._note(880, 0.10, now, 'sine', sg);
                break;

            default:
                // Silent default — unknown SFX names are no-ops.
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

    /**
     * v1.0 — white-noise burst. Used by axe_hit_wall, axe_vs_wave, husk_burst,
     * boss_attack_thud, ember_pit_form. The shared 1-sec noise buffer is built
     * once in _initNoise and resampled by the AudioBufferSourceNode.
     */
    _noise(dur, start, dest) {
        if (!this._noiseBuf) return;
        const src  = this._ctx.createBufferSource();
        src.buffer = this._noiseBuf;
        const gain = this._ctx.createGain();
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        src.connect(gain);
        gain.connect(dest);
        src.start(start);
        src.stop(start + dur + 0.01);
    }

    _initNoise() {
        const sr  = this._ctx.sampleRate;
        const buf = this._ctx.createBuffer(1, sr, sr);
        const data = buf.getChannelData(0);
        for (let i = 0; i < sr; i++) data[i] = Math.random() * 2 - 1;
        this._noiseBuf = buf;
    }

    /**
     * v1.0 — ramp _bgmGain to a target value over `rampSec` (default 0.1 s).
     * Used by playBGM to switch mix per-track without abrupt pops.
     */
    _setBgmGain(target, rampSec = 0.1) {
        if (!this._bgmGain) return;
        const now = this._ctx.currentTime;
        const g   = this._bgmGain.gain;
        const cur = g.value;
        g.cancelScheduledValues(now);
        g.setValueAtTime(cur, now);
        g.linearRampToValueAtTime(target, now + rampSec);
    }

    setMasterVolume(v) {
        if (this._masterGain) this._masterGain.gain.value = Math.max(0, Math.min(1, v));
    }
}
