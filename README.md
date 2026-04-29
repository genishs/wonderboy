# Wonder Boy Legacy Rebirth

> 1986년 세가 아케이드 게임 원더보이(Wonder Boy)를 JavaScript/HTML5 Canvas로 1:1 이식한 프로젝트.

🎮 **[지금 플레이하기](https://genishs.github.io/wonderboy/)**

---

## 게임 소개

원더보이(Wonder Boy)는 1986년 세가(Sega)가 제작한 횡스크롤 액션 플랫포머입니다.  
플레이어는 소년 톰톰을 조작해 7개의 에리어를 탐험하며, 허기(Vitality) 게이지가 소진되기 전에 과일을 먹어 생존해야 합니다.

### 핵심 메카닉
| 메카닉 | 설명 |
|--------|------|
| **허기 시스템** | 시간이 지남에 따라 Vitality 게이지 감소. 과일 수집으로 회복 |
| **가변 점프** | 버튼 누름 시간에 따라 점프 높이 달라짐 |
| **스케이트보드** | 습득 시 이동 속도 1.6배, 피격 1회 흡수 |
| **돌도끼** | 최대 1개 동시 발사, 포물선 궤적 |
| **관성 이동** | 가속도·마찰력으로 '미끄러지는' 조작감 |

---

## 조작법

| 키 | 동작 |
|----|------|
| ← → (또는 A D) | 이동 |
| ↑ / W / Space | 점프 (길게 누를수록 높이 점프) |
| X / Ctrl | 도끼 던지기 |
| P / Esc | 일시정지 |

**모바일**: 좌측 30% 터치 → 왼쪽, 우측 30% 하단 → 점프, 우측 30% 상단 → 공격

---

## 개발 환경 세팅

ES Modules는 `file://` 프로토콜에서 실행되지 않습니다. 반드시 로컬 서버 필요:

```bash
# 방법 1 — Python
python -m http.server 8080

# 방법 2 — Node.js
npx serve .

# 방법 3 — VS Code Live Server 확장 사용
```

접속: http://localhost:8080

---

## 프로젝트 구조

```
wonderboy/
├── index.html               # 게임 진입점
├── game.js                  # 시스템 초기화 & 시작
├── src/
│   ├── core/                # Agent 1 — System Architect
│   │   ├── GameLoop.js      # 60fps 고정 타임스텝 루프
│   │   ├── ECS.js           # Entity-Component-System 프레임워크
│   │   ├── StateManager.js  # 점수·생명·허기·게임 상태
│   │   └── InputHandler.js  # 키보드 & 터치 입력
│   ├── physics/             # Agent 2 — Physics Engineer
│   │   ├── PhysicsConstants.js  # 물리 상수 (튜닝 파일)
│   │   ├── PhysicsEngine.js
│   │   └── CollisionSystem.js
│   ├── graphics/            # Agent 3 — Graphics Director
│   │   ├── Renderer.js
│   │   ├── SpriteSheet.js
│   │   └── ParallaxBackground.js
│   ├── levels/              # Agent 4 — Level Design Analyst
│   │   ├── LevelData.js     # Area 1–7 타일맵 데이터
│   │   ├── LevelManager.js  # 레벨 로드·카메라·스폰
│   │   └── TileMap.js
│   ├── mechanics/           # Agent 5 — Mechanics Specialist
│   │   ├── GameMechanics.js
│   │   ├── WeaponSystem.js
│   │   └── BossPatterns.js
│   └── audio/               # Agent 6 — Audio & FX Manager
│       └── AudioManager.js
├── assets/
│   ├── sprites/             # PNG 스프라이트시트 (Agent 3 담당)
│   ├── audio/               # OGG 오디오 파일 (Agent 6 담당)
│   └── levels/              # 레벨 JSON 데이터 (Agent 4 담당)
└── .github/
    └── workflows/
        ├── pr-feature-to-develop.yml  # PR 검증 CI
        └── deploy-pages.yml           # GitHub Pages 자동 배포
```

---

## 브랜치 전략 & 개발 워크플로우

```
main        ── 릴리즈 브랜치. 머지 시 GitHub Pages 자동 배포
  └─ develop ── 통합 브랜치. 모든 feature는 여기로 PR
       ├─ feature/core-*          (Agent 1)
       ├─ feature/physics-*       (Agent 2)
       ├─ feature/graphics-*      (Agent 3)
       ├─ feature/levels-*        (Agent 4)
       ├─ feature/mechanics-*     (Agent 5)
       └─ feature/audio-*         (Agent 6)
```

### PR 프로세스
1. `feature/*` 브랜치에서 작업 후 `develop`으로 PR
2. GitHub Actions가 JS 문법 검사 & 구조 검증 자동 실행
3. **Agent 1 (System Architect)** 가 코드 리뷰 & 승인
4. 공정 20% 마다 `develop → main` PR → 승인 → 자동 배포

### 마일스톤
| 마일스톤 | 공정 | 목표 |
|---------|-----|------|
| M1 | 20% | 게임 루프, 플레이어 이동/점프, Area 1 타일, 기본 HUD |
| M2 | 40% | 물리 완성, Area 1 완성, 3종 적 AI |
| M3 | 60% | Area 1–3, 허기 시스템, 도끼/스케이트보드 |
| M4 | 80% | Area 1–7, 보스 전체, 오디오 완성 |
| M5 | 100% | 전 에리어, 게임오버/컨티뉴, 하이스코어 |

---

## 6개 에이전트 역할

| # | 에이전트 | 소유 디렉터리 | 주요 임무 |
|---|---------|------------|---------|
| 1 | System Architect | `src/core/` | 게임 루프, ECS, 상태 관리, **PR 리뷰어** |
| 2 | Physics Engineer | `src/physics/` | 이동 관성, 점프 궤적, 타일 충돌 |
| 3 | Graphics Director | `src/graphics/`, `assets/sprites/` | 스프라이트, 패럴랙스, 애니메이션 |
| 4 | Level Design Analyst | `src/levels/`, `assets/levels/` | Area 1–7 타일맵, 아이템/적 배치 |
| 5 | Mechanics Specialist | `src/mechanics/` | 허기, 도끼, 보스 AI, 밸런스 |
| 6 | Audio & FX Manager | `src/audio/`, `assets/audio/` | BGM, 효과음, 저체력 경고 |

---

## 기술 스택

- **엔진**: Vanilla JavaScript ES6+ Modules
- **렌더링**: HTML5 Canvas 2D API
- **오디오**: Web Audio API
- **배포**: GitHub Pages (GitHub Actions)
- **해상도**: 768×576px (4:3, 타일 48px)

---

## 라이선스

학습 및 비상업적 목적의 팬 리메이크. 원더보이의 저작권은 세가(Sega)에 있습니다.
