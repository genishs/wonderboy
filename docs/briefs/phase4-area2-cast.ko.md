# Phase 4 — Area 2 캐스트 브리프: the Cinder Reach (v1.0)

> **작성 agent:** story-lead
> **소비 agent:** design-lead, dev-lead
> **리뷰어:** release-master
> **연관 문서:** `docs/briefs/phase3-area1-expansion.md`, `docs/briefs/phase3-boss-cast.md`, `docs/briefs/phase4-audio.md`, `docs/story/world.md`
> **English version:** [phase4-area2-cast.md](./phase4-area2-cast.md)

본 브리프는 v1.0 릴리즈를 위해 v0.75.1 Area 1 (the Mossline Path) 위에 얹는 **Area 2 — the Cinder Reach** 를 정의합니다. (1) 에어리어의 서사 자세와 4-stage 진행, (2) FSM/튜닝 값과 함께 명세된 3종 신규 적, (3) Phase 3 Bracken Warden 과 동일한 충실도로 명세된 Area 2 보스 (**Reignwarden**), (4) 2종 신규 픽업 아이템을 다룹니다. 수치는 dev-lead 가 코드에서 튜닝할 *제안값*이며 비주얼 명세는 픽셀 단위 강제가 아닌 *의도*입니다.

> **트리뷰트이지 포팅이 아님.** 본 브리프의 모든 이름·실루엣·공격 패턴·아레나 비트는 본 프로젝트의 오리지널입니다. "다음 에어리어는 다른 바이옴, 새 캐스트, 보스 1체로 마무리" 구조는 액션 플랫포머의 보편적 컨벤션입니다. 본 구현은 오리지널 아트·오리지널 FSM·오리지널 오디오 큐만 사용합니다 (`phase4-audio.md` 참조). 원더보이 시리즈의 어떤 캐릭터·장소·적·보스 이름도 본 브리프에 등장하지 않습니다.

---

## 0. Area 2 가 게임 흐름에서 어디에 있는가

Area 1 은 Stage 1-4 (the Old Threshold 어두운 숲) 끝의 캐노피 글레이드에서 Bracken Warden 이 다시 누우면서 닫힙니다. v0.75 의 Area-Cleared 오버레이는 Stage 1 로 회기하고, v0.75.1 에서 Area 1 Stage 1 로 회기하도록 조정되었습니다. **v1.0 에서는 이 루프를 진짜 Area 1 → Area 2 전환으로 대체합니다.**

서사: Warden 이 다시 누웠을 때, 캐노피 사이로 한 줄기 새벽빛이 한 세대 만에 글레이드 바닥에 닿았습니다. Reed 가 그 빛을 따라 올라가니, the Old Threshold 가 줄곧 그 아래에 자리잡고 있던 절벽의 옆구리, **낡은 지그재그 산허리길**이 보였습니다. Verdant Ruin (Area 1) 은 움푹 패인 분지 안에 있었고, **그 위쪽 세계가 Reed 가 처음으로 올라가는 곳**입니다. 그 고지대 풍경이 **the Cinder Reach** — 한때 Ruin 의 사람들이 봉수를 세웠던, 바람에 깎인 능선입니다. Warden 이 자리를 잡기 전의 일입니다.

팔레트와 무드는 **Area 1 과 최대한 다르게**:

| 축              | Area 1 (Mossline Path)            | Area 2 (the Cinder Reach)                                   |
|----------------|-----------------------------------|-------------------------------------------------------------|
| 주조색         | 이끼 초록, 짙은 흙 위 새벽 호박색        | 골백색 돌, 새벽 호박색, 보스 구간의 잿불 장미빛                       |
| 빛             | 캐노피 사이로 거른 빛                | 머리 위 직사광, 스위치백마다 빛줄기                              |
| 지형           | 평탄~완만 숲, 슬로프                  | 오르막 테라스, 좁은 능선, 절벽 가장자리                            |
| 위험           | 물 틈, 결정 광맥, 어둠                | 바람 압력, 절벽 낙하, 잿불 구덩이 (보스 전용)                       |
| 분위기         | 닫힘, 친밀                          | 노출, 수직, 바람 소리                                            |

the Cinder Reach 는 **적대적이지 않습니다.** 공기가 그래서 바람이 부는 것이지, Reed 를 사냥하는 것이 아닙니다. 적들은 고지대의 *거주자* — Reed 가 올라오기 전부터 거기 있었습니다. 보스 (Reignwarden) 는 Bracken Warden 의 돌-잿불 쌍둥이로, 가장 높은 봉수대 위에 서 있습니다. 같은 자세 의도: *지키는 것이지 사냥하는 것이 아님.* 같은 마무리 비트: 패배 시 누워버립니다.

---

## 1. 4-stage 진행

Area 2 는 **4 stage** (에어리어 내부에서 1-4 로 번호 매김, dev-lead: stageIndex 는 각 에어리어마다 1 부터 시작; 플레이어가 보는 것은 bilingual stage 이름 오버레이입니다). 각 stage 는 Area 1 의 캐노피 글레이드에서 봉수대 정상까지의 등반을 이어갑니다.

| Stage | Internal name (영문)    | 한국어 (오버레이용)        | 테마와 지형                                                                                            |
|-------|------------------------|------------------------|------------------------------------------------------------------------------------------------------|
| 2-1   | The Switchback        | 산허리길                  | 등반 stage. 절벽을 지그재그로 오르는 돌계단. 아래는 이끼, 위는 메마름. 슬로프 위주. 오래된 나무 표지석 (장식). |
| 2-2   | The Beacon Walk       | 봉수대 옛길                | 트인 능선. 한쪽으로 절벽 낙하 위험 (water_gap 스타일 fatal 타일). 약한 가로 바람 (시각용 — 떠다니는 잿불 + 미세 팔레트 시프트). 능선 위에 봉수대 잔해. |
| 2-3   | The Knifing            | 협곡                     | 고지대 능선 등뼈를 가로지른 좁은 바위 협곡. 강한 바람 압력 (시각: 더 강한 잿불 표류). 에어리어 최대 적 밀도. 좁은 발판. |
| 2-4   | The Reignward          | 봉수대 마루                | 바람 없는 정상 평지. 오른쪽 끝에 봉수대 좌대 (아레나). 보스가 공격하면 아레나 바닥에 잿불 구덩이가 생김. 시야가 트이고, Verdant Ruin 전체가 아래로 내려다보임. |

**Stage 2-1 비주얼 노트 (design):** 왼쪽 절벽이 뷰포트 위로 솟아 있음 (높은 돌벽, 아래는 이끼, 위는 메마름 — 세로 그라데이션). 길에는 22°/45° 슬로프 타일로 지그재그를 만듦; 모서리는 평탄. **아래 3 타일 행은 area1-stage1 forest 타일셋 재사용** — Switchback 은 숲 가장자리에서 시작해 stage 중반에 트인 바위로 빠짐. 위쪽 타일 행은 새 **stone-terrace 타일셋** (자산 체크리스트 §6 참조). round 당 mile-marker 1개 (Stage 2-1 에 4개, Area 1 과 동일).

**Stage 2-2 비주얼 노트:** 광활한 능선. 배경 패럴랙스는 **먼 하늘 + 먼 산 + 가까운 메사** (캐노피 없음). 장식용 봉수대 잔해는 ~12-16 컬럼마다 (부서진 돌 아치, 돌에 박힌 새벽 호박색 렌즈 파편). 전경 타일은 **베어록(bare-rock) 발판 타일셋** (stone-bone 팔레트). **stage 전체에 걸친 절벽 낙하 위험:** ~8 컬럼마다 1-타일-폭 구덩이가 있고 가장자리는 `fatal` 타일 타입 (CombatSystem._heroVsFatalTile 에서 water_gap 처럼 처리). stage 전체: 플레이어 긴장은 유지하되 가혹하지 않게 — 발판 폭은 너그럽게 (최소 3-4 타일 간격).

**Stage 2-3 비주얼 노트:** 협곡은 양 옆에 바위 벽 (높은 세로 돌기둥; 중거리 패럴랙스가 2-2 보다 더 빡빡). 전경 타일은 **gully-floor 타일셋** (bare-rock 의 변종, 위쪽에 더 짙은 그림자). 적 밀도: stage 전체에 ~7-9 스폰 (Area 1 stage 평균 5-7). 여기서 Area 2 적 3종을 모두 섞어 씀. **새 위험 타일 없음** — 난이도는 적 밀도 + 좁은 발판 + 더 거센 바람 비주얼 (패럴랙스의 잿불 표류 가속).

**Stage 2-4 비주얼 노트:** 정상 평지. **보스 이전 구간은 8-10 타일 컬럼** — 플레이어가 봉수대 좌대 쪽으로 바람 없는 평지를 가로지름. 바닥은 **보스 타일셋** (더 따뜻한 새벽 호박색 돌, §6 참조). 장식 봉수대 잔해는 빽빽 (능선 정상의 의식적 장소). 배경 패럴랙스는 멀리 **Verdant Ruin 분지** (콜백) + 넓은 하늘 + 지평선에 봉수대 좌대 하나. 보스 아레나는 오른쪽 ~16 타일 컬럼; Area 1 처럼 trigger col 에서 카메라 잠금.

---

## 2. 3종 신규 적

Area 2 의 적 3종은 Area 1 의 트리뷰트 미학을 공유하지만 Mossplodder / Hummerwing / Threadshade 캐스트와 **시각·역학적으로 분명히 구별**됩니다. 빠른 요약:

| 적              | 역할                  | 이동                    | HP | 밟기 vuln? | 도끼 처치 |
|----------------|----------------------|------------------------|----|-----------|---------|
| Cinderwisp     | 바람에 떠다니는 표류체   | 사인 곡선, 왼쪽으로 느린 표류 | 1  | 가능       | 1 hit    |
| Quarrywight    | 갑옷 입은 지상 보행자    | 느린 보행, ~0.5× 속도     | 2  | **불가**    | 2 hits (첫 hit 는 갑옷 깨기) |
| Skyhook        | 절벽 낙하자             | FSM (perch → fall → walk) | 1  | 가능 (walking 단계만) | 1 hit |

### 2.1 Cinderwisp — 바람에 떠다니는 잿불 표류체

여름 정상의 잿불 구덩이에서 떠올라온, 무게 없는 작은 잿불 생물. **비주얼:** 가로 타원의 bracken-husk + 새벽 호박색 잿불 알갱이 묶음, ~24×24 px, 뒤에 두 가닥의 연기 잔영. 연기 잔영은 *고체로 보이지 않아야 함* — design 힌트: 잔영은 알파 값이 포함된 팔레트 인덱스 사용 (v0.75 moss-pulse 가장자리와 유사) + 2 프레임으로 1-2 px 뒤로 오프셋되며 애니메이션.

**이동:** 뷰포트 오른쪽 가장자리, 플레이필드 위쪽 1/3 의 무작위 세로 위치에 스폰. **왼쪽**으로 `drift_x_per_frame = 1.4 px` 표류하며 사인 곡선으로 흔들림 (`amp = 8 px, period = 60 frames`). 바람 변조: Stage 2-3 (the Knifing) 에서는 표류 속도와 흔들림 진폭이 모두 25% 증가. 왼쪽 뷰포트 가장자리 밖 2 타일 이상 벗어나면 despawn.

**피격 반응:**
- 도끼 hit → 1-hit kill. 사망 애니: 18 프레임에 걸쳐 3 프레임의 잿불 산란 (묶음이 4-6 개 작은 잿불로 갈라져 바깥으로 날아가다 사라짐), 이후 despawn.
- 영웅 밟기 → 1-hit kill. 같은 사망 애니 (위에서 묶음이 흩어짐).
- 밟기 없는 영웅 겹침 (접촉) → 영웅 hurt path (HuskSystem-equivalent loseLife flow). Cinderwisp 는 접촉 데미지, 발사체 데미지 아님.

**AI:** 순수 표류. 타게팅·추격·발사체 없음. 도전은 흔들림 곡선에 맞춰 점프 또는 던지기 타이밍 잡기.

**Design 가 작성할 sprite 프레임:**
- `drift` (3 frames, 6 fps) — 묶음이 약간 맥동; 잔영 오프셋.
- `dead`  (3 frames, 8 fps) — 잿불 산란.

**Hitbox 제안:** 18 × 16, 중앙.

### 2.2 Quarrywight — 갑옷 두른 돌 보행자

큰 술통 크기의 돌-갑옷 squat 인간형. **비주얼:** ~36×48 px, 등 굽은 실루엣, 넓은 어깨, 머리 없음 (머리는 어깨 갑옷에 묻혀 있음). stone-bone 팔레트에 팔꿈치 이끼 이음매. **두 비주얼 상태:** `armored` (멀쩡) 와 `cracked` (첫 도끼 hit 이후 — 가슴 갑옷에 대각선 균열, 사망까지 유지).

**이동:** **왼쪽**으로 `walk_x_per_frame = 1.2 px` (Mossplodder 의 약 0.5× 속도) 보행. 발판 가장자리에서 돌아서지 않음 — 절벽에서 떨어짐 (Stage 2-2 의 절벽 가장자리는 이를 활용하기 위한 의도적 hazard). 무거운 보행 애니 (4 frames @ 5 fps, 무게감 있게 디자인).

**피격 반응:**
- 도끼 hit (첫 번째) → `armored` → `cracked`. **8 프레임 hurt-flash 재생.** Quarrywight 는 계속 보행; 균열은 사망까지 유지.
- 도끼 hit (두 번째, `cracked` 상태) → 사망 애니. 30 프레임에 걸쳐 3 프레임의 갑옷 탈락 + 이끼 이음매 붕괴, despawn.
- 영웅 밟기 → **튕겨남**. Quarrywight 는 **밟기 무적**. 밟기 접촉 시 영웅이 위로 튕김 (Z-impulse equivalent) 하고 **데미지 없음**; Quarrywight 도 움직이지 않음. (Design tell: 튕기는 순간 어깨 갑옷 flash.) 이게 플레이어가 "여긴 밟기 안 됨" 을 학습하는 단서.
- 밟기 없는 영웅 측면 겹침 → 영웅 hurt path.

**AI:** 순수 좌향 보행. 회전·점프·발사체 없음. 도전은 Cinderwisp 가 플레이필드를 누비는 동안 Quarrywight 가 거리를 좁히기 전에 **도끼 2개** 를 박는 것. **런 최초의 멀티히트 적.**

**Design sprite 프레임:**
- `walk_armored`  (4 frames, 5 fps)
- `walk_cracked`  (4 frames, 5 fps) — 같은 실루엣, 균열 보임
- `hurt_armored`  (1 frame, overlay flash) — 더 밝은 갑옷 팔레트
- `hurt_cracked`  (1 frame, overlay flash) — 더 밝은 이음매 팔레트
- `dead`           (3 frames, 6 fps) — 갑옷 탈락 + 이음매 붕괴.

**Hitbox 제안:** 28 × 44, 중앙.

### 2.3 Skyhook — 절벽 낙하자

수정 발톱을 절벽에 박고 앉아있는 맹금류 같은 생물. **비주얼:** 앉아있을 때 ~32×36 px (콤팩트, 접힌 실루엣); 보행 시 ~32×36 (다리 펴짐). stone-bone 몸체 + 새벽 호박색 수정 발톱 하이라이트. 발톱이 시각적 시그니처; design 은 실루엣 스케일에서 발톱이 읽히게 할 것.

**이동 FSM:**
```
   perched ──(영웅이 trigger col 통과)──► triggered ──(20 프레임 windup)──► falling ──(발판에 착지)──► landed ──(15 frames)──► walking ──(화면 왼쪽 벗어남)──► despawn
```

- `perched` — 절벽 면 또는 봉수대 잔해 위 고정 `(col, row)` 에 앉음. trigger col 은 `hero_col + 6` (영웅이 좌측으로 6 타일 안에 들어오면 떨어짐). 한 번 trigger 되면 perch 는 소비 (Skyhook 은 다시 앉을 수 없음).
- `triggered` — 수정 발톱 flash (낙하 시각 텔레그래프) 20 프레임. Skyhook 는 아직 안 움직임.
- `falling` — **수직 강하**, `fall_y_per_frame = 4 px/frame` (terminal velocity). Skyhook 는 영웅을 수평 추적하지 않음. 낙하는 interruptible: `falling` 중 도끼 hit → 공중 사망.
- `landed` — Skyhook 발이 floor 타일에 접촉 (또는 지형과 충돌해 멈춤) → 15 프레임 서있음. `landed` 동안 hurtbox 활성.
- `walking` — `walk_x_per_frame = 1.6 px` (Mossplodder 보다 빠름) 으로 **왼쪽** 보행. 화면 밖 또는 처치까지 계속.

**피격 반응:**
- 도끼 hit (`triggered` 이후 모든 상태) → 1-hit kill. 사망 애니: 24 프레임에 걸쳐 3 프레임의 수정 산란 + 깃털 텀블.
- 영웅 밟기 (`walking` 동안만 유효) → 1-hit kill. `falling` 또는 `landed` 중 위에서의 영웅 겹침은 **영웅 hurt** (Skyhook 가 종속 속도로 떨어지는 중; 영웅이 위에서 착지 허용 안 함).
- `walking` 중 영웅 측면 겹침 → 영웅 hurt path.

**AI:** 트리거-드롭. Skyhook 는 위치 퍼즐: 영웅이 앉은 실루엣을 인식하고 (a) 후퇴 (진행 손실) 또는 (b) 낙하 전 도끼 던지기를 선택.

**Design sprite 프레임:**
- `perched`    (2 frames, 2 fps) — 가벼운 깃털 흔들림
- `triggered`  (3 frames, 6 fps) — 발톱 flash + 몸체 응축
- `falling`    (1 frame) — 날개 접고 몸 유선형
- `landed`     (2 frames, 4 fps) — 날개 펴기 + 발톱 안정
- `walking`    (4 frames, 6 fps) — 이족 보행 사이클
- `dead`       (3 frames, 8 fps) — 수정 산란 + 깃털 텀블

**Hitbox 제안:**
- `perched` / `triggered` — 24 × 28, 상단 중앙
- `falling`                — 22 × 32, 상단 중앙
- `landed` / `walking`     — 26 × 30, 상단 중앙

---

## 3. Area 2 보스 — the **Reignwarden**

Stage 2-4 아레나의 오른쪽 끝, 봉수대 좌대 위에 서 있는 인간형 콜로서스. Reignwarden 은 the Cinder Reach 의 **Bracken Warden 카운터파트** — 같은 `지키는-자세, 사냥-아님` 자세, 같은 FSM 모양, 그러나 완전히 다른 공격과 다른 실루엣.

> Bracken Warden 은 숲이 깨워서 일어났고, Reignwarden 은 한 번도 잠든 적이 없습니다. 아래 캐노피가 고요해진 만큼의 시간 동안 이 봉수대에 서 있었습니다. Reed 가 trigger col 을 건너면, Reignwarden 은 **좌대에서 움직이지 않습니다.** 팔을 들고, 봉수가 다시 켜집니다.

### 3.1 이름과 팔레트

**조어 어원.**
- *Reign* — 통치/왕권의 고대 영어 어근; 여기서는 *sovereign post* (능선 최고봉의 봉수) 를 지칭. 저작권 표현 아님.
- *Warden* — Bracken Warden 과 동일. 일반 영어. Bracken Warden 과 Reignwarden 은 *Warden* 접미사를 의도적 병렬로 공유 — 둘 다 한 장소의 수호자이지 공격자가 아님. 두 보스의 페어링은 v1.0 서사 비트의 하나.
- 합쳐서 **Reignwarden** 은 영문/한글 모두에서 읽힘 (한글 표기: **레인워든**, transliteration, `CLAUDE.md` bilingual 정책에 따라 이름 원문 유지).

**팔레트 (새벽 호박색 + 잿불 장미빛 + 골백색 돌).** Bracken Warden 이 돌 위 이끼 초록이었다면, Reignwarden 은 **돌 위 새벽 호박색**. 가슴 sigil 은 같은 따뜻한 호박색 (두 가문은 연결됨) 이지만 몸체 색은 골백색 돌 + 관절 균열에 사용되는 **잿불 장미빛** (새벽 호박색보다 살짝 차가운 빨강) 액센트. Design 힌트: Area 1 보스와는 새벽 호박색 sigil 에서만 겹치는 12-색 팔레트; 나머지는 이 보스 고유.

### 3.2 실루엣 의도

보스 아레나 오른쪽 끝, **2-타일-높이 돌 좌대 (봉수대 베이스)** 위에 서 있는 **standing humanoid colossus**. 치수: ~3 타일 폭 × 5 타일 높이 **좌대 포함** (좌대는 자산의 일부; 애니메이션 없음). 좌대 위 Warden 본체는 ~3 타일 폭 × 4 타일 높이.

좌대는 **월드에 고정** — design 은 좌대를 Stage 2-4 floor 타일과 매칭되는 돌 베이스에 명백히 새겨진 모양으로 그릴 것. Reignwarden 은 좌대 위에 서 있고, 발은 애니메이션 없음 (보행 없음).

**`idle`:** 몸체 곧음, 팔 가슴 앞 교차, 머리 수평. 가슴 sigil 흐릿. 헬름/얼굴의 슬릿 어두움. **자세는 "보초,"** "전사" 아님.

**`windup`:** 팔이 펴져 머리 위로; 가슴 sigil 이 밝은 새벽 호박색으로 flare; 헬름 슬릿도 같은 색으로 켜짐. 자세는 **팔 위, 손바닥 앞** — 잿불 볼리가 손바닥 사이에 모임. Design 힌트: `windup` 내내 손바닥 공간에 작은 새벽 호박색 입자 halo.

**`attack`:** 팔이 머리 위에서 모였다가 앞과 옆으로 휘둘러짐. sweep-forward 접촉 프레임에서 손바닥 위치에 **3개 잿불 발사체**가 빽빽한 다발로 스폰되어 바닥 방향으로 부채꼴 (§3.4 참조).

**`recover`:** 팔이 양 옆으로 떨어짐 (교차 아님 — `idle` 과 구별). 가슴 sigil 다시 흐려짐. Reignwarden 은 `recover` 동안 도끼 hit 에 가장 취약 — design 은 가슴 sigil 이 노출된 모양으로.

**`hurt`:** 10-프레임 stagger. 1-프레임 all-lighter 팔레트 swap (골백색 톤이 거의 흰색으로), 그 후 9 프레임 hold. `hurt` 중 좌대 위 움직임 없음.

**`dead`:** 머리가 앞으로 숙여지고; 팔이 떨어지고; 가슴 sigil 이 세 번 천천히 맥동 후 어두워짐. 마지막 30 프레임에 걸쳐 몸체가 좌대 위 무릎 자세로 낮춰짐 — **Bracken Warden 의 휴식 자세를 일부러 메아리 짚되, 바닥이 아닌 좌대 위.** 그 후 Area-Cleared 오버레이 흐름 발화.

### 3.3 이동 FSM — Bracken Warden 과 동일한 모양

```
        ┌───────── idle ──────────┐
        │ (서있음, 팔 교차)         │
        ▼                         │
   Reed 가 trigger col 통과? OR   │
   recover 타이머 만료?            │
        │ yes                     │
        ▼                         │
   ┌─────────┐  ~45 frames   ┌─────────┐  3-잿불 볼리 스폰   ┌──────────┐
   │ windup  │ ────────────► │ attack  │ ──────────────────►│ recover  │
   │ (팔     │               │ (팔     │                     │ (팔      │
   │  올라감)│               │  휘두름) │                    │  떨어짐)  │
   └─────────┘               └─────────┘                     └────┬─────┘
                                                                   │ (~90 frames)
                                                                   ▼
                                                                  idle

   non-dead 모든 상태 ── 도끼 hit ──► hurt ── (~10 frames) ──► 이전 상태
   모든 상태 ── 9번째 도끼 hit ────► dead   (terminal)
```

튜닝 (제안):
- `bossArenaTriggerCol` — 보스 등록 시 stage 별 설정 (Stage 2-4 전용).
- `idleFrames` ≈ 60
- `windupFrames` ≈ 45 (플레이어 반응창)
- `attackFrames` ≈ 18 (~12 프레임에 잿불 볼리 스폰)
- `recoverFrames` ≈ 90 (도끼 취약)
- `hurtFrames` ≈ 10
- `hp` = **9** (Bracken Warden 의 6 보다 1 많음; 의도적 상승)

### 3.4 공격 패턴 — **잿불 볼리**

기본 공격 1종. `windup` 팔 올림 + 가슴 sigil flare 로 텔레그래프. 볼리는 `attack` 안의 단일 접촉 프레임에서 스폰.

**볼리:** Reignwarden 손바닥 위치에 3개 작은 **잿불 발사체**가 빽빽한 다발로 스폰, 아레나 바닥을 향해 세 다른 각도로 부채꼴.

- 잿불 1 — 좌하향 각 (~수평-우 기준 205°), `speed = 4.5 px/frame`
- 잿불 2 — 정-하향 각 (~270°), `speed = 4.0 px/frame`
- 잿불 3 — 좌하향 더 평평한 각 (~190°), `speed = 5.0 px/frame`

잿불은 **중력 변조 탄도 곡선**으로 비행 — 시작 빠름, 중력이 `0.18 px/frame²` 으로 끌어내림. 잿불들은 아레나의 세 다른 바닥 위치에 착탄 (잿불 3 은 Warden 근처, 잿불 1 은 아레나 중간, 잿불 2 는 Warden 발밑 — design 힌트: 좌대 바로 왼쪽 1 타일 폭 안전지대가 있되, 그것도 windup-into-attack 창 동안만; 잿불 착탄 후엔 그 자리에 구덩이).

**바닥 접촉 시:** 각 잿불은 착탄 위치에 **잿불 구덩이 위험 타일** 을 스폰. 구덩이는 `~120 프레임` (~2 초) 동안 `fatal` 타일 타입, 이후 소멸. 활성 중에는 잿불 입자 (4 frames @ 8 fps; design 힌트: 위로 표류하는 빨강-주황 입자) 로 시각 마킹. 영웅 접촉 시 fatal-tile 경로 발화 (사망 + loseLife).

**잿불은 도끼로 직접 처치할 수 없음.** 순수 발사체, 비행 중에만. 위험은 플레이어가 피해야 할 것; 원천 (Reignwarden) 이 플레이어의 타겟.

**Design/dev 용 타일 좌표 힌트:** 보스 좌대는 `arenaCol = arenaWidthCols - 4` (아레나 오른쪽 가장자리에서 4 타일 안쪽). 잿불 볼리 타겟은 대략:
- 잿불 1 → `arenaCol - 5` (좌대 5 타일 좌)
- 잿불 2 → `arenaCol - 1` (좌대 1 타일 좌 — Warden 발밑)
- 잿불 3 → `arenaCol - 3` (좌대 3 타일 좌 — "trap" 좁은 지대)

아레나는 16 타일 컬럼 폭 (전 뷰포트). 영웅은 좌대 앞 대략 10 타일 컬럼의 이동 가능한 바닥을 가짐, 각 볼리마다 위 3 위치에 잿불 구덩이가 열림.

### 3.5 피격 반응 및 사망

- **도끼 hit** → `hurt` 오버레이 (10-프레임 stagger). HP -1. `hurt` 가 끝나면 state machine 은 직전 상태로 복귀. Reignwarden 은 stunlock 불가 — `windup` 과 `recover` 는 취소 불가. 플레이어 최적창은 `recover` (가장 긴 상태, sigil 노출).
- **HP 0** → `dead`. 사망 애니 60 프레임 (sigil 맥동 + 무릎 자세), 이후 Area-Cleared 오버레이 흐름 발화 (§6).

**`attack` 중 도끼 hit 으로 잿불 볼리 취소 불가.** 볼리가 스폰되면 날아감. `windup` 중 잘 맞춘 도끼는 hurt-stagger 를 일으켜 공격을 **지연**시킴 (hurt 발화 시점부터 재개; 잿불 스폰 타이머는 재시작 아닌 현재 프레임에서 계속).

### 3.6 아레나 레이아웃

| 항목                  | 위치 / 사양                                                                                          |
|----------------------|------------------------------------------------------------------------------------------------------|
| 아레나 폭             | 16 타일 컬럼 (전 뷰포트)                                                                              |
| 아레나 바닥           | 단단한 골백색 돌, flat 타일 1 행 (슬로프·구덩이 없음, 보스 공격 전까지)                                  |
| 카메라                | trigger col 에서 잠금 (전투 중 우측 스크롤 없음)                                                       |
| 보스 스폰 위치        | `bossY = arenaFloorRow * TILE - bossH - pedestalH` (좌대 위; 좌대는 2 타일 행 높이)                  |
| 영웅 시작 위치        | 아레나 왼쪽, 좌측 가장자리에서 ~2 타일 컬럼                                                            |
| 위험                  | 잿불 볼리가 스폰하는 잿불 구덩이 (transient, ~2 초). 영구 위험 없음.                                   |
| 음악                  | `boss-fight` BGM (`phase4-audio.md` §1.3 참조)                                                        |
| 출구                  | 보스 사망 시 → Area-Cleared 오버레이 → 다음 에어리어/크레딧 전환                                       |

### 3.7 승리 조건

- vitality 0 도달 전 Reignwarden 에 도끼 9 hit → 보스 사망 애니 → Area-Cleared 오버레이.

### 3.8 패배 조건

- 영웅이 잿불 볼리 구덩이 (fatal 타일) 접촉 → loseLife. 카메라는 잠긴 채; 영웅은 full vitality 로 아레나 진입 컬럼에서 respawn. **Lives 는 refill 되지 않음** (Area 1 과 같은 Continue 모델).
- Reignwarden 본체로부터 contact damage (좌대 바로 아래 서있으려 하면 — design 힌트: 좌대 자체는 contact hitbox 없으나, `attack` sweep 중 Warden 발은 contact hurtbox) → loseLife.
- low-vitality 사망 → loseLife.

lives 0 도달 → `GAME_OVER` → `state.continueRun()` → `RESPAWNING` → `AreaManager.startArea(2)` (아레나 직접 아닌 Stage 2-1 부터 재진입).

---

## 4. 2종 신규 픽업 아이템

| 픽업       | 효과                                | 스프라이트 크기 | Stage    |
|-----------|------------------------------------|----------------|----------|
| Sunpear   | +50 vitality (런 최고 음식)         | 36×36          | Stage 2-2 |
| Flintchip | 도끼 화면 cap 2 → 3 약 10초 (transient buff). stage 전환 시 클리어. | 24×36 | Stage 2-3 |

### 4.1 Sunpear

Stage 2-2 (the Beacon Walk 능선) 의 봉수대 잔해에 매달려 있는 둥글둥글한 금빛 껍질 과일. amberfig 보다 더 밝은 팔레트; Sunpear 는 런 최고 밝기 음식. **비주얼:** 약간 배 모양으로 가늘어지는 구체, ~36×36 px, 새벽 호박색 외피 + 햇볕 쪽 잿불 장미빛 홍조. idle 3 프레임 @ 4 fps (가벼운 광택 시프트).

**효과:** +50 vitality (amberfig 와 동일 — Sunpear 는 amberfig 의 the Cinder Reach 카운터파트; design 팔레트와 실루엣은 다르되 기능은 동일). Stage 2-2 봉수대 잔해 (col ~32, stage 중반) 에 1개 배치.

**ItemSystem 통합:** `pickup.type === 'sunpear'` 케이스 추가. SpriteCache 키 `sunpear`.

### 4.2 Flintchip

작은 새벽 호박색 결정 파편, ~24×36 px (얇고 김, 다듬은 부싯돌 청크 같음). **비주얼:** 반투명 새벽 호박색 결정 + 잿불 장미빛 결 무늬; idle 2 프레임 @ 3 fps (부드러운 내부 광택 맥동).

**효과 (transient buff):** 활성 중 화면 도끼 cap 이 2 에서 3 으로 증가 — Reed 가 동시에 3개의 도끼를 공중에 띄울 수 있음. 지속: **약 10초 real-time** (600 프레임 @ 60fps). 600 프레임 후 buff 만료, cap 은 2 로 복귀. **buff 는 stage 전환 시 클리어** — Stage 2-3 에서 줍더라도 보스 전투로 캐리되지 않음.

**활성 buff 시각 텔레그래프:** Reed 의 도끼 발사체 스프라이트가 buff 지속 동안 더 밝은 팔레트 (새벽 호박색 내부-flash) 로 시프트. HUD: lives 표시 옆 작은 Flintchip 아이콘 + 카운트다운 바 (10초). Design 은 sprite 와 HUD 아이콘 변종 (16×16) 모두 제공.

**배치:** Stage 2-3 (the Knifing) 에 1개, stage 중반, 리스크 보상 위치 (Skyhook perch 근처 또는 Quarrywight 사이).

**ItemSystem 통합:** `pickup.type === 'flintchip'` 케이스 추가. State carry: player 컴포넌트에 buff 상태 저장 (`pl.flintchipFrames`). HatchetSystem 이 `pl.flintchipFrames > 0` 읽어 화면 cap 결정. `AreaManager.swapToNextStage` / `_loadStage` 에서 `pl.flintchipFrames` 클리어.

---

## 5. Stage 2-1 — Mossline-Path-to-Cinder-Reach 전환

Stage 2-1 (the Switchback) 은 the Old Threshold 어두운 숲 (Area 1 Stage 1-4 끝) 에서 트인 고지대 (Stage 2-2 이후) 로 **비주얼 브릿지** 가 필요. v1.0 의 가장 단순한 구현:

- Stage 2-1 은 **숲 가장자리**에서 시작 (왼쪽 마지막 4 컬럼의 forest 타일셋).
- 중간 16-20 컬럼은 **숲-돌 혼합** — 돌 계단 타일 위 이끼 패치, 스위치백 모서리 가끔 bracken-frond 장식.
- 마지막 12-16 컬럼은 **순수 stone-terrace** — forest 장식 없음, 패럴랙스에 열린 하늘.

**재사용 정책:** Stage 2-1 은 왼쪽 ~16 컬럼의 바닥 3-타일 행에 대해 `area1-stage1-forest` 타일 타입 재사용 가능. 새 **stone-terrace** 타일셋 (§6 참조) 이 나머지를 덮음. Stage 2-1 패럴랙스는 왼쪽 (캐노피 파편) 에서 오른쪽 (트인 하늘) 으로 전환 — design 은 그라데이션 SVG 한 장, 또는 SVG 두 장 + scrollX 기반 crossfade 선택 가능.

---

## 6. 자산 체크리스트 (design-lead)

### Sprites

| 자산                            | 치수          | 프레임                                                                                  |
|--------------------------------|---------------|-----------------------------------------------------------------------------------------|
| enemy-cinderwisp.js            | 24×24         | drift (3 @ 6fps), dead (3 @ 8fps)                                                       |
| enemy-quarrywight.js           | 36×48         | walk_armored (4 @ 5fps), walk_cracked (4 @ 5fps), hurt_armored (1), hurt_cracked (1), dead (3 @ 6fps) |
| enemy-skyhook.js               | 32×36         | perched (2 @ 2fps), triggered (3 @ 6fps), falling (1), landed (2 @ 4fps), walking (4 @ 6fps), dead (3 @ 8fps) |
| boss-reignwarden.js            | 144×240 (좌대 포함 3w × 5h tiles) | idle (2 @ 2fps), windup (4 @ 8fps), attack (3 @ 10fps), recover (3 @ 5fps), hurt (1), dead (4 @ 4fps) |
| projectile-cinder.js           | 12×12         | flight (3 @ 10fps, 비행 중 loop), impact (3 @ 8fps, 바닥 접촉 시 1회) |
| item-sunpear.js                | 36×36         | idle (3 @ 4fps)                                                                          |
| item-flintchip.js              | 24×36         | idle (2 @ 3fps); HUD 변종 16×16 (1 frame static)                                        |

### Tilesets

| 자산                              | 노트                                                                                       |
|----------------------------------|--------------------------------------------------------------------------------------------|
| tiles/area2-stage1-switchback.js | Stone-terrace 타일 (flat + 22°/45° 슬로프 변종). cols 0-15 용 mossy-bottom 변종.            |
| tiles/area2-stage2-beaconwalk.js | bare-rock 발판 타일 + cliff-edge 변종 + fatal-pit 변종 (water_gap 과 팔레트 구별). 봉수대 잔해 장식 타일 (16×16, floor 타일 위에 얹음). |
| tiles/area2-stage3-knifing.js    | gully-floor 타일 (어두운 돌, 좁음). fatal 타일 없음. rock-wall 변종. |
| tiles/area2-stage4-reignward.js  | 따뜻한 새벽 호박색 돌 타일 + 좌대 타일 (16×16, 봉수대 베이스용 2-타일-행 composite). |

### Parallax SVGs (stage 당 3 layer)

| Stage | Far layer            | Mid layer              | Near layer                |
|-------|----------------------|------------------------|---------------------------|
| 2-1   | sky-with-canopy-bleed | distant-cliffs         | switchback-stones-near    |
| 2-2   | distant-mountains    | far-mesa               | beacon-tower-wrecks-near  |
| 2-3   | sky-narrow-strip     | rock-wall-mid          | rock-wall-near-tighter    |
| 2-4   | full-sky-with-ruin-below | beacon-pedestal-far | beacon-tower-wrecks-near  |

**신규 SVG 총 12장.** v0.75.1 Area 1 stage 와 동일한 패럴랙스-레이어 아키텍처.

### 팔레트 가이드

- **stone-bone:** `#e6e1d8` (highlight), `#bdb7a7` (mid), `#8e8878` (shadow), `#6a6457` (deep)
- **dawn-amber (Area 1 보스와 공유):** `#f8d878` (highlight), `#e4b25c` (mid), `#a87838` (shadow)
- **ember-rose (NEW, Area 2 전용):** `#f49494` (highlight), `#cc6464` (mid), `#882c2c` (deep) — 잿불 구덩이, 잿불 발사체, Reignwarden 관절 액센트
- **dawn-amber-glow (입자용 알파):** `#f8d87880` (40%), `#f8d878c0` (75%) — sigil/halo/glow

자산 당 12색이 상한 (Phase 3 spec 동일). 대부분 자산은 6-8 색으로 ship 가능.

---

## 7. Dev 통합 (dev-lead)

### 7.1 AreaManager 일반화

현재: `AreaManager` 는 `import { buildStage } from './area1/index.js'` 로 Area 1 에 하드코딩. v1.0 에서는 `areaIndex` 기반 디스패치 필요:

- `buildStage` import 를 per-area registry 로 이동, 또는 top-level `src/levels/buildStage.js` 가 `areaIndex` 로 switch.
- `AreaManager.startArea(areaIndex)` 는 이미 파라미터 수용 — build path 까지 wiring.
- `AreaManager._loadStage` 가 `tileCache.setActiveStage(stageIndex, areaIndex)` 로 area 별 타일셋 해석 — TileCache 도 per-area 디스패치 필요 (Stage 1-1 vs Stage 2-1 은 다른 타일 키 사용).
- `ParallaxBackground.setStage(stageIndex)` 도 `areaIndex` 필요.

### 7.2 Area 1 → Area 2 전환

현재: Bracken Warden 사망 후 `AreaManager.beginAreaCleared()` 가 Area-Cleared 오버레이 발화. v0.75.1 에서는 같은 에어리어 Stage 1 로 회기.

v1.0:
- Area 1 의 Area-Cleared 오버레이 dismiss 시 `startArea(1)` 대신 `startArea(2)` 호출.
- Area 2 의 Area-Cleared 오버레이 dismiss 시 새 **`CREDITS`** 상태 발화. 크레딧이 ~12초 스크롤 후 `TITLE` 로 dismiss.

### 7.3 적 시스템

- **Cinderwisp:** `Phase2EnemyAI` 의 spawn handler (또는 명확하다면 새 `Area2EnemyAI`). 사인 path 이동. 바람 변조 계수는 per-stage 상수에서 읽음. Threadshade 와 같은 enemy 컴포넌트 모양 (`enemy.type === 'cinderwisp'`).
- **Quarrywight:** spawn handler + 좌향 보행 + 첫 hit 갑옷 제거 로직. 컴포넌트에 `enemy.armored` bool 추가; `CombatSystem._hatchetVsEnemy` 가 갑옷 먼저 감소, 다음 HP. Renderer 의 스프라이트 프레임 선택은 `enemy.armored ? 'walk_armored' : 'walk_cracked'` 읽음.
- **Skyhook:** spawn handler + FSM. `enemy.aiState` 추가로 FSM phase 추적. `Phase2EnemyAI.update` 에서 trigger col 체크. 낙하 물리: `aiState === 'falling'` 동안 `velocity.vy = 4`. 착지 감지: floor 타일 충돌 → `aiState = 'landed', timer = 15`. 보행 단계는 Mossplodder 로직과 동일.

### 7.4 보스 시스템

- **Reignwarden:** `boss.area === 2` 키 잡힌 새 `BossSystem` 분기. FSM 은 Bracken Warden 과 동일-모양, 공격 핸들러는 moss-pulse spawn 대신 cinder-volley spawn. 잿불 물리: 독립 중력 변조 궤도. 잿불 바닥 충돌: TileMap mutation 으로 `ember-pit` fatal 타일 스폰 (v0.75 fatal-tile 패턴 복제).
- **잿불 구덩이 위험:** 새 타일 타입 `EMBER_PIT` 추가 (또는 일반화하면 `FATAL_TRANSIENT` 재사용). Transient: 타일별 120-프레임 TTL 저장. Renderer 가 잿불 입자 프레임으로 애니메이션.

### 7.5 오디오 wiring (전체 spec 은 `phase4-audio.md`)

- 타이틀 화면 진입 시 `AudioManager.playBGM('title')`.
- Area 1 진입 시 `AudioManager.playBGM('area1')` (이미 있음).
- Area 2 진입 시 `AudioManager.playBGM('area2')` (NEW).
- 보스 아레나 진입 시 `AudioManager.playBGM('boss-fight')` (NEW, Area 1 + Area 2 둘 다 — 현재 Area 1 은 보스 전용 BGM 없음).
- `GAME_OVER` 진입 시 `AudioManager.playBGM('game-over')`.
- `phase4-audio.md` §2 의 22 이벤트에서 `AudioManager.playSFX(<name>)`.

### 7.6 Polish (game-over / title / credits)

- **타이틀 화면:** "WONDER BOY / LEGACY REBIRTH" 텍스트를 상표를 직접 재현하지 않는 트리뷰트-톤 라벨로 변경. 권장 (story-lead 결정): line-1 = **"WONDER BOY TRIBUTE"** (repo README 와 일치), line-2 = **"The Mossline Path"** 서브타이틀. 트리뷰트 자세를 화면에서 읽히게.
- **Game-over 화면:** 현 "GAME OVER" + bilingual "Press any key to continue" / "아무 키나 눌러 계속" 유지. 런 통계로 현 Area·Stage 표시 1줄 추가 (예: "Area 2 — Stage 2-3").
- **Credits 화면 (NEW):** Area 2 클리어 후 발화. ~12초 스크롤 텍스트. 내용: 프로젝트 크레딧 + 특정 저작물 명시 없이 원작 팀에 대한 짧은 감사 노트 (§8 참조).

---

## 8. IP 안전성 노트 (release-master)

- **본 브리프에 원더보이 캐릭터 이름은 등장하지 않습니다.** 모든 이름 (Reignwarden, Cinderwisp, Quarrywight, Skyhook, Sunpear, Flintchip, Cinder Reach, the Switchback, the Beacon Walk, the Knifing, the Reignward) 은 본 프로젝트의 조어.
- **원더보이 보스 실루엣은 재현하지 않음.** Reignwarden 은 좌대 위 standing humanoid colossus — 보편 실루엣 컨벤션. 특정 참고 자산을 사용하지 않음.
- **크레딧 화면**은 "the spirit of 1986/87 platformers" 같은 일반 표현 사용; 특정 저작물·캐릭터 이름·오리지널 BGM 트랙명을 참조하지 말 것.
- **잿불 볼리 공격**은 우리가 인지하는 어떤 특정 참고 보스 공격과도 의도적으로 구별됨. 3-잿불 부채꼴 + transient floor hazard 패턴은 보편 액션 플랫포머 어휘.

---

## 9. 튜닝 요약

```js
// Cinderwisp
drift_x_per_frame:        1.4   (Stage 2-3: 1.75)
bob_amp_px:               8     (Stage 2-3: 10)
bob_period_frames:        60

// Quarrywight
walk_x_per_frame:         1.2
armor_hits:               1     (첫 도끼 hit 갑옷 깨기)
total_hp:                 2     (도끼 2 hit kill)

// Skyhook
trigger_distance_tiles:   6
windup_frames:            20
fall_y_per_frame:         4
landed_frames:            15
walk_x_per_frame:         1.6

// Reignwarden boss
hp:                       9
idle_frames:              60
windup_frames:            45
attack_frames:            18    (~12 프레임에 잿불 볼리 스폰)
recover_frames:           90
hurt_frames:              10
cinder_speed_1:           4.5
cinder_speed_2:           4.0
cinder_speed_3:           5.0
cinder_gravity_pps:       0.18  (px/frame²)
ember_pit_ttl_frames:     120

// Flintchip buff
flintchip_duration_frames: 600  (10초 @ 60fps)
flintchip_hatchet_cap:     3    (기본 2)
```

---

## 10. Cross-references

- `docs/briefs/phase3-area1-expansion.md` — Area 1 4-stage spec (Area 2 의 템플릿).
- `docs/briefs/phase3-boss-cast.md` — Bracken Warden spec (Reignwarden 의 템플릿).
- `docs/briefs/phase4-audio.md` — v1.0 BGM + SFX 의 Web Audio 합성 spec.
- `docs/story/world.md` — 세계관 lore (Verdant Ruin, 캐노피 글레이드, the Cinder Reach 맥락).
- `docs/design/contracts.md` — sprite/tile/parallax 데이터 계약 (v1.0 에서 변경 없음).
- `src/levels/AreaManager.js` — 최상위 Area lifecycle (Area 2 wiring 필요).
- `src/audio/AudioManager.js` — Web Audio 스캐폴드 (Area 2 + boss-fight + title + game-over BGM 추가; 22 SFX wiring).

---

**Approved by user for autonomous v1.0 development.**
