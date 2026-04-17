# FoodieChoice — 설계 문서

**날짜:** 2026-04-17  
**스택:** React + Vite  
**목표:** 점심/저녁 메뉴를 원형 룰렛으로 랜덤 추천하는 반응형 웹 앱

---

## 1. 아키텍처

단일 페이지 React 앱. 백엔드 없음. 상태는 `useState` + `useReducer`로 관리하고, `localStorage`에 동기화해 새로고침 후에도 메뉴가 유지된다.

```
src/
├── components/
│   ├── ModeToggle.jsx       # 점심/저녁 전환 버튼
│   ├── RouletteWheel.jsx    # SVG 원형 룰렛 + 스핀 애니메이션
│   ├── SpinButton.jsx       # 돌리기 버튼
│   ├── ResultDisplay.jsx    # 결과 표시 영역
│   └── MenuEditor.jsx       # 사이드 패널 (카테고리별 편집)
├── hooks/
│   └── useMenuStore.js      # 메뉴 상태 관리 + localStorage 동기화
├── data/
│   └── defaultMenus.js      # 초기 기본 메뉴 데이터
└── App.jsx
```

---

## 2. 색상 시스템

화이트 배경 + 하늘→파랑 그라데이션 포인트. Tailwind CSS 사용.

| 역할 | 값 |
|---|---|
| 배경 | `#FFFFFF`, `#EFF6FF` (blue-50) |
| 서브 배경 | `#DBEAFE` (blue-100) |
| 포인트 (그라데이션) | `from-sky-400 to-blue-600` |
| 텍스트 주색 | `#1D4ED8` (blue-700) |
| 텍스트 보조 | `#93C5FD` (blue-300) |
| 테두리 | `#BFDBFE` (blue-200) |

---

## 3. 데이터 구조

```js
// src/data/defaultMenus.js
{
  lunch: {
    korean:   ["김치찌개", "비빔밥", "냉면", "삼겹살", "된장찌개", "순두부찌개"],
    chinese:  ["짬뽕", "짜장면", "탕수육", "마라탕", "딤섬"],
    japanese: ["초밥", "라멘", "우동", "돈카츠", "오야코동"],
    western:  ["파스타", "피자", "샐러드", "버거", "리조또"]
  },
  dinner: {
    korean:   ["삼겹살", "갈비찜", "순대국", "부대찌개", "곱창", "치킨"],
    chinese:  ["마라샹궈", "짬뽕", "딤섬", "훠궈", "깐풍기"],
    japanese: ["오마카세", "야키토리", "샤브샤브", "라멘", "이자카야"],
    western:  ["스테이크", "파스타", "리조또", "브런치", "와인안주"]
  }
}
```

`localStorage` 키: `foodiechoice-menus`. 앱 첫 실행 시 `defaultMenus`로 초기화.

---

## 4. 컴포넌트 상세

### `App.jsx`
- `mode` 상태: `'lunch' | 'dinner'`
- `isEditorOpen` 상태: 메뉴 편집 패널 열림 여부
- `menus` 상태: `useMenuStore`에서 관리
- `spinResult` 상태: 룰렛 결과 메뉴명

### `ModeToggle`
- props: `mode`, `onToggle`
- 점심/저녁 두 버튼. 활성 버튼은 그라데이션, 비활성은 blue-50

### `RouletteWheel`
- props: `segments` (8개 메뉴명 배열), `isSpinning`, `onSpinEnd`
- SVG로 8등분 원형 렌더링. 각 조각은 교대로 blue-100 / blue-50 배경
- `spinDegree`: 최소 720도 + 랜덤 오프셋으로 목표 조각에 멈춤
- CSS `transition: transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)`
- 상단 포인터(▼)가 가리키는 조각 계산 후 `onSpinEnd(menuName)` 호출

### `SpinButton`
- props: `isSpinning`, `onClick`
- 스핀 중 비활성화 + 텍스트 "돌리는 중..." 표시

### `ResultDisplay`
- props: `result` (null이면 초기 안내 문구)
- 결과 등장 시 fade-in 애니메이션

### `MenuEditor`
- props: `isOpen`, `onClose`, `menus`, `mode`, `onAdd`, `onRemove`
- 오른쪽 슬라이드 인 패널 (`translate-x` transition)
- 한식/중식/일식/양식 탭
- 각 메뉴 항목: 이름 + × 삭제 버튼
- 하단: 입력창 + 추가 버튼 (Enter 키도 지원)

### `useMenuStore`
- `menus`, `addMenu(mode, category, name)`, `removeMenu(mode, category, index)` 반환
- 변경 시마다 `localStorage.setItem` 호출

---

## 5. 룰렛 세그먼트 샘플링

스핀 버튼 클릭 시:
1. 현재 `mode`(점심/저녁)의 4개 카테고리에서 각 2개 랜덤 샘플링
2. 총 8개 메뉴 배열 생성 → `RouletteWheel`에 전달
3. 매번 새로 샘플링하므로 항상 다른 조합 표시

---

## 6. 반응형

- 모바일 우선 설계
- 최대 너비 `480px`, 화면 중앙 정렬
- 메뉴 편집 패널: 전체 너비 오버레이 (모바일) / 320px 사이드 패널 (데스크탑)

---

## 7. 범위 외 (이번 버전 제외)

- 서버 저장/계정 기능
- 메뉴 이미지
- 공유 기능
- 사운드 이펙트
