# Wonder Boy Tribute

> **English version:** [README.md](./README.md)

> 1986/87년 Sega Wonder Boy 시리즈에서 영감을 받은 **오리지널** 팬 메이드 횡스크롤 액션 플랫포머.
> Vanilla JavaScript + HTML5 Canvas로 제작, GitHub Pages로 배포됩니다.

🎮 **플레이하기: https://genishs.github.io/wonderboy/**

> 본 프로젝트는 **트리뷰트**입니다. 캐릭터 이름·스프라이트·오디오·세계관 모두 자체 제작한 오리지널 자산입니다. 원작은 플레이어로서 학습하지만 그래픽은 모두 직접 그립니다.

---

## 핵심 특징

- 8/16비트 풍 횡스크롤 플랫포머, 오리지널 캐스트
- 가변 점프(누른 시간으로 높이 조절), 관성 이동, 던지는 무기
- Vitality(허기) 게이지로 끊임없이 진행하도록 압박
- 7개 에리어, 오리지널 타일셋과 패럴랙스 배경
- 60fps 고정 타임스텝, 런타임 의존성 0, 빌드 단계 0

---

## 조작

| 키              | 동작                                         |
|-----------------|----------------------------------------------|
| ← → / A D       | 이동                                         |
| Z / Space       | 점프 (길게 누를수록 높음)                    |
| X (탭)          | 무기 던지기 (무장 상태일 때)                 |
| X (홀드)        | 대시 (홀드하는 동안 빠르게 걷기)             |
| Z + X (홀드)    | 더 높은 점프                                 |
| P / Esc         | 일시정지                                     |

**모바일** (터치): 캔버스 위에 반투명 버튼 4개가 그려집니다 — 좌측 하단 `←` / `→` 는 이동, 우측 하단 좌측의 `Z` 는 점프, 우측 하단 맨 우측의 `X` 는 공격/대시. 멀티터치를 지원하므로 한 손가락으로 `→` 를 누른 채 다른 손가락으로 `Z` 를 탭하거나 `X` 를 함께 홀드해 달리기·점프·대시를 자유롭게 조합할 수 있습니다.

---

## 로컬 실행

ES Modules는 `file://` 프로토콜에서 로드되지 않습니다. 정적 서버가 필요합니다:

```bash
npx serve . --listen 8080      # Node
python -m http.server 8080     # Python
```

http://localhost:8080 에서 접속.

---

## 프로젝트 구조

```
wonderboy/
├── index.html              # 진입점
├── game.js                 # 시스템 부트스트랩
├── src/
│   ├── core/               # 게임 루프, ECS, 상태, 입력
│   ├── physics/            # 이동 + 충돌
│   ├── graphics/           # Renderer, sprite cache, parallax
│   ├── levels/             # 타일맵 + level manager
│   ├── mechanics/          # 허기, 무기, 적 AI, 보스
│   └── audio/              # Web Audio 래퍼
├── assets/
│   ├── sprites/            # 스프라이트 모듈 (palette + frames as JS data)
│   ├── tiles/              # 에리어별 타일 모듈
│   └── bg/                 # 패럴랙스 SVG 배경
├── docs/
│   ├── story/              # 세계관, 캐릭터, 리서치 노트
│   ├── maps/               # 에리어 / 라운드 구조
│   ├── briefs/             # 페이즈 핸드오프 브리프 (story → design/dev)
│   ├── design/             # 팔레트, 애니메이션 표, design↔dev 데이터 계약
│   └── release-notes.md
└── .github/workflows/      # CI + Pages 배포
```

---

## 브랜치 전략

```
release/gitpages  ← GitHub Pages 소스. quartile마다 main에서 sync.
      │
     main          ← quartile 태그 전용 (v0.25 / v0.50 / v0.75 / v1.0).
      │
   develop        ← 통합 브랜치. 모든 feature/* PR은 여기로.
      │
   feature/<team>-<topic>
```

| 접두사              | 소유자                                    |
|---------------------|-------------------------------------------|
| `feature/story-*`   | story-lead / story-assist                 |
| `feature/design-*`  | design-lead / design-assist               |
| `feature/dev-*`     | dev-lead / dev-assist                     |
| `feature/release-*` | release-master (CI / 릴리즈 도구)         |

### Quartile 마일스톤

| 태그  | 진척률 | 충족 조건                                                                              |
|-------|--------|----------------------------------------------------------------------------------------|
| v0.25 | 25 %   | Phase 1 — 주인공 + 적 ≥3종이 단일 테스트 스테이지에서 이동/공격                        |
| v0.50 | 50 %   | Phase 2 — Area→Round 표 구성, 스테이지 전환, Area 1 완성도 있게 플레이 가능            |
| v0.75 | 75 %   | 멀티 에리어 + 허기/무기 메카닉 + 패럴랙스 + 오디오 통합                                |
| v1.0  | 100 %  | 전체 콘텐츠 + 게임오버/컨티뉴 + 폴리시 + 모바일 컨트롤 검증                            |

---

## 7-에이전트 하네스

| # | 역할           | 모델   | 소유 영역                                                       |
|---|----------------|--------|-----------------------------------------------------------------|
| 1 | story-lead     | opus   | `docs/story/`, `docs/maps/`, `docs/briefs/`                     |
| 2 | story-assist   | sonnet | 초안 작성 (lead 위임)                                           |
| 3 | design-lead    | opus   | `assets/sprites/`, `assets/tiles/`, `assets/bg/`, `docs/design/` |
| 4 | design-assist  | sonnet | 초안 작성 (lead 위임)                                           |
| 5 | dev-lead       | opus   | `src/*`, `game.js`, `index.html`                                |
| 6 | dev-assist     | sonnet | 한정된 서브시스템 (lead 위임)                                   |
| 7 | release-master | opus   | PR 검토/머지, 태깅, Pages sync, 워크플로우                      |

전체 정의는 [`.claude/agents/`](.claude/agents/) 참조. 운영 규칙은 [`CLAUDE.md`](CLAUDE.md) (영문) / [`CLAUDE.ko.md`](./CLAUDE.ko.md) (한글) 에서.

---

## 문서 다중언어 정책

- 사용자 노출 문서는 영문 `name.md` (정본) + 한글 `name.ko.md` (참조용) 두 버전으로 함께 머지.
- 코드 주석·식별자·튜닝 수치·코드 블록은 원문 유지.
- `.claude/agents/*.md` 는 영문 본문이 system prompt이므로 그대로 두고, 상단에 한국어 요약 섹션만 추가.
- 자세한 룰은 [CLAUDE.md](./CLAUDE.md) "Documentation policy" 또는 [CLAUDE.ko.md](./CLAUDE.ko.md) "문서 다중언어 정책" 참조.

---

## 라이선스

오리지널 코드는 MIT. 오리지널 아트와 오디오는 © 본 프로젝트 작성자. Wonder Boy 시리즈는 © Sega / LAT (구 Westone) — 본 프로젝트는 독립적인 팬 트리뷰트로, Sega/LAT와 어떠한 제휴/승인 관계도 없습니다.
