# 미리보기 — `assets/sprites/projectile-moss-pulse.js`

> **영문 원본:** [`preview-projectile-moss-pulse.md`](./preview-projectile-moss-pulse.md)

| 항목         | 값                                                   |
|--------------|------------------------------------------------------|
| 경로         | `assets/sprites/projectile-moss-pulse.js`            |
| 크기         | 24 × 16 아트-픽셀                                    |
| Anchor       | `{ x: 12, y: 15 }` (하단 중앙, 바닥 라인)            |
| FPS          | 8                                                    |
| 팔레트       | 9 항목                                               |
| 총 프레임    | 1 애니메이션 (`travel`)에서 3 프레임                 |

moss-pulse는 Bracken Warden의 주공격: `attack` 임팩트 프레임에서 Warden의
발 옆에 스폰되는 바닥-밀착 충격파, 아레나에서 LEFT로 -3.5 px/frame 속도로
Reed를 향해 이동, 아레나 좌측 벽이나 도끼 접촉에서 디스폰 (상호-디스폰).
전체 공격 패턴은 `docs/briefs/phase3-boss-cast.md` §4 참조.

## 최종 치수와 방향

**24 × 16 아트-픽셀** — 유저 프롬프트의 제안 ("1 타일 폭, 반-타일 높이")
그대로. TILE = 48에서 moss-pulse는 ~48 × 32 캔버스 px ≈ 1 타일 × 반-타일
로 렌더링. 스프라이트는 기본적으로 LEFT-FACING으로 그려져 있다 — 선두 파면
(wavefront)이 매트릭스의 LEFT 측, 트레일링 가장자리가 RIGHT 측. **렌더러
는 이 스프라이트를 미러링하지 않는다** — moss-pulse는 항상 아레나에서
왼쪽으로 이동하기 때문.

## Anchor

`{ x: 12, y: 15 }` — 하단 중앙, 바닥 라인. 파동은 바닥-밀착; dev-lead가
발사체 엔티티를 아레나 바닥 행에 두면, 렌더러는 스프라이트의 하단 중앙을
그 행에 정렬한다. 파형은 바닥에서 위로 구성된다.

## 애니메이션

### `travel` — 3 프레임, 8 fps (활성 동안 루프)

파동은 굴러가는 이끼-빛 wavefront로 읽힌다: 왼쪽의 키 큰 선두 가장자리
글로우, 파동 베이스의 내부 amber 띠, 그리고 오른쪽 측면에서 velvet
under-flame을 거쳐 pillar-shadow-violet으로 페이드하는 트레일링 그라운드-
블러. crest 입자 (moss-green-dark + bracken-frond-deep 점)가 매 프레임
선두 가장자리에서 약간씩 다른 위치로 위쪽으로 튀어 올라, 파동에 굴러가는
시각적 텍스처를 부여한다.

- **`travel0`** — 선두 가장자리 키 큼 (rows 2-12, cols 1-5); crest 입자
  cols 4-15. 내부 amber 띠 rows 7-12, pale-gold 코어 클러스터 cols 3-6
  중심. 트레일이 cols 13-22 에 걸쳐 velvet under-flame (row 13)에서
  pillar-shadow-violet (row 14)을 거쳐 오른쪽 가장자리의 투명으로 페이드.
- **`travel1`** — 선두 가장자리가 조금 짧음; crest 입자가 다른 위치 (col
  5, 11, 12)에서 다시 튀어 오름. 내부 amber 띠 셀이 약간 이동.
- **`travel2`** — 선두 가장자리가 다시 높아짐; 내부 스파크가 베이스에서
  pale-gold로 밝아짐 (rows 8-12). 트레일링 컬에서 새 입자가 튀어 오름.
  F0→F1→F2→F0 루프가 8 fps에서 아레나 바닥을 가로지르며 왼쪽으로 이동
  하는 연속 굴러가는 파동으로 읽힌다.

## 시각적 정체성

보스 브리프 §4 "Wave visuals"에 따라:
- **선두 면** — 이끼-돌 입자의 짧은 위쪽 분출 (1-타일-높이, 스프라이트
  왼쪽). 선두 wavefront는 가장 밝고, 가장 articulated된 가장자리 — Reed
  가 다가오는 것을 보는 파동의 "얼굴".
- **내부 글로우** — 파동 베이스의 dawn-amber, 가장 밝은 스파크 지점의
  pale-gold. 이것은 Warden의 chest sigil의 따뜻함이 바닥을 따라 이동하는
  것. `attack` 중 Warden의 sigil 플레어와 시각적 운율을 맞춘다.
- **트레일링 가장자리** — velvet under-flame과 pillar-shadow-violet이
  선두 면 뒤로 ~10 셀에 걸쳐 페이드. 트레일은 "바닥으로 페이드하는 연기"
  로 읽힌다 — world.md에 따라 순흑 없음.

## 결정 기록 — 별도 `despawn` 애니메이션 없음

보스 브리프 §10 자산 표는 2-프레임 `despawn` 애니메이션 슬롯을 언급한다.
**이 리비전에서 보내지 않음.** 사유: 브리프 §4 산문은 "wave despawns on
contact" 만 명시하고 명시적 시각은 없음; 가장 깔끔한 구현은 dev-lead가
상호-디스폰 또는 좌측 벽 접촉에서 한 렌더 스텝 동안 마지막 `travel` 프레
임을 알파-페이드하는 것 — v0.50 hatchet-despawn 처리와 일치 (hatchet도
`despawn` 애니메이션이 없다 — 그냥 렌더링을 멈춘다). 플레이테스트에서
디스폰 순간이 시각적으로 불분명하다고 드러나면, 후속 PR에서 1-2 프레임
`despawn` 클러스터를 추가할 수 있다; FRAMES export는 평범한 객체이므로
추가는 non-breaking.

## 이전 페이즈와의 팔레트 겹침

9개 hex 중 8개는 Phase 1 / 2 / Phase 3에서 그대로 재사용. 이 스프라이트
가 도입하는 한 **신규 Phase 3 hex**는 `#a4d098` (moss-pulse 선두 가장자
리) — wavefront에 특유의 "이끼-빛" 글로우를 부여하는 옅은 녹-금색.

## 교차-스프라이트 일관성 메모

파동의 amber 베이스 + violet 트레일은 Phase 2 cast 브리프에서 호명된
**warm-spark-falls-cool** 화음을 반영 — 플레이어가 따뜻함이 보라색으로
페이드되는 것을 보면, Warden이 생성한 엔티티 (보스 sigil, sigil-flare 헤
일로, moss-pulse wave-base)를 보고 있는 것. moss-pulse는 wavefront 정체
성을 위한 한 새 녹색 hex로 이 화음을 확장한다.

파동의 실루엣 잉크 (`#3a2e4a`)는 Warden의 실루엣 잉크 및 보편 Phase 1/2
잉크와 일치: moss-pulse와 Warden이 화면을 공유할 때, 플레이어는 그들을
하나의 결합된 이벤트-쌍으로 읽는다.
