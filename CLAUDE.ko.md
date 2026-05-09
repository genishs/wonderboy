# Wonder Boy Tribute — 에이전트 하네스

> **English version:** [CLAUDE.md](./CLAUDE.md)

Sega의 1986/87년 Wonder Boy 시리즈에서 영감을 받은 팬 메이드 **오리지널** 액션 플랫포머.
**Vanilla JavaScript + HTML5 Canvas** 로 구현 (런타임 의존성 0, 빌드 도구 0).
**GitHub Pages**로 배포: https://genishs.github.io/wonderboy/.

> **포트가 아니라 트리뷰트.** 캐릭터 이름·스프라이트·오디오·세계관 모두 자체 제작한 오리지널입니다. 원작은 플레이어가 선생님을 보듯 학습하되 — 플랫포밍의 *형태*를 익히고, 그림은 우리 손으로 새로 그립니다.

---

## 기술 베이스라인

- Vanilla ES Modules + HTML5 Canvas 2D + Web Audio API
- 논리 해상도: 768 × 576 (4:3, 48 px 타일, 16 × 12 타일 뷰포트)
- 60fps 고정 타임스텝 루프 (`src/core/GameLoop.js`)
- ECS 골격은 `src/core/ECS.js`

---

## 브랜치 전략

```
release/gitpages  ← GitHub Pages 소스. quartile 릴리즈마다 main에서 fast-forward.
       ▲
       │ (release-master, quartile 태그 시점에만)
       │
      main          ← quartile 태그 전용. v0.25 / v0.50 / v0.75 / v1.0.
       ▲
       │ (release-master, develop이 다음 quartile에 도달할 때)
       │
   develop          ← 통합. 모든 feature/* PR은 여기로 들어옴.
       ▲
       │ (story/design/dev lead 들이 PR 형태로 올림)
       │
   feature/<team>-<topic>
```

### 브랜치 접두사

| 접두사              | 소유자                                                     |
|---------------------|------------------------------------------------------------|
| `feature/story-*`   | story-lead / story-assist                                  |
| `feature/design-*`  | design-lead / design-assist                                |
| `feature/dev-*`     | dev-lead / dev-assist                                      |
| `feature/release-*` | release-master (CI/릴리즈 도구, 브랜치 위생)                |

### Quartile 릴리즈 흐름

1. Phase 작업이 feature PR을 통해 `develop` 으로 들어옴.
2. quartile 기준이 충족되면 `release-master` 가 `release_pr.md` 로 `develop → main` PR을 오픈.
3. 머지 후 `main` 에 `v0.25` / `v0.50` / `v0.75` / `v1.0` 어노테이션 태그.
4. `git checkout release/gitpages && git merge --ff-only main && git push` — Pages 워크플로우가 자동 배포.
5. `docs/release-notes.md` (및 `.ko.md`) 에 섹션 추가.

| 태그  | 진척률 | 충족 조건                                                                          |
|-------|--------|------------------------------------------------------------------------------------|
| v0.25 | 25 %   | Phase 1: 주인공 + 적 ≥3종이 단일 테스트 스테이지에서 이동/공격, 콘솔 에러 0       |
| v0.50 | 50 %   | Phase 2: Area→Round 표 구성, 스테이지 전환, Area 1이 완성도 있게 플레이 가능       |
| v0.75 | 75 %   | 멀티 에리어 + 허기/무기 메카닉 + 패럴랙스 + 오디오 통합                            |
| v1.0  | 100 %  | 전체 콘텐츠 + 게임오버/컨티뉴 + 폴리시 + 모바일 컨트롤 검증                        |

---

## 7-에이전트 하네스

각 기능 영역은 **lead (Opus, 20년 경력 페르소나) + assist (Sonnet)** 한 쌍, 그리고 단일 **release-master** 로 구성.

| # | 역할           | 모델   | 브랜치 접두사       | 소유                                                          |
|---|----------------|--------|---------------------|---------------------------------------------------------------|
| 1 | story-lead     | opus   | `feature/story-*`   | `docs/story/`, `docs/maps/`, `docs/briefs/`                  |
| 2 | story-assist   | sonnet | (lead의 PR 아래)    | `_drafts/` 하위 초안                                          |
| 3 | design-lead    | opus   | `feature/design-*`  | `assets/sprites/`, `assets/tiles/`, `assets/bg/`, `docs/design/` |
| 4 | design-assist  | sonnet | (lead의 PR 아래)    | `_drafts/` 하위 초안                                          |
| 5 | dev-lead       | opus   | `feature/dev-*`     | `src/*`, `game.js`, `index.html`                              |
| 6 | dev-assist     | sonnet | (lead의 PR 아래)    | lead가 위임한 한정 서브시스템                                 |
| 7 | release-master | opus   | 머지 전용           | `.github/workflows/`, `.github/PULL_REQUEST_TEMPLATE/`, `docs/release-notes.md` |

정의는 `.claude/agents/` 안에. 각 lead는 `Agent` 도구로 자기 assist에게 한정된 서브 태스크를 위임 (sub-agent `Task` 스타일 호출). assist는 직접 push 또는 PR을 만들지 않습니다.

### 핸드오프 체인

```
story-lead   →  docs/briefs/phase*.md
                    │
                    ▼
design-lead  →  assets/sprites|tiles|bg/   (이 레포는 PNG 직접 커밋 안 함; 데이터 모듈만)
                    │
                    ▼
dev-lead     →  src/*  (브리프 + 자산 데이터 소비, 플레이 가능한 기능을 ship)
                    │
                    ▼
release-master  →  develop으로의 PR 검토 & 머지
```

---

## 자산 포맷 (Design ↔ Dev 계약)

에이전트가 작성한 바이너리 PNG는 ship 하지 않습니다. 스프라이트와 타일은 팔레트 인덱스의 JS 모듈, 배경은 SVG. 정식 스펙은 [`docs/design/contracts.md`](docs/design/contracts.md) (영문) / `contracts.ko.md` (한글, 게시 시점).

```js
// assets/sprites/<name>.js
export const PALETTE = ['#00000000', /* … hex (선택적 알파) … */];
export const FRAMES  = { idle: [/* h × w 의 인덱스 */], walk: [...], ... };
export const META    = { w, h, anchor: { x, y }, fps };
```

`src/graphics/SpriteCache.js` (dev-lead 책임) 가 로드 시점에 프레임마다 `OffscreenCanvas` 를 만듭니다.

---

## ECS 컴포넌트 계약 (변경 시 PR 본문에 한 줄 명시 필수)

```js
transform  : { x, y, w, h }
velocity   : { vx, vy }
physics    : { onGround, onIce, jumpHoldLeft }
player     : { facingRight, isJumping }
enemy      : { type, dir, ai, hp }
item       : { type, collected }
projectile : { type, lifetime }
sprite     : { sheet, frame }
boss       : { area, ai, hp, maxHp, timer }
```

---

## 로컬 개발

ES Modules 는 `file://` 에서 로드되지 않습니다. 로컬 정적 서버 사용:

```bash
npx serve . --listen 8080      # 또는: python -m http.server 8080
```

http://localhost:8080 에서 접속.

---

## 코딩 규칙

- Vanilla JS 만. 외부 런타임 라이브러리 없음. 커밋 코드에 CDN import 금지.
- ES6+ 모듈 / `class` / `const` / 화살표 함수.
- 파일 헤더 주석: 소유 에이전트 + 한 줄 TODO 요약.
- `TILE = 48` 은 코드베이스 전반에 고정 — 아키텍처 레벨 PR 없이는 변경 금지.
- Canvas 좌표: 좌상단이 원점, x→오른쪽, y→아래.

---

## 문서 다중언어 정책 (bilingual)

사용자 노출 문서는 두 언어로 ship: 영문 `name.md` (정본) + 그 옆에 한글 `name.ko.md`. 한글본은 프로젝트 오너의 빠른 가독성용; 영문본은 도구·에이전트·CI 검사가 따르는 정본.

- 산문만 번역. 코드 블록·파일 경로·식별자·튜닝 수치·고정값 표는 원문 그대로.
- 오리지널 이름 (Reed Bramblestep, Crawlspine, Glassmoth, Bristlecone Sapling, stoneflake, seeddart) 과 태그 이름 (v0.25, v0.25.1 …) 은 양쪽 버전 모두 원문 유지.
- 코드 주석·소스 헤더·`assets/sprites/*.js` 데이터 파일은 영문만.
- `.claude/agents/*.md` 는 영문 본문이 정본 (system prompt). 상단에 `## 한국어 요약` 섹션을 추가해 사람이 한눈에 파악 가능하게; 에이전트는 전체를 읽지만 영문 지시가 우선.
- 양쪽 언어의 새 문서는 PR 머지 전에 짝을 이루어야 함. release-master 가 리뷰에서 강제.

번역 대상이 **아닌** 파일:
- `assets/sprites/*.js`, `src/**/*.js`, 워크플로우 YAML, `package.json`, `index.html`, `.gitignore` 등.

---

## 저작권 자세 (꼭 읽어주세요)

본 프로젝트는 팬 트리뷰트입니다. 원작 스프라이트, 트레이싱, 참고 이미지의 색조 변형, 원작 BGM 샘플, 원작 캐릭터 이름의 직접 복제는 **금지**. 오리지널 실루엣, 팔레트, 이름, 오디오를 사용하세요. 의심스러우면 커밋 *전에* `release-master` 에 문의 — 직접 복제 냄새가 나는 자산은 릴리즈를 막습니다.

영감용 공개 자료를 참조했다면 `docs/story/research-notes.md` 에 URL과 가져온 항목 (거의 항상 *컨셉* 이지 픽셀이 아님) 을 기록.
