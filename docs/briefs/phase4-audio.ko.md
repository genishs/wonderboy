# Phase 4 — 오디오 브리프: Web Audio 합성 (v1.0)

> **작성 agent:** story-lead
> **소비 agent:** dev-lead (주요), design-lead (참고용, sigil-flash 싱크 힌트)
> **리뷰어:** release-master
> **연관 문서:** `docs/briefs/phase4-area2-cast.md`, `src/audio/AudioManager.js`
> **English version:** [phase4-audio.md](./phase4-audio.md)

본 브리프는 **v1.0 의 Web Audio API 프로시저럴 합성 완전 spec** 입니다. 바이너리 오디오 자산은 0개; 모든 것이 `AudioContext`, `OscillatorNode`, `GainNode` 체인으로 코드에서 생성됩니다. 기존 `src/audio/AudioManager.js` (Phase 1 procedural 스캐폴드) 가 **5종 BGM 트랙**, **~22 SFX 이벤트**, 그리고 각 이벤트가 어느 source 파일에서 발화하는지 나타내는 wiring 맵으로 확장됩니다.

> **IP 안전성.** 저작권 멜로디는 재현되지 않습니다. 각 BGM 트랙은 mode + tempo + voicing + bar-structure 로 명세되며, 실제 노트 시퀀스는 본 프로젝트에서 조어된 것입니다. SFX 는 순수 합성 percussion / pluck / noise — 샘플 오디오 없음.

---

## 1. BGM 트랙

명명된 트랙 5종. 모두 loop 가능 (game-over 는 silence 로 페이드하는 one-shot). 모두 `OscillatorNode` 체인으로 구축, `_bgmGain` (기본 0.45) 로 라우팅. 트랙별 voicing 과 mode 는 아래; dev-lead 는 기존 `_playBGMLoop(name)` 패턴으로 구현.

### 1.1 `area1` — 이미 출시 (참고)

v0.75 구현 참고:
- Mode: A minor pentatonic (근사)
- Tempo: `[freq, dur]` 리스트에서 implicit ~120 BPM
- Voicing: single square-wave oscillator
- Loop: ~3.2 초 한 패스, 갭 마스킹을 위해 30 ms 일찍 re-trigger

v1.0 에서 **`area1` 은 그대로 유지**. 아래 신규 트랙들은 같은 데이터 구조 (`[freq_hz, duration_sec]` 배열, voice 별) 를 미러.

### 1.2 `title` — Lydian, 따뜻함

- **Mode:** C Lydian (C D E F# G A B)
- **Tempo:** 90 BPM → eighth ≈ 0.167 sec, quarter ≈ 0.333 sec
- **Voicing:** lead = `sine`, harmony = `triangle` (square 보다 따뜻함)
- **Bar 구조:** 8 bar, 4/4. 1-4 bar = "ascending welcome" (kettle-warm), 5-8 bar = "settle on the tonic."
- **Loop tail:** 30 ms re-trigger lead time (area1 동일).
- **Mix 힌트:** title 동안 BGM gain 을 0.55 로 부스트 (gameplay 보다 약간 큼) — title 화면은 SFX 경합 없음.

**참고 시퀀스 (lead voice, ~5.3 sec):**
```
[523, 0.33], [587, 0.33], [659, 0.33], [698, 0.33],   // C-D-E-F# ascending
[783, 0.50], [698, 0.17], [659, 0.17], [587, 0.17],   // G-F#-E-D
[523, 0.33], [392, 0.33], [523, 0.33], [659, 0.33],   // C-G-C-E
[523, 1.00],                                           // C hold
```
Harmony voice (triangle, 평행 3도 아래): 각 노트 0.05 초 늦게 시작 (부드러운 pluck).

### 1.3 `boss-fight` — Dorian, 긴장

- **Mode:** D Dorian (D E F G A B C)
- **Tempo:** 130 BPM → eighth ≈ 0.115 sec, quarter ≈ 0.231 sec
- **Voicing:** lead = `square`, bass = `sawtooth` (body 위해 1 옥타브 낮춤)
- **Bar 구조:** 4 bar, 4/4. 타이트, 루핑. SFX bus 를 덮지 않으면서 전투처럼 강렬.
- **Loop tail:** 30 ms re-trigger.
- **Mix 힌트:** boss-fight 동안 BGM gain 을 0.40 로 (기본 0.45). SFX 가 뚫고 나오게.

**참고 시퀀스 (lead voice, ~3.7 sec):**
```
[294, 0.23], [349, 0.12], [392, 0.12], [466, 0.23],   // D-F-G-Bb (긴장된 도약)
[440, 0.23], [349, 0.12], [392, 0.12], [294, 0.46],   // A-F-G-D
[349, 0.23], [392, 0.23], [440, 0.23], [466, 0.46],   // F-G-A-Bb (밀어 올림)
[392, 0.23], [294, 0.92],                              // G-D 해소
```
Bass voice (sawtooth, lead 보다 1 옥타브 아래): 매 quarter-note 마다 루트: D-D-D-D / A-A-A-A / F-F-F-F / G-G-G-G (다운비트 강조).

### 1.4 `area2` — Phrygian, 바람-모달

- **Mode:** E Phrygian (E F G A B C D)
- **Tempo:** 105 BPM → eighth ≈ 0.143 sec, quarter ≈ 0.286 sec
- **Voicing:** lead = `square`, mid = `triangle`. `area2` 에는 bass 없음 — 바람 같은 질감을 위해 오픈 미드.
- **Bar 구조:** 8 bar, 4/4. 2-bar 인트로 (`playBGM('area2')` 첫 재생에만, loop 반복 시 X — `_playBGMLoop` 플래그로 처리), 이후 6-bar loop body.
- **Loop tail:** body 에 30 ms re-trigger.

**참고 시퀀스 (lead voice, intro ~1.7 sec):**
```
[330, 0.29], [349, 0.29], [330, 0.29], [294, 0.29],   // E-F-E-D (Phrygian flat-2 시그니처)
[330, 0.57],                                            // E hold (정착)
```
**참고 시퀀스 (lead voice, body loop ~6.0 sec):**
```
[330, 0.29], [349, 0.29], [392, 0.29], [440, 0.29],   // E-F-G-A
[523, 0.29], [440, 0.29], [392, 0.29], [349, 0.29],   // C-A-G-F
[330, 0.57], [349, 0.29], [392, 0.29],                 // E-F-G
[440, 0.29], [392, 0.29], [349, 0.29], [330, 0.29],   // A-G-F-E
[294, 0.29], [330, 0.29], [349, 0.29], [330, 0.29],   // D-E-F-E
[330, 1.15],                                            // E hold (루프 포인트)
```
Mid voice (triangle, 평행 6도 위): 각 노트 0.05 초 늦게 시작. 5-6 bar (하강 phrase) 에서 빠짐.

### 1.5 `game-over` — chromatic 하강, one-shot

- **Mode:** chromatic, no tonal center
- **Tempo:** 60 BPM → quarter ≈ 0.500 sec
- **Voicing:** single `sine` oscillator (somber, harmony 없음).
- **Bar 구조:** 4 bar, 4/4. One-shot — 루프 안 함. ~4 초 후 `GAME_OVER` 상태 잔여 시간 동안 silence (플레이어가 키 눌러 continue 할 때까지 — BGM 은 `area1` 또는 `area2` 로 스위치, 어디서 죽었는지에 따라).
- **Loop tail:** N/A (one-shot). 구현: `_bgmTimeout` re-trigger 스케줄 안 함.

**참고 시퀀스 (~4.0 sec):**
```
[440, 0.50], [415, 0.50], [392, 0.50], [370, 0.50],   // A-Ab-G-Gb (반음 하강)
[349, 0.50], [330, 0.50], [311, 0.50], [294, 1.00],   // F-E-Eb-D (full bar) hold
```
끝의 dotted-half-note D 가 마무리; 기존 `gain.exponentialRampToValueAtTime` 으로 자연스럽게 페이드.

### 1.6 `area-cleared` (스팅거, 루프 아님)

- **Mode:** C major arpeggio
- **Tempo:** 100 BPM → eighth ≈ 0.150 sec, quarter ≈ 0.300 sec
- **Voicing:** lead = `square`, harmony = `sine` (밝은 top voice).
- **Bar 구조:** 4 bar, 4/4. One-shot, Area-Cleared 오버레이 진입 시 1회 재생.

**참고 시퀀스 (~3.6 sec):**
```
[523, 0.30], [659, 0.30], [784, 0.30], [1047, 0.60],   // C-E-G-C 상승 arpeggio
[1047, 0.30], [988, 0.30], [880, 0.60],                // C-B-A (한 칸 내려 해소)
[784, 0.30], [659, 0.30], [523, 1.20],                  // G-E-C 정착
```

---

## 2. SFX 이벤트 카탈로그

22 이벤트. 각각 특정 source 파일에서 `AudioManager.playSFX(<name>)` 발화. 합성 spec 은 제안 default; dev-lead 가 `_note(freq, dur, start, waveform, dest)` 파라미터 튜닝 가능.

### 2.1 영웅 이동 / 전투

| 이벤트              | playSFX 이름        | 발화 위치                              | 합성 힌트 |
|--------------------|---------------------|---------------------------------------|----------------|
| 점프                | `jump`              | `HeroController.update` (jump 시작)    | square, 880Hz, 80ms (기존 — 유지) |
| 도끼 던지기          | `axe`               | `HatchetSystem` spawn                 | sawtooth, 660Hz, 70ms (기존 — 유지) |
| 도끼가 적 hit       | `axe_hit_enemy`     | `CombatSystem._hatchetVsEnemy`        | square, 440Hz + 220Hz harmonic, 100ms |
| 도끼가 벽 hit       | `axe_hit_wall`      | `HatchetSystem` despawn-on-wall       | noise burst (`type: 'noise'`), 50ms |
| 도끼 vs moss-pulse 상호 despawn | `axe_vs_wave` | `CombatSystem._hatchetVsMossPulse` | square 880Hz + noise burst 60ms (2 voice) |
| 적 밟힘             | `stomp`             | `CombatSystem` stomp path             | square, 440Hz, 60ms (기존 — 유지) |
| 영웅 hurt           | `hurt`              | `CombatSystem` / hero-loseLife        | sawtooth, 110Hz, 250ms (기존 — 유지) |

### 2.2 픽업

| 이벤트                   | playSFX 이름        | 발화 위치               | 합성 힌트 |
|-------------------------|---------------------|------------------------|----------------|
| Dawn-husk burst          | `husk_burst`        | `HuskSystem` burst     | noise burst 80ms + square 523Hz 60ms (2 voice) |
| dawn-husk → 도끼 pickup  | `collect`           | `HatchetSystem` collect | tri-tone (523-659-784), 기존 — 유지 |
| Dewplum 픽업             | `fruit_dewplum`     | `ItemSystem` dewplum   | sine, two-tone 698Hz → 880Hz, 각 60ms |
| Amberfig 픽업            | `fruit_amberfig`    | `ItemSystem` amberfig  | sine, three-tone 659Hz → 880Hz → 1047Hz, 각 60ms |
| Sunpear 픽업             | `fruit_sunpear`     | `ItemSystem` sunpear   | sine, four-tone 523-659-784-1047Hz, 각 60ms (더 큰 음식이 더 큰 arpeggio) |
| Flintchip 픽업           | `flintchip_get`     | `ItemSystem` flintchip | square 1175Hz 80ms + sine 1568Hz 80ms (밝고 날카로운 chime) |
| Flintchip buff 종료      | `flintchip_end`     | `ItemSystem` flintchip ttl=0 | sine 1175Hz → 880Hz, 각 80ms (하강 — buff 페이드 tell) |

### 2.3 보스 / 위험

| 이벤트                     | playSFX 이름        | 발화 위치                          | 합성 힌트 |
|---------------------------|---------------------|----------------------------------|----------------|
| 보스 windup (낮은 rumble) | `boss_windup`       | `BossSystem` windup 상태 진입     | square 110Hz, 200ms (낮은 pulse, BGM 아래 layered) |
| 보스 공격 접촉             | `boss_attack_thud`  | `BossSystem` attack 접촉 프레임   | noise 100ms + square 165Hz 80ms (무거운 stomp) |
| 보스 도끼 hit              | `boss_hit`          | `CombatSystem._hatchetVsBoss`    | sawtooth 220Hz 80ms + square 440Hz 40ms |
| 보스 사망 (시작)            | `boss_defeat`       | `BossSystem` hp→0                 | sawtooth 880Hz → 440Hz → 220Hz (하강, 각 200ms; 600ms 총 스팅거) |
| Skyhook windup 경고        | `skyhook_warn`      | `Phase2EnemyAI` Skyhook `triggered` | sine 1568Hz 60ms (밝은 귀뚜라미 처프) |
| 잿불 구덩이 생성            | `ember_pit_form`    | `BossSystem` cinder-floor-impact  | square 220Hz 80ms + noise 60ms |

### 2.4 UI / 상태 전환

| 이벤트              | playSFX 이름        | 발화 위치                              | 합성 힌트 |
|--------------------|---------------------|---------------------------------------|----------------|
| 스테이지 클리어       | `stage_cleared`     | AreaManager `STAGE_TRANSITION` 진입    | square 880Hz 100ms + sine 1047Hz 200ms (상승 플로리시) |
| 에어리어 클리어       | `area_cleared`      | AreaManager `AREA_CLEARED` 진입        | (없음 — `area-cleared` BGM 스팅거 §1.6 가 처리) |
| Continue (GAME_OVER 에서) | `continue`     | StateManager `continueRun`            | sine 523Hz → 659Hz → 784Hz → 1047Hz (총 200ms, 상승) |
| 타이틀 확인           | `title_confirm`     | TITLE 에서 첫 사용자 입력               | sine 880Hz 100ms |
| 저 vitality 경고      | `warning`           | AudioManager `update` (기존)           | square 987Hz 50ms (기존 — 유지) |

### 2.5 총계

22 이벤트 분포:
- §2.1 (영웅 이동/전투) 7개
- §2.2 (픽업) 7개
- §2.3 (보스/위험) 6개
- §2.4 (UI/상태) 5개 (warning 은 저 vitality 의 특수 case)

`warning`, `collect`, `jump`, `axe`, `stomp`, `hurt` 는 `AudioManager.playSFX` 에 이미 있음. 나머지 16개가 신규.

---

## 3. Mix 가이드

현재 값 (이미 `AudioManager.init` 에 있음):
- `_masterGain`  = 0.70
- `_bgmGain`     = 0.45
- `_sfxGain`     = 0.80

v1.0 권장 조정:
- **타이틀 화면:** `playBGM('title')` 시 `_bgmGain` 을 0.55 로 부스트 (SFX 경합 없음). 다음 `playBGM` 에서 0.45 복원.
- **보스 전투:** `playBGM('boss-fight')` 시 `_bgmGain` 을 0.40 으로. 다음 `playBGM` 에서 0.45 복원.
- **Game-over:** `_bgmGain` 을 0.35 (somber). 다음 상태에서 0.45 복원.

구현 힌트: `AudioManager` 에 이전 gain 저장, `stopBGM` 또는 `playBGM(<other>)` 시 복원.

---

## 4. Wiring 맵 (source 파일 → SFX 이벤트)

이 표는 **dev-lead 의 v1.0 오디오 통합 체크리스트** 입니다. 각 행은 "이 파일의, 이 이벤트에서, 이 SFX 호출."

| 파일                                  | 이벤트 / 메서드                          | SFX 호출                       |
|-------------------------------------|-----------------------------------------|--------------------------------|
| `src/mechanics/HeroController.js`   | jump 시작 (Z/Space 누름, onGround)        | `audio.playSFX('jump')`        |
| `src/mechanics/HatchetSystem.js`    | 도끼 spawn (X tap, armed)                | `audio.playSFX('axe')`         |
| `src/mechanics/HatchetSystem.js`    | 도끼 픽업 (영웅이 unowned 와 overlap)     | `audio.playSFX('collect')`     |
| `src/mechanics/HatchetSystem.js`    | 도끼 wall despawn                         | `audio.playSFX('axe_hit_wall')` |
| `src/mechanics/CombatSystem.js`     | `_hatchetVsEnemy` (적 hit)                | `audio.playSFX('axe_hit_enemy')` |
| `src/mechanics/CombatSystem.js`     | `_hatchetVsBoss` (보스 hit)               | `audio.playSFX('boss_hit')`    |
| `src/mechanics/CombatSystem.js`     | `_hatchetVsMossPulse` 상호 despawn        | `audio.playSFX('axe_vs_wave')` |
| `src/mechanics/CombatSystem.js`     | stomp path (영웅이 밟아 적 처치)           | `audio.playSFX('stomp')`       |
| `src/mechanics/CombatSystem.js`     | 영웅 hurt path (loseLife 또는 vitality)    | `audio.playSFX('hurt')`        |
| `src/mechanics/HuskSystem.js`       | husk burst (도끼가 dawn-husk hit)         | `audio.playSFX('husk_burst')`  |
| `src/mechanics/ItemSystem.js`       | dewplum 픽업                              | `audio.playSFX('fruit_dewplum')` |
| `src/mechanics/ItemSystem.js`       | amberfig 픽업                             | `audio.playSFX('fruit_amberfig')` |
| `src/mechanics/ItemSystem.js`       | sunpear 픽업 (NEW)                        | `audio.playSFX('fruit_sunpear')` |
| `src/mechanics/ItemSystem.js`       | flintchip 픽업 (NEW)                      | `audio.playSFX('flintchip_get')` |
| `src/mechanics/ItemSystem.js`       | flintchip buff 종료 (`pl.flintchipFrames → 0`) | `audio.playSFX('flintchip_end')` |
| `src/mechanics/Phase2EnemyAI.js`    | Skyhook `aiState = 'triggered'`           | `audio.playSFX('skyhook_warn')` |
| `src/mechanics/BossSystem.js`       | windup 상태 진입                          | `audio.playSFX('boss_windup')` |
| `src/mechanics/BossSystem.js`       | attack 접촉 프레임                        | `audio.playSFX('boss_attack_thud')` |
| `src/mechanics/BossSystem.js`       | 잿불 바닥 impact (Area 2 전용)             | `audio.playSFX('ember_pit_form')` |
| `src/mechanics/BossSystem.js`       | 보스 사망 시작 (`hp → 0`)                  | `audio.playSFX('boss_defeat')` |
| `src/levels/AreaManager.js`         | `beginStageTransition` 진입               | `audio.playSFX('stage_cleared')` |
| `src/core/StateManager.js`          | `continueRun()` 시작                      | `audio.playSFX('continue')`    |
| `src/core/HeroController.js` 또는 `game.js` | TITLE 첫 사용자 입력 → init       | `audio.playSFX('title_confirm')` |

### 4.1 BGM 전환

| 이벤트                                       | 코드 호출                            |
|---------------------------------------------|------------------------------------|
| init / TITLE 진입                            | `audio.playBGM('title')`           |
| TITLE 의 첫 사용자 입력 → 게임 시작            | `audio.playBGM('area1')` (기존)    |
| Area-Cleared (Area 1 종료, Area 2 로 전환)   | `audio.playBGM('area2')`           |
| 보스 아레나 trigger col 통과 (Area 1 또는 2) | `audio.playBGM('boss-fight')`      |
| 보스 사망 → Area-Cleared 오버레이              | (BGM `area-cleared` 스팅거 one-shot; main BGM 계속) |
| `GAME_OVER` 진입                              | `audio.playBGM('game-over')`       |
| Continue (GAME_OVER → RESPAWNING)            | `audio.playBGM('area1')` 또는 `area2` (`areaIndex` 에 따라) |

---

## 5. AudioManager 확장 포인트

dev-lead 가 `src/audio/AudioManager.js` 에 적용할 구체 변경:

### 5.1 `_playBGMLoop` 을 다중 테마 처리하도록 확장

현재 `themes` 테이블엔 `area1` 뿐. `title`, `boss-fight`, `area2`, `game-over`, `area-cleared` 를 키로 추가, 각각 `[freq, dur]` 배열 (mono-voice). 다중 voice 트랙 (title harmony, boss-fight bass, area2 mid) 은 평행 `themesHarmony` 테이블 사용; 루프가 같은 `playBGMLoop` 패스에서 두 voice 모두 스케줄.

### 5.2 16 신규 SFX 케이스 추가

`playSFX(name)` 의 `switch (name)` 블록에 §2.1–§2.4 의 16 신규 이벤트 케이스 확장. 케이스는 한 두 개의 `_note(...)` 호출 + 선택적으로 새 `_noise(dur, start, dest)` 헬퍼를 통한 noise burst 사용.

### 5.3 `_noise(dur, start, dest)` 헬퍼 추가

`AudioBufferSourceNode` 로 white-noise burst 구현 (init 시 1회 1초 white-noise `AudioBuffer` 생성, on-demand 재생):

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

### 5.4 Mix 전환

`_setBgmGain(targetValue, rampTimeSec = 0.1)` 추가 — `_bgmGain.gain` 을 `linearRampToValueAtTime` 으로 ramp. `playBGM(name)` 에서 스위치 후 호출:
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

## 6. IP 안전성 노트 (release-master)

- 모든 BGM 시퀀스는 저작권 작품에서 transcribe 한 게 아니라 **조어**. 오디오로 검증: 원더보이 시리즈 BGM 없음, Sega arcade BGM 없음, 라이선스 음악 없음.
- 모든 SFX 는 **순수 합성** (oscillator + noise). 샘플 오디오 번들 없음.
- 크레딧 화면 텍스트 (`phase4-area2-cast.md` §7.6) 는 어떤 참고 작품의 특정 저작권 BGM 트랙명도 나열하면 **안 됨**.

---

## 7. 검수 테스트 (dev-lead self-smoke)

v1.0 오디오 통합 수동 smoke 체크리스트:

- [ ] 첫 페이지 로드 → 오디오 없음 (사용자 제스처 전까지 AudioContext 차단; 정상).
- [ ] 첫 클릭 → AudioContext 시작; `title` BGM 시작. 1회 재생, 30 ms tail 에 루프.
- [ ] TITLE 의 아무 키 → `title_confirm` SFX + BGM 이 `area1` 으로 스위치.
- [ ] 영웅 점프 → `jump` SFX (키 누름과 분명히 구별).
- [ ] 도끼 던지기 → `axe` SFX.
- [ ] 도끼가 Mossplodder hit → `axe_hit_enemy`; Mossplodder 사망 → 추가 stomp SFX 없음.
- [ ] 영웅이 Mossplodder 밟음 → `stomp` SFX.
- [ ] dewplum / amberfig 픽업 → 서로 다른 fruit SFX (가청 구별).
- [ ] 영웅 hurt (Hummerwing 접촉) → `hurt` SFX.
- [ ] 보스 아레나 진입 (Area 1 Stage 4) → BGM 이 `boss-fight` 로 스위치; 도착 SFX.
- [ ] Bracken Warden windup → `boss_windup` low pulse.
- [ ] Bracken Warden attack 접촉 → `boss_attack_thud`.
- [ ] 도끼가 보스 hit → `boss_hit`.
- [ ] 보스 사망 → `boss_defeat` 하강 스팅거; Area-Cleared 스팅거 one-shot; Area 1 → Area 2 전환 + BGM 이 `area2` 로 스위치.
- [ ] Game-over → BGM 이 `game-over` 로, one-shot, ~4 초 후 silence.
- [ ] Continue → BGM 이 area BGM 으로 복귀; `continue` SFX.
- [ ] 스테이지 클리어 (mile-marker / stage_exit) → `stage_cleared` SFX 플로리시.

전 행 통과 시 오디오 통합 green.

---

## 8. Cross-references

- `src/audio/AudioManager.js` — 구현 대상 (확장, rewrite 아님).
- `src/core/GameLoop.js` — 현재 `start()` 에서 `audio.playBGM('area1')` 호출. 이걸 state-driven dispatcher (예: StateManager 의 `_onGameStateChange` 훅 → `audio.playBGM(<mapped>)`) 로 이동.
- `docs/briefs/phase4-area2-cast.md` §7.5 — BGM 전환을 위한 Area 2 서사 훅.
- `src/core/StateManager.js` — `setGameState(state)` 가 중심 dispatch 포인트; 여기서 audio side-effect 추가.

---

**Approved by user for autonomous v1.0 development.**
