# Wonder Boy Legacy Rebirth — Agent Guide

## 프로젝트 개요
1986년 세가 아케이드 원더보이를 JavaScript/HTML5 Canvas로 1:1 이식.
**실행 환경**: 브라우저 (GitHub Pages — https://genishs.github.io/wonderboy/)  
**엔진**: Vanilla JS ES Modules + HTML5 Canvas + Web Audio API (외부 의존성 없음)  
**해상도**: 768×576 px (4:3, 타일 48px, 16×12 tile viewport)  
**목표 프레임**: 60fps (requestAnimationFrame + 고정 타임스텝)

---

## 브랜치 전략

```
main        ← 릴리즈 전용. 머지 즉시 GitHub Pages 자동 배포.
  └─ develop ← 통합 브랜치. feature/* PR은 여기로.
       └─ feature/<module>-<task>  ← 각 에이전트 작업 브랜치
```

### 브랜치 명명 규칙
| 에이전트 | 브랜치 prefix |
|---------|--------------|
| Agent 1 — Architect  | `feature/core-*`     |
| Agent 2 — Physics    | `feature/physics-*`  |
| Agent 3 — Graphics   | `feature/graphics-*` |
| Agent 4 — Levels     | `feature/levels-*`   |
| Agent 5 — Mechanics  | `feature/mechanics-*`|
| Agent 6 — Audio      | `feature/audio-*`    |

### 워크플로우
1. `git checkout -b feature/<prefix>-<task> develop`
2. 작업 후 `git push origin feature/...`
3. GitHub에서 **develop**으로 PR 생성 (`.github/PULL_REQUEST_TEMPLATE/feature_pr.md` 사용)
4. **Agent 1 (System Architect)** 이 리뷰 & 승인 → develop 머지
5. 공정 20% 마다 Agent 1이 `develop → main` PR 생성 → 승인 → 자동 배포

---

## 마일스톤 계획

| 마일스톤 | 공정 | 내용 |
|---------|-----|------|
| M1 | 20% | 게임 루프 동작, 플레이어 이동/점프, Area 1 타일 렌더링, HUD |
| M2 | 40% | 물리 완성(마찰/가속), Area 1 완성, snail/bee/cobra 적 AI |
| M3 | 60% | Area 1–3, 허기 시스템, 도끼/스케이트보드, 보스 1–3 |
| M4 | 80% | Area 1–7, 보스 전체, 오디오 완성, 병렬 스크롤 배경 |
| M5 | 100% | 전 에리어 완성, 게임오버/컨티뉴, 하이스코어, 폴리싱 |

---

## 에이전트별 역할 & 소유 파일

### Agent 1 — System Architect
**소유 디렉터리**: `src/core/`  
**역할**: 전체 게임 루프, ECS 프레임워크, 상태 관리, 에이전트 간 데이터 계약 정의  
**리뷰어**: 모든 `feature/* → develop` PR의 최종 승인자  

핵심 파일:
- `src/core/GameLoop.js` — 60fps 고정 타임스텝 루프
- `src/core/ECS.js` — Entity-Component-System (query, addComponent, destroyEntity)
- `src/core/StateManager.js` — score, lives, hunger, gameState
- `src/core/InputHandler.js` — 키보드/터치 입력 추상화

ECS 컴포넌트 표준 (변경 시 전체 에이전트 영향):
```js
transform  : { x, y, w, h }
velocity   : { vx, vy }
physics    : { onGround, onIce, jumpHoldLeft }
player     : { facingRight, isJumping }
enemy      : { type, dir, ai, hp }
item       : { type, collected }
projectile : { type, lifetime }
sprite     : { sheet, frame, color }
boss       : { area, ai, hp, maxHp, timer }
```

---

### Agent 2 — Physics & Controller Engineer
**소유 디렉터리**: `src/physics/`  
**역할**: 원더보이 특유의 '미끄러지는' 조작감 재현  

핵심 파일:
- `src/physics/PhysicsEngine.js` — 플레이어/투사체/적 물리 업데이트
- `src/physics/CollisionSystem.js` — AABB vs 타일맵 충돌 해소

물리 상수 (현재값 — 튜닝 필요):
```
GRAVITY          = 0.40   (px/frame²)
WALK_ACCEL       = 0.50
MAX_WALK_SPEED   = 3.50
FRICTION_GROUND  = 0.80   (일반 스테이지)
FRICTION_ICE     = 0.97   (에리어 4 얼음)
JUMP_VELOCITY    = -8.50  (초기 vy)
JUMP_HOLD_FRAMES = 12     (가변 점프 최대 프레임)
```

---

### Agent 3 — Graphics & Animation Director
**소유 디렉터리**: `src/graphics/`, `assets/sprites/`  
**역할**: 8비트 스프라이트 관리, 시차 스크롤(parallax), 애니메이션 프레임  

핵심 파일:
- `src/graphics/Renderer.js` — 타일/엔티티/HUD 렌더링 (현재: 색상 사각형 placeholder)
- `src/graphics/SpriteSheet.js` — (TODO) 스프라이트시트 로더
- `src/graphics/ParallaxBackground.js` — (TODO) 레이어 시차 스크롤

스프라이트 구성 계획:
```
assets/sprites/player.png   — 걷기(4f), 점프(1f), 스케이트보드(2f), 공격(1f), 피격(1f)
assets/sprites/enemies.png  — snail/bee/cobra/frog/stone 각 2f 루프
assets/sprites/items.png    — apple, melon, axe, skateboard, angel/devil egg
assets/sprites/tiles.png    — ground, platform, spike, water, wall, ice, goal
assets/sprites/bosses.png   — 에리어별 보스 4f
```

parallax 레이어:
- Layer 0 (sky): scrollX × 0.0 (고정)
- Layer 1 (mountains): scrollX × 0.3
- Layer 2 (trees): scrollX × 0.6
- Layer 3 (tiles): scrollX × 1.0

---

### Agent 4 — Level Design Analyst
**소유 디렉터리**: `src/levels/`, `assets/levels/`  
**역할**: Area 1–7 타일맵 데이터화, 아이템/적 배치  

핵심 파일:
- `src/levels/LevelData.js` — AREA_DATA 객체 (Area 1 Stage 1 구현됨)
- `src/levels/TileMap.js` — 타일 파싱 / getTile()
- `src/levels/LevelManager.js` — 레벨 로드, 카메라 스크롤, 아이템/적 스폰

타일 타입:
```
0=empty  1=ground  2=platform(one-way)  3=spike  4=water
5=bush(deco)  6=wall  7=ice  8=goal
```

아이템 타입 및 효과:
```
apple       → 허기 +10, 점수 +100
melon       → 허기 +30, 점수 +500
cherry      → 허기 +15, 점수 +200
skateboard  → 속도 1.6×, 피격 1회 흡수
axe         → 도끼 +1 (최대 5)
angel_egg   → 허기 +50, 점수 +1000
devil_egg   → 즉시 피격
```

구현 우선순위: Area 1 → Area 2 → Area 3 → … → Area 7

---

### Agent 5 — Mechanics Specialist
**소유 디렉터리**: `src/mechanics/`  
**역할**: 허기 시스템, 무기, 보스 AI, 밸런스  

핵심 파일:
- `src/mechanics/GameMechanics.js` — 메카닉 오케스트레이터
- `src/mechanics/WeaponSystem.js` — 도끼 투사체 (화면에 1개 제한)
- `src/mechanics/BossPatterns.js` — 에리어별 보스 AI

허기 시스템 파라미터:
```
maxHunger       = 100
hungerDecayRate = 1.5 / sec   (StateManager에서 관리)
경고 임계값      = 25 (AudioManager가 경고음 트리거)
회복: apple=10, melon=30, cherry=15, angel_egg=50
```

도끼 규격:
```
AXE_VX = 7   (수평 속도)
AXE_VY = -3  (초기 상향 속도)
MAX_AXES_ON_SCREEN = 1   (원작 제한)
```

---

### Agent 6 — Audio & FX Manager
**소유 디렉터리**: `src/audio/`, `assets/audio/`  
**역할**: BGM 루프, 효과음 트리거, 저 허기 경고음  

핵심 파일:
- `src/audio/AudioManager.js` — Web Audio API 래퍼 (현재: 절차적 비프음)
- `src/audio/SoundEffects.js` — (TODO) 실제 오디오 파일 로드

SFX 트리거 목록:
```
'jump'             — 점프 시 (PhysicsEngine → GameMechanics → audio.playSFX)
'axe'              — 도끼 투척 시
'collect'          — 아이템 습득 시
'hurt'             — 피격/사망 시
'stomp'            — 적 밟기 시
'skateboard_break' — 스케이트보드 파손 시
'warning'          — 허기 < 25 시 주기적으로 (0.8초 간격)
```

BGM 루프 포인트 (파일 추가 시 여기에 문서화):
```
area1.ogg: loopStart=3.2s  loopEnd=16.8s
```

오디오 파일 형식: OGG Vorbis (브라우저 호환성 최우선)

---

## 로컬 개발 환경

ES Modules는 `file://` 프로토콜에서 CORS 에러 발생.  
반드시 로컬 서버로 실행:

```bash
# Python
python -m http.server 8080

# Node
npx serve .

# VS Code: Live Server 확장 사용
```

접속: http://localhost:8080

---

## 코딩 규칙
- 외부 라이브러리 금지 (Vanilla JS only)
- ES6+ class / const / arrow function 사용
- 파일 상단 주석: 담당 에이전트와 TODO 항목 명시
- 타일 픽셀 상수 `TILE = 48` (변경 금지 — 전체 좌표계 영향)
- 캔버스 좌표: 좌상단이 (0,0), x→오른쪽, y→아래쪽
