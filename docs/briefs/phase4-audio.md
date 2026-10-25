# Phase 4 — Audio brief: Web Audio synthesis (v1.0)

> **Authoring agent:** story-lead
> **Consumers:** dev-lead (primary), design-lead (informational, for sigil-flash sync hints)
> **Reviewer:** release-master
> **Companion docs:** `docs/briefs/phase4-area2-cast.md`, `src/audio/AudioManager.js`
> **한국어 버전:** [phase4-audio.ko.md](./phase4-audio.ko.md)

This brief is the **complete Web Audio API procedural synthesis spec for v1.0**. There are zero binary audio assets; everything is generated in code via `AudioContext`, `OscillatorNode`, and `GainNode` chains. The existing `src/audio/AudioManager.js` (Phase 1 procedural scaffold) is extended with **5 BGM tracks**, **~22 SFX events**, and a wiring map indicating which source file fires each event.

> **IP safety.** No copyrighted melodies are reproduced. Each BGM track is specified by mode + tempo + voicing + bar-structure; the actual note sequences are coined for this project. SFX are pure-synth percussion / pluck / noise — no sampled audio.

---

## 1. BGM tracks

5 named tracks. All loop-able (game-over is one-shot that fades to silence). All built from `OscillatorNode` chains routed through `_bgmGain` (default 0.45). Per-track voicing and mode are listed below; dev-lead implements via the existing `_playBGMLoop(name)` pattern.

### 1.1 `area1` — already shipped (reference)

For reference, the v0.75 implementation:
- Mode: A minor pentatonic (approximate)
- Tempo: implicit ~120 BPM from `[freq, dur]` list
- Voicing: single square-wave oscillator
- Loop: one ~3.2 sec pass, re-trigger 30 ms early to mask the gap

We **keep `area1` as-is** for v1.0. The new tracks below mirror its data structure (`[freq_hz, duration_sec]` arrays per voice).

### 1.2 `title` — Lydian, warm

- **Mode:** C Lydian (C D E F# G A B)
- **Tempo:** 90 BPM → eighth-note ≈ 0.167 sec, quarter ≈ 0.333 sec
- **Voicing:** lead = `sine`, harmony = `triangle` (warmer than square)
- **Bar structure:** 8 bars, 4/4. Bars 1-4 = "ascending welcome" (kettle-warm), bars 5-8 = "settle on the tonic."
- **Loop tail:** 30 ms re-trigger lead time (same as area1).
- **Mix hint:** during title, BGM gain bumps to 0.55 (slight louder than gameplay) — title screen has no SFX competing.

**Reference sequence (lead voice, ~5.3 sec):**
```
[523, 0.33], [587, 0.33], [659, 0.33], [698, 0.33],   // C-D-E-F# ascending
[783, 0.50], [698, 0.17], [659, 0.17], [587, 0.17],   // G-F#-E-D
[523, 0.33], [392, 0.33], [523, 0.33], [659, 0.33],   // C-G-C-E
[523, 1.00],                                           // C hold
```
Harmony voice (triangle, parallel third below): start each note 0.05 sec later for a soft pluck.

### 1.3 `boss-fight` — Dorian, tense

- **Mode:** D Dorian (D E F G A B C)
- **Tempo:** 130 BPM → eighth ≈ 0.115 sec, quarter ≈ 0.231 sec
- **Voicing:** lead = `square`, bass = `sawtooth` (offset 1 octave low for body)
- **Bar structure:** 4 bars, 4/4. Tight, looping. Punchy enough to feel like combat without overwhelming the SFX bus.
- **Loop tail:** 30 ms re-trigger.
- **Mix hint:** lower BGM gain to 0.40 during boss-fight (was 0.45). SFX needs to punch through.

**Reference sequence (lead voice, ~3.7 sec):**
```
[294, 0.23], [349, 0.12], [392, 0.12], [466, 0.23],   // D-F-G-Bb (tense leap)
[440, 0.23], [349, 0.12], [392, 0.12], [294, 0.46],   // A-F-G-D
[349, 0.23], [392, 0.23], [440, 0.23], [466, 0.46],   // F-G-A-Bb (push up)
[392, 0.23], [294, 0.92],                              // G-D resolve
```
Bass voice (sawtooth, 1 oct below lead): plays root every quarter-note: D-D-D-D / A-A-A-A / F-F-F-F / G-G-G-G (heavy on the downbeat).

### 1.4 `area2` — Phrygian, wind-modal

- **Mode:** E Phrygian (E F G A B C D)
- **Tempo:** 105 BPM → eighth ≈ 0.143 sec, quarter ≈ 0.286 sec
- **Voicing:** lead = `square`, mid = `triangle`. No bass on `area2` — the wind quality is helped by an open midrange.
- **Bar structure:** 8 bars, 4/4. 2-bar intro (only on first play after `playBGM('area2')`, NOT on loop repeats — handled by the `_playBGMLoop` flag), then 6-bar loop body.
- **Loop tail:** 30 ms re-trigger on the body.

**Reference sequence (lead voice, intro ~1.7 sec):**
```
[330, 0.29], [349, 0.29], [330, 0.29], [294, 0.29],   // E-F-E-D (Phrygian flat-2 signature)
[330, 0.57],                                            // E hold (settle)
```
**Reference sequence (lead voice, body loop ~6.0 sec):**
```
[330, 0.29], [349, 0.29], [392, 0.29], [440, 0.29],   // E-F-G-A
[523, 0.29], [440, 0.29], [392, 0.29], [349, 0.29],   // C-A-G-F
[330, 0.57], [349, 0.29], [392, 0.29],                 // E-F-G
[440, 0.29], [392, 0.29], [349, 0.29], [330, 0.29],   // A-G-F-E
[294, 0.29], [330, 0.29], [349, 0.29], [330, 0.29],   // D-E-F-E
[330, 1.15],                                            // E hold (loop point)
```
Mid voice (triangle, parallel sixth above): start each note 0.05 sec later. Drops out for bars 5-6 (the descending phrase) to leave space.

### 1.5 `game-over` — chromatic descent, one-shot

- **Mode:** chromatic, no tonal center
- **Tempo:** 60 BPM → quarter ≈ 0.500 sec
- **Voicing:** single `sine` oscillator (somber, no harmony).
- **Bar structure:** 4 bars, 4/4. One-shot — does NOT loop. After ~4 sec the track is silent for the rest of the `GAME_OVER` state (until the player presses a key to continue, which switches BGM to `area1` or `area2` depending on where they died).
- **Loop tail:** N/A (one-shot). Implementation: do not schedule the `_bgmTimeout` re-trigger.

**Reference sequence (~4.0 sec):**
```
[440, 0.50], [415, 0.50], [392, 0.50], [370, 0.50],   // A-Ab-G-Gb (descending half-steps)
[349, 0.50], [330, 0.50], [311, 0.50], [294, 1.00],   // F-E-Eb-D (full bar) hold
```
The dotted-half-note D at the end is the sting; let it fade naturally via the existing `gain.exponentialRampToValueAtTime` in `_note`.

### 1.6 `area-cleared` (stinger, not a loop)

- **Mode:** C major arpeggio
- **Tempo:** 100 BPM → eighth ≈ 0.150 sec, quarter ≈ 0.300 sec
- **Voicing:** lead = `square`, harmony = `sine` (a bright top voice).
- **Bar structure:** 4 bars, 4/4. One-shot, plays once on Area-Cleared overlay entry.

**Reference sequence (~3.6 sec):**
```
[523, 0.30], [659, 0.30], [784, 0.30], [1047, 0.60],   // C-E-G-C ascending arpeggio
[1047, 0.30], [988, 0.30], [880, 0.60],                // C-B-A (resolve a step down)
[784, 0.30], [659, 0.30], [523, 1.20],                  // G-E-C settle
```

---

## 2. SFX event catalog

22 events. Each fires `AudioManager.playSFX(<name>)` from a specific source file. Synthesis specs are suggested defaults; dev-lead may tune `_note(freq, dur, start, waveform, dest)` params.

### 2.1 Hero movement / combat

| Event              | playSFX name        | Fires from                            | Synthesis hint |
|--------------------|---------------------|---------------------------------------|----------------|
| Jump                | `jump`              | `HeroController.update` (jump start)  | square, 880Hz, 80ms (existing — keep) |
| Hatchet throw       | `axe`               | `HatchetSystem` spawn                 | sawtooth, 660Hz, 70ms (existing — keep) |
| Hatchet hits enemy  | `axe_hit_enemy`     | `CombatSystem._hatchetVsEnemy`        | square, 440Hz + 220Hz harmonic, 100ms |
| Hatchet hits wall   | `axe_hit_wall`      | `HatchetSystem` despawn-on-wall       | noise burst (`type: 'noise'`), 50ms |
| Hatchet vs moss-pulse mutual despawn | `axe_vs_wave` | `CombatSystem._hatchetVsMossPulse` | square 880Hz + noise burst 60ms (combined, two voices) |
| Enemy stomped       | `stomp`             | `CombatSystem` stomp path             | square, 440Hz, 60ms (existing — keep) |
| Hero hurt           | `hurt`              | `CombatSystem` / hero-loseLife        | sawtooth, 110Hz, 250ms (existing — keep) |

### 2.2 Pickups

| Event                  | playSFX name        | Fires from              | Synthesis hint |
|------------------------|---------------------|-------------------------|----------------|
| Dawn-husk burst        | `husk_burst`        | `HuskSystem` burst      | noise burst 80ms + square 523Hz 60ms (two voices) |
| dawn-husk → hatchet pickup | `collect`         | `HatchetSystem` collect | tri-tone (523-659-784), already exists — keep |
| Dewplum pickup         | `fruit_dewplum`     | `ItemSystem` dewplum    | sine, two-tone 698Hz → 880Hz, each 60ms |
| Amberfig pickup        | `fruit_amberfig`    | `ItemSystem` amberfig   | sine, three-tone 659Hz → 880Hz → 1047Hz, each 60ms |
| Sunpear pickup         | `fruit_sunpear`     | `ItemSystem` sunpear    | sine, four-tone 523-659-784-1047Hz, each 60ms (the bigger food gets the bigger arpeggio) |
| Flintchip pickup       | `flintchip_get`     | `ItemSystem` flintchip  | square 1175Hz 80ms + sine 1568Hz 80ms (a bright, sharp chime) |
| Flintchip buff end     | `flintchip_end`     | `ItemSystem` flintchip ttl=0 | sine 1175Hz → 880Hz, each 80ms (descending — buff fade tell) |

### 2.3 Boss / hazards

| Event                  | playSFX name        | Fires from                       | Synthesis hint |
|------------------------|---------------------|----------------------------------|----------------|
| Boss windup (low rumble) | `boss_windup`      | `BossSystem` windup state entry  | square 110Hz, 200ms (a low pulse, layers under the BGM) |
| Boss attack contact     | `boss_attack_thud`  | `BossSystem` attack contact-frame | noise 100ms + square 165Hz 80ms (heavy stomp) |
| Boss hatchet hit         | `boss_hit`          | `CombatSystem._hatchetVsBoss`    | sawtooth 220Hz 80ms + square 440Hz 40ms |
| Boss death (start)       | `boss_defeat`       | `BossSystem` hp→0                 | sawtooth 880Hz → 440Hz → 220Hz (descending, each 200ms; 600ms total stinger) |
| Skyhook windup warn       | `skyhook_warn`      | `Phase2EnemyAI` Skyhook `triggered` | sine 1568Hz 60ms (a bright cricket-chirp) |
| Cinder pit form           | `ember_pit_form`    | `BossSystem` cinder-floor-impact | square 220Hz 80ms + noise 60ms |

### 2.4 UI / state transitions

| Event              | playSFX name        | Fires from                            | Synthesis hint |
|--------------------|---------------------|---------------------------------------|----------------|
| Stage cleared       | `stage_cleared`     | AreaManager `STAGE_TRANSITION` entry  | square 880Hz 100ms + sine 1047Hz 200ms (rising flourish) |
| Area cleared        | `area_cleared`      | AreaManager `AREA_CLEARED` entry      | (none — handled by the `area-cleared` BGM stinger §1.6) |
| Continue (from GAME_OVER) | `continue`     | StateManager `continueRun`            | sine 523Hz → 659Hz → 784Hz → 1047Hz (200ms total, rising) |
| Title confirm         | `title_confirm`    | First user input on TITLE             | sine 880Hz 100ms |
| Low vitality warning  | `warning`          | AudioManager `update` (existing)      | square 987Hz 50ms (existing — keep) |

### 2.5 Total

22 events distributed as:
- 7 in §2.1 (hero movement / combat)
- 7 in §2.2 (pickups)
- 6 in §2.3 (boss / hazards)
- 5 in §2.4 (UI / state transitions; warning is a special case of low-vitality)

`warning` and `collect`, `jump`, `axe`, `stomp`, `hurt` already exist in `AudioManager.playSFX`. The other 16 are new.

---

## 3. Mix guide

Current values (already in `AudioManager.init`):
- `_masterGain`  = 0.70
- `_bgmGain`     = 0.45
- `_sfxGain`     = 0.80

Recommended v1.0 adjustments:
- **Title screen:** bump `_bgmGain` to 0.55 (no SFX competing) on `playBGM('title')`. Restore to 0.45 on next `playBGM`.
- **Boss-fight:** drop `_bgmGain` to 0.40 on `playBGM('boss-fight')`. Restore to 0.45 on next `playBGM`.
- **Game-over:** drop `_bgmGain` to 0.35 (somber). Restore to 0.45 on next state.

Implementation hint: store the previous gain in `AudioManager` and restore on `stopBGM` or `playBGM(<other>)`.

---

## 4. Wiring map (source file → SFX events)

This table is **the dev-lead's checklist** for v1.0 audio integration. Each row says "in this file, at this event, fire this SFX call."

| File                                | Event / Method                          | SFX call                       |
|-------------------------------------|-----------------------------------------|--------------------------------|
| `src/mechanics/HeroController.js`   | jump start (Z/Space pressed, onGround)  | `audio.playSFX('jump')`        |
| `src/mechanics/HatchetSystem.js`    | hatchet spawn (X tap, armed)             | `audio.playSFX('axe')`         |
| `src/mechanics/HatchetSystem.js`    | hatchet pickup (hero overlaps unowned)   | `audio.playSFX('collect')`     |
| `src/mechanics/HatchetSystem.js`    | hatchet despawn on wall                  | `audio.playSFX('axe_hit_wall')` |
| `src/mechanics/CombatSystem.js`     | `_hatchetVsEnemy` (enemy hit)            | `audio.playSFX('axe_hit_enemy')` |
| `src/mechanics/CombatSystem.js`     | `_hatchetVsBoss` (boss hit)              | `audio.playSFX('boss_hit')`    |
| `src/mechanics/CombatSystem.js`     | `_hatchetVsMossPulse` mutual despawn     | `audio.playSFX('axe_vs_wave')` |
| `src/mechanics/CombatSystem.js`     | stomp path (player kills enemy by stomp) | `audio.playSFX('stomp')`       |
| `src/mechanics/CombatSystem.js`     | hero hurt path (loseLife or vitality)    | `audio.playSFX('hurt')`        |
| `src/mechanics/HuskSystem.js`       | husk burst (hatchet hits a dawn-husk)    | `audio.playSFX('husk_burst')`  |
| `src/mechanics/ItemSystem.js`       | dewplum pickup                            | `audio.playSFX('fruit_dewplum')` |
| `src/mechanics/ItemSystem.js`       | amberfig pickup                           | `audio.playSFX('fruit_amberfig')` |
| `src/mechanics/ItemSystem.js`       | sunpear pickup (NEW)                      | `audio.playSFX('fruit_sunpear')` |
| `src/mechanics/ItemSystem.js`       | flintchip pickup (NEW)                    | `audio.playSFX('flintchip_get')` |
| `src/mechanics/ItemSystem.js`       | flintchip buff end (`pl.flintchipFrames → 0`) | `audio.playSFX('flintchip_end')` |
| `src/mechanics/Phase2EnemyAI.js`    | Skyhook `aiState = 'triggered'`           | `audio.playSFX('skyhook_warn')` |
| `src/mechanics/BossSystem.js`       | windup state entry                        | `audio.playSFX('boss_windup')` |
| `src/mechanics/BossSystem.js`       | attack contact frame                      | `audio.playSFX('boss_attack_thud')` |
| `src/mechanics/BossSystem.js`       | cinder floor impact (Area 2 only)         | `audio.playSFX('ember_pit_form')` |
| `src/mechanics/BossSystem.js`       | boss death start (`hp → 0`)               | `audio.playSFX('boss_defeat')` |
| `src/levels/AreaManager.js`         | `beginStageTransition` entry              | `audio.playSFX('stage_cleared')` |
| `src/core/StateManager.js`          | `continueRun()` start                     | `audio.playSFX('continue')`    |
| `src/core/HeroController.js` or `game.js` | first user input on TITLE → init  | `audio.playSFX('title_confirm')` |

### 4.1 BGM transitions

| Event                                   | Code call                          |
|-----------------------------------------|------------------------------------|
| init / TITLE entry                       | `audio.playBGM('title')`           |
| First user input on TITLE → game start   | `audio.playBGM('area1')` (existing) |
| Area-Cleared (Area 1 done, transition to Area 2) | `audio.playBGM('area2')`     |
| Boss-arena trigger col crossed (Area 1 or 2) | `audio.playBGM('boss-fight')`  |
| Boss defeated → Area-Cleared overlay     | (BGM `area-cleared` stinger one-shot; main BGM continues) |
| `GAME_OVER` entry                         | `audio.playBGM('game-over')`       |
| Continue (from GAME_OVER → RESPAWNING)   | `audio.playBGM('area1')` or `area2` (depending on `areaIndex`) |

---

## 5. AudioManager extension points

Concrete changes dev-lead applies to `src/audio/AudioManager.js`:

### 5.1 Extend `_playBGMLoop` to handle multiple themes

The current `themes` table contains only `area1`. Add `title`, `boss-fight`, `area2`, `game-over`, `area-cleared` as keys, each a `[freq, dur]` array (mono-voice). For multi-voice tracks (title harmony, boss-fight bass, area2 mid), use a parallel `themesHarmony` table; the loop schedules both voices in the same `playBGMLoop` pass.

### 5.2 Add 16 new SFX cases

Extend the `switch (name)` block in `playSFX(name)` with cases for the 16 new events (§2.1–§2.4). Cases use one or two `_note(...)` calls plus optionally a noise burst via a new `_noise(dur, start, dest)` helper.

### 5.3 Add `_noise(dur, start, dest)` helper

Implement white-noise burst via `AudioBufferSourceNode` (a 1-second white-noise `AudioBuffer` created once at init, replayable on demand):

```js
_initNoise() {
    const sr = this._ctx.sampleRate;
    const buf = this._ctx.createBuffer(1, sr, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < sr; i++) data[i] = Math.random() * 2 - 1;
    this._noiseBuf = buf;
}
_noise(dur, start, dest) {
    const src = this._ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const gain = this._ctx.createGain();
    gain.gain.setValueAtTime(0.15, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    src.connect(gain);
    gain.connect(dest);
    src.start(start);
    src.stop(start + dur + 0.01);
}
```

### 5.4 Mix transitions

Add `_setBgmGain(targetValue, rampTimeSec = 0.1)` that ramps `_bgmGain.gain` via `linearRampToValueAtTime`. Call from `playBGM(name)` after switching:
```js
playBGM(name) {
    if (!this.initialized || this._bgmName === name) return;
    this.stopBGM();
    this._bgmName = name;
    if (name === 'title')      this._setBgmGain(0.55);
    else if (name === 'boss-fight') this._setBgmGain(0.40);
    else if (name === 'game-over')  this._setBgmGain(0.35);
    else                            this._setBgmGain(0.45);
    this._playBGMLoop(name);
}
```

---

## 6. IP safety note (release-master)

- All BGM sequences are **coined**, not transcribed from any copyrighted work. Verify by audio listening: no Wonder Boy series BGM, no Sega arcade BGM, no licensed music.
- All SFX are **pure synthesis** (oscillator + noise). No sampled audio is bundled.
- The credits screen text (see `phase4-area2-cast.md` §7.6) should NOT list any specific copyrighted BGM track names from any reference work.

---

## 7. Acceptance tests (dev-lead self-smoke)

Manual smoke checklist for v1.0 audio integration:

- [ ] First page load → no audio (AudioContext blocked until user gesture; correct).
- [ ] First click → AudioContext starts; `title` BGM begins. Single play, loops at the 30 ms tail.
- [ ] Any key on TITLE → `title_confirm` SFX + BGM switches to `area1`.
- [ ] Hero jumps → `jump` SFX (audible distinct from key press).
- [ ] Throw hatchet → `axe` SFX.
- [ ] Hatchet hits Mossplodder → `axe_hit_enemy`; Mossplodder dies → no additional stomp SFX.
- [ ] Hero stomps Mossplodder → `stomp` SFX.
- [ ] Pick up dewplum / amberfig → distinct fruit SFX (audibly different from each other).
- [ ] Hero hurt (Hummerwing contact) → `hurt` SFX.
- [ ] Boss arena entered (Area 1 Stage 4) → BGM switches to `boss-fight`; arrival SFX.
- [ ] Bracken Warden windup → `boss_windup` low pulse.
- [ ] Bracken Warden attack contact → `boss_attack_thud`.
- [ ] Hatchet hits boss → `boss_hit`.
- [ ] Boss defeated → `boss_defeat` descending stinger; Area-Cleared stinger one-shot; Area 1 → Area 2 transition + BGM switches to `area2`.
- [ ] Game-over → BGM switches to `game-over`, one-shot, ~4 sec then silence.
- [ ] Continue → BGM switches back to area BGM; `continue` SFX.
- [ ] Stage clear (mile-marker / stage_exit) → `stage_cleared` SFX flourish.

If all rows pass, audio integration is green.

---

## 8. Cross-references

- `src/audio/AudioManager.js` — implementation target (extend, not rewrite).
- `src/core/GameLoop.js` — currently calls `audio.playBGM('area1')` on `start()`. Move this to a state-driven dispatcher (e.g., `_onGameStateChange` hook in StateManager → audio.playBGM(<mapped>)).
- `docs/briefs/phase4-area2-cast.md` §7.5 — Area 2 narrative hooks for BGM transitions.
- `src/core/StateManager.js` — `setGameState(state)` is the central dispatch point; add an audio side-effect there.

---

**Approved by user for autonomous v1.0 development.**
