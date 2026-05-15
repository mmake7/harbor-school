# 다오니 시뮬레이터 — Design System

> 톤: 모던 도시농부 — 화이트 + 신선 그린 + 시즌 액센트.
> Light mode only (Day 1).

---

## 1. 컬러 토큰

| 토큰 | Hex | 용도 |
|---|---|---|
| Base | `#FFFFFF` | 전역 배경 |
| Surface | `#F4F7F5` | 카드·패널 배경 |
| Primary | `#10B981` | 핵심 액션·다온이 도트 (Emerald) |
| Primary Dark | `#047857` | hover · 강조 |
| Primary Light | `#ECFDF5` | 가벼운 강조 배경 |
| Ink | `#0F172A` | 본문 텍스트 · 다온이 발화 카드 배경 |
| Muted | `#64748B` | 부가 텍스트 |
| Muted Light | `#94A3B8` | 더 옅은 부가 텍스트 |
| Border | `#E2E8F0` | 기본 테두리 |
| Border Strong | `#CBD5E1` | 강조 테두리 |
| Hanji Bg | `#FAF7F0` | 브랜드 자산 배경 (명함·메뉴판·포스터) |
| Hanji Border | `#E5DDD0` | 한지 배경 위 테두리 |

## 2. 시즌 액센트 (작물 결정 시 자동 적용)

| 분기 | 작물 | Hex |
|---|---|---|
| Q1 | 딸기 | `#FF4757` |
| Q2 | 블루베리 | `#4F46E5` |
| Q3 | 멜론 | `#F59E0B` |
| Q4 | 다음 딸기 모종 | `#84CC16` |

## 3. 타이포

- **한글**: Pretendard (CDN)
  - `@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');`
- **영문**: Inter (Pretendard fallback에 포함)
- **숫자/코드**: JetBrains Mono (CDN 미import — fontFamily 토큰만 정의, 실제 폰트는 fallback monospace)

폰트 fallback 체인:
```
'Pretendard Variable', 'Pretendard', 'Inter', system-ui, -apple-system, sans-serif
```

## 4. 아이콘

- Tabler Icons webfont (CDN)
  - `@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.40.0/tabler-icons.min.css');`
- 사용: `<i class="ti ti-bulb" />`

5 모듈 매핑:

| 모듈 | 아이콘 |
|---|---|
| Decide | `ti-bulb` |
| Watch | `ti-eye` |
| Care | `ti-shield` |
| Tell | `ti-message` |
| Sell | `ti-shopping-cart` |

## 5. 컴포넌트 규칙

- **Border**: `0.5px solid Border` (`border-[0.5px] border-border`)
- **Radius**: lg=12px / md=8px (Tailwind `rounded-lg` / `rounded-md`)
- **Shadow**: 없음 — functional focus만
- **다온이 발화 카드**: Ink 배경 + 흰 글씨 + Primary 도트 (`bg-ink text-white` + 좌측 `bg-primary` 4px 도트)
- **작물 카드**: 흰 배경 + 시즌 액센트 도트·진척바 (`bg-base` + 시즌 컬러)
- **진척바**: 4px 높이 + 시즌 컬러 (`h-1 bg-season-q1` 등)

## 6. 시그니처 모티브

도시 그리드(수직 라인) × 식물 곡선 × 데이터 도트.
SVG로 빈 화면·로딩·로고 영역에 활용.

```
│  │  │  │  │
│  │  ╭─╮│  │
│  ╰──╯ ╰╯  │     ← 식물 곡선이 도시 수직 그리드를 가로지름
│  ●     ●  │     ← 데이터 도트 (Primary)
│  │  │  │  │
```

## 7. Tailwind 매핑 가이드

`tailwind.config.ts`의 `theme.extend` 값:

```ts
colors: {
  base:    '#FFFFFF',
  surface: '#F4F7F5',
  primary: { DEFAULT: '#10B981', dark: '#047857', light: '#ECFDF5' },
  ink:     '#0F172A',
  muted:   { DEFAULT: '#64748B', light: '#94A3B8' },
  border:  { DEFAULT: '#E2E8F0', strong: '#CBD5E1' },
  season:  { q1: '#FF4757', q2: '#4F46E5', q3: '#F59E0B', q4: '#84CC16' },
  hanji:   { bg: '#FAF7F0', border: '#E5DDD0' },
},
borderRadius: { lg: '12px', md: '8px' },
fontFamily: {
  sans: ['Pretendard Variable', 'Pretendard', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
},
```

사용 클래스 예시:

```tsx
<div className="bg-surface border-[0.5px] border-border rounded-lg p-4">
  <span className="text-muted text-sm">Q1</span>
  <h3 className="text-ink font-bold">딸기</h3>
  <div className="h-1 bg-season-q1 rounded mt-2" style={{ width: '60%' }} />
</div>
```

## 8. globals.css

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.40.0/tabler-icons.min.css');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --base: #FFFFFF;
  --surface: #F4F7F5;
  --primary: #10B981;
  --primary-dark: #047857;
  --primary-light: #ECFDF5;
  --ink: #0F172A;
  --muted: #64748B;
  --muted-light: #94A3B8;
  --border: #E2E8F0;
  --border-strong: #CBD5E1;
  --season-q1: #FF4757;
  --season-q2: #4F46E5;
  --season-q3: #F59E0B;
  --season-q4: #84CC16;
}

html, body {
  background: var(--base);
  color: var(--ink);
  font-family: 'Pretendard Variable', 'Pretendard', 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```
