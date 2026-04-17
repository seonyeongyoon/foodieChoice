# FoodieChoice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** React + Vite SPA로 점심/저녁 메뉴를 원형 룰렛으로 랜덤 추천하고, 카테고리별 메뉴를 편집할 수 있는 반응형 웹 앱 구축

**Architecture:** 단일 페이지 앱. 상태는 React useState로 관리하고 localStorage에 동기화. 룰렛은 SVG로 렌더링하고 CSS transition으로 스핀 애니메이션 처리. 백엔드 없음.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, Vitest, @testing-library/react

---

## 파일 구조

```
foodiechoice/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   └── defaultMenus.js        # 기본 메뉴 데이터 (한/중/일/양, 점심/저녁)
│   ├── hooks/
│   │   └── useMenuStore.js        # 메뉴 상태 관리 + localStorage 동기화
│   ├── utils/
│   │   └── roulette.js            # SVG 경로 계산, 스핀 각도 계산 (순수 함수)
│   └── components/
│       ├── ModeToggle.jsx          # 점심/저녁 전환 버튼
│       ├── RouletteWheel.jsx       # SVG 원형 룰렛 + 스핀 애니메이션
│       ├── SpinButton.jsx          # 돌리기 버튼
│       ├── ResultDisplay.jsx       # 결과 표시
│       └── MenuEditor.jsx          # 사이드 패널 (카테고리별 편집)
└── src/__tests__/
    ├── roulette.test.js
    ├── useMenuStore.test.js
    ├── ModeToggle.test.jsx
    ├── RouletteWheel.test.jsx
    ├── ResultDisplay.test.jsx
    └── MenuEditor.test.jsx
```

---

## Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/index.css`
- Create: `src/main.jsx`

- [ ] **Step 1: Vite + React 프로젝트 생성**

```bash
cd C:/Users/sy/hynux-web/foodieChoice
npm create vite@latest . -- --template react
```

프롬프트에서 "현재 디렉토리에 생성하겠습니까?" → `y` 선택

- [ ] **Step 2: 의존성 설치**

```bash
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/coverage-v8
```

- [ ] **Step 3: `vite.config.js` 설정**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
```

- [ ] **Step 4: `src/setupTests.js` 생성**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: `tailwind.config.js` 설정**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 6: `src/index.css` 교체**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #EFF6FF;
  min-height: 100vh;
}
```

- [ ] **Step 7: `package.json`에 test 스크립트 추가**

`package.json`의 `scripts`에 아래 줄 추가:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 8: 개발 서버 실행 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 → Vite 기본 화면 확인

- [ ] **Step 9: 커밋**

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + Tailwind project"
```

---

## Task 2: 기본 메뉴 데이터

**Files:**
- Create: `src/data/defaultMenus.js`
- Create: `src/__tests__/defaultMenus.test.js`

- [ ] **Step 1: 테스트 작성**

```js
// src/__tests__/defaultMenus.test.js
import defaultMenus from '../data/defaultMenus'

describe('defaultMenus', () => {
  const modes = ['lunch', 'dinner']
  const categories = ['korean', 'chinese', 'japanese', 'western']

  test.each(modes)('%s 모드에 4개 카테고리가 있다', (mode) => {
    expect(Object.keys(defaultMenus[mode])).toEqual(categories)
  })

  test.each(
    modes.flatMap(mode => categories.map(cat => [mode, cat]))
  )('%s > %s 카테고리에 최소 2개 메뉴가 있다', (mode, cat) => {
    expect(defaultMenus[mode][cat].length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npm run test:run -- src/__tests__/defaultMenus.test.js
```

Expected: FAIL (파일 없음)

- [ ] **Step 3: `src/data/defaultMenus.js` 작성**

```js
const defaultMenus = {
  lunch: {
    korean:   ['김치찌개', '비빔밥', '냉면', '삼겹살', '된장찌개', '순두부찌개'],
    chinese:  ['짬뽕', '짜장면', '탕수육', '마라탕', '딤섬'],
    japanese: ['초밥', '라멘', '우동', '돈카츠', '오야코동'],
    western:  ['파스타', '피자', '샐러드', '버거', '리조또'],
  },
  dinner: {
    korean:   ['삼겹살', '갈비찜', '순대국', '부대찌개', '곱창', '치킨'],
    chinese:  ['마라샹궈', '짬뽕', '딤섬', '훠궈', '깐풍기'],
    japanese: ['오마카세', '야키토리', '샤브샤브', '라멘', '이자카야'],
    western:  ['스테이크', '파스타', '리조또', '브런치', '와인 안주'],
  },
}

export default defaultMenus
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npm run test:run -- src/__tests__/defaultMenus.test.js
```

Expected: PASS (16개 테스트)

- [ ] **Step 5: 커밋**

```bash
git add src/data/defaultMenus.js src/__tests__/defaultMenus.test.js
git commit -m "feat: add default menu data (한/중/일/양, 점심/저녁)"
```

---

## Task 3: 룰렛 유틸리티 함수

**Files:**
- Create: `src/utils/roulette.js`
- Create: `src/__tests__/roulette.test.js`

- [ ] **Step 1: 테스트 작성**

```js
// src/__tests__/roulette.test.js
import {
  getSegmentPath,
  getTextTransform,
  sampleSegments,
  calculateSpinDegrees,
  getResultIndex,
} from '../utils/roulette'

describe('getSegmentPath', () => {
  test('인덱스 0의 경로가 문자열이고 M/L/A/Z를 포함한다', () => {
    const path = getSegmentPath(0, 8, 110, 110, 105)
    expect(typeof path).toBe('string')
    expect(path).toMatch(/^M/)
    expect(path).toContain('A')
    expect(path).toContain('Z')
  })

  test('8개 조각의 경로가 모두 다르다', () => {
    const paths = Array.from({ length: 8 }, (_, i) => getSegmentPath(i, 8, 110, 110, 105))
    const unique = new Set(paths)
    expect(unique.size).toBe(8)
  })
})

describe('getTextTransform', () => {
  test('x, y, rotate 값을 반환한다', () => {
    const result = getTextTransform(0, 8, 110, 110, 70)
    expect(result).toHaveProperty('x')
    expect(result).toHaveProperty('y')
    expect(result).toHaveProperty('rotate')
  })
})

describe('sampleSegments', () => {
  const menus = {
    lunch: {
      korean:   ['김치찌개', '비빔밥', '냉면'],
      chinese:  ['짬뽕', '짜장면'],
      japanese: ['초밥', '라멘'],
      western:  ['파스타', '피자'],
    },
  }

  test('8개 세그먼트를 반환한다', () => {
    const segments = sampleSegments(menus, 'lunch')
    expect(segments).toHaveLength(8)
  })

  test('각 세그먼트는 문자열이다', () => {
    const segments = sampleSegments(menus, 'lunch')
    segments.forEach(s => expect(typeof s).toBe('string'))
  })

  test('호출할 때마다 다른 순서가 나올 수 있다 (10번 중 최소 2가지)', () => {
    const results = new Set(
      Array.from({ length: 10 }, () => sampleSegments(menus, 'lunch').join(','))
    )
    expect(results.size).toBeGreaterThanOrEqual(2)
  })
})

describe('calculateSpinDegrees', () => {
  test('최소 5바퀴(1800도) 이상 회전한다', () => {
    const deg = calculateSpinDegrees(0, 8, 0)
    expect(deg).toBeGreaterThanOrEqual(1800)
  })

  test('다른 targetIndex는 다른 각도를 반환한다', () => {
    const deg0 = calculateSpinDegrees(0, 8, 0)
    const deg3 = calculateSpinDegrees(3, 8, 0)
    expect(deg0).not.toBe(deg3)
  })
})

describe('getResultIndex', () => {
  test('총 회전각 0도이면 인덱스 0 반환', () => {
    expect(getResultIndex(0, 8)).toBe(0)
  })

  test('총 회전각 45도(1조각)이면 인덱스 1 반환', () => {
    expect(getResultIndex(45, 8)).toBe(1)
  })

  test('총 회전각 360도(1바퀴)이면 인덱스 0 반환', () => {
    expect(getResultIndex(360, 8)).toBe(0)
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npm run test:run -- src/__tests__/roulette.test.js
```

Expected: FAIL

- [ ] **Step 3: `src/utils/roulette.js` 작성**

```js
/**
 * SVG 조각 경로 계산 (index번째 조각, 전체 total개, 중심 cx/cy, 반지름 r)
 */
export function getSegmentPath(index, total, cx, cy, r) {
  const startAngle = (index / total) * 2 * Math.PI - Math.PI / 2
  const endAngle = ((index + 1) / total) * 2 * Math.PI - Math.PI / 2
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  return `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 0 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`
}

/**
 * 조각 텍스트 위치 및 회전각 계산
 */
export function getTextTransform(index, total, cx, cy, textR) {
  const angle = ((index + 0.5) / total) * 2 * Math.PI - Math.PI / 2
  return {
    x: cx + textR * Math.cos(angle),
    y: cy + textR * Math.sin(angle),
    rotate: ((index + 0.5) / total) * 360 - 90,
  }
}

/**
 * 각 카테고리에서 2개씩 랜덤 샘플링 → 8개 세그먼트 배열 반환
 */
export function sampleSegments(menus, mode) {
  const categories = ['korean', 'chinese', 'japanese', 'western']
  const segments = []
  for (const cat of categories) {
    const items = [...(menus[mode][cat] || [])]
    const shuffled = items.sort(() => Math.random() - 0.5)
    if (shuffled.length === 0) {
      segments.push('메뉴 없음', '메뉴 없음')
    } else if (shuffled.length === 1) {
      segments.push(shuffled[0], shuffled[0])
    } else {
      segments.push(shuffled[0], shuffled[1])
    }
  }
  return segments
}

/**
 * 목표 인덱스에 멈추도록 스핀 각도 계산 (currentRotation에서 추가 회전량)
 */
export function calculateSpinDegrees(targetIndex, segmentCount, currentRotation) {
  const segmentAngle = 360 / segmentCount
  const targetMidAngle = targetIndex * segmentAngle + segmentAngle / 2
  const toTop = (360 - targetMidAngle) % 360
  const extra = 5 * 360 // 5바퀴
  // 현재 위치에서 toTop까지의 각도 조정
  const currentNorm = currentRotation % 360
  const needed = (toTop - currentNorm + 360) % 360
  return currentRotation + extra + needed
}

/**
 * 총 회전각에서 포인터(상단)에 위치한 세그먼트 인덱스 계산
 */
export function getResultIndex(totalRotation, segmentCount) {
  const segmentAngle = 360 / segmentCount
  const normalizedAngle = ((360 - (totalRotation % 360)) % 360)
  return Math.floor(normalizedAngle / segmentAngle) % segmentCount
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npm run test:run -- src/__tests__/roulette.test.js
```

Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/utils/roulette.js src/__tests__/roulette.test.js
git commit -m "feat: add roulette utility functions with tests"
```

---

## Task 4: useMenuStore 훅

**Files:**
- Create: `src/hooks/useMenuStore.js`
- Create: `src/__tests__/useMenuStore.test.js`

- [ ] **Step 1: 테스트 작성**

```js
// src/__tests__/useMenuStore.test.js
import { renderHook, act } from '@testing-library/react'
import { useMenuStore } from '../hooks/useMenuStore'

beforeEach(() => {
  localStorage.clear()
})

describe('useMenuStore', () => {
  test('초기 메뉴는 defaultMenus와 동일하다', () => {
    const { result } = renderHook(() => useMenuStore())
    expect(result.current.menus.lunch.korean.length).toBeGreaterThan(0)
    expect(result.current.menus.dinner.japanese.length).toBeGreaterThan(0)
  })

  test('addMenu: 점심 한식에 메뉴를 추가한다', () => {
    const { result } = renderHook(() => useMenuStore())
    const before = result.current.menus.lunch.korean.length
    act(() => {
      result.current.addMenu('lunch', 'korean', '설렁탕')
    })
    expect(result.current.menus.lunch.korean).toContain('설렁탕')
    expect(result.current.menus.lunch.korean.length).toBe(before + 1)
  })

  test('addMenu: 빈 문자열은 무시한다', () => {
    const { result } = renderHook(() => useMenuStore())
    const before = result.current.menus.lunch.korean.length
    act(() => {
      result.current.addMenu('lunch', 'korean', '   ')
    })
    expect(result.current.menus.lunch.korean.length).toBe(before)
  })

  test('removeMenu: 인덱스로 메뉴를 삭제한다', () => {
    const { result } = renderHook(() => useMenuStore())
    const first = result.current.menus.lunch.korean[0]
    act(() => {
      result.current.removeMenu('lunch', 'korean', 0)
    })
    expect(result.current.menus.lunch.korean).not.toContain(first)
  })

  test('localStorage에 저장되어 새 훅 인스턴스에서도 유지된다', () => {
    const { result: r1 } = renderHook(() => useMenuStore())
    act(() => {
      r1.current.addMenu('lunch', 'korean', '해장국')
    })
    const { result: r2 } = renderHook(() => useMenuStore())
    expect(r2.current.menus.lunch.korean).toContain('해장국')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npm run test:run -- src/__tests__/useMenuStore.test.js
```

Expected: FAIL

- [ ] **Step 3: `src/hooks/useMenuStore.js` 작성**

```js
import { useState, useEffect } from 'react'
import defaultMenus from '../data/defaultMenus'

const STORAGE_KEY = 'foodiechoice-menus'

export function useMenuStore() {
  const [menus, setMenus] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultMenus
    } catch {
      return defaultMenus
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus))
  }, [menus])

  function addMenu(mode, category, name) {
    const trimmed = name.trim()
    if (!trimmed) return
    setMenus(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [category]: [...prev[mode][category], trimmed],
      },
    }))
  }

  function removeMenu(mode, category, index) {
    setMenus(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [category]: prev[mode][category].filter((_, i) => i !== index),
      },
    }))
  }

  return { menus, addMenu, removeMenu }
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npm run test:run -- src/__tests__/useMenuStore.test.js
```

Expected: PASS (5개 테스트)

- [ ] **Step 5: 커밋**

```bash
git add src/hooks/useMenuStore.js src/__tests__/useMenuStore.test.js
git commit -m "feat: add useMenuStore hook with localStorage persistence"
```

---

## Task 5: ModeToggle 컴포넌트

**Files:**
- Create: `src/components/ModeToggle.jsx`
- Create: `src/__tests__/ModeToggle.test.jsx`

- [ ] **Step 1: 테스트 작성**

```jsx
// src/__tests__/ModeToggle.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ModeToggle from '../components/ModeToggle'

describe('ModeToggle', () => {
  test('점심/저녁 버튼이 렌더링된다', () => {
    render(<ModeToggle mode="lunch" onToggle={() => {}} />)
    expect(screen.getByText(/점심/)).toBeInTheDocument()
    expect(screen.getByText(/저녁/)).toBeInTheDocument()
  })

  test('현재 mode가 lunch이면 점심 버튼이 활성 스타일이다', () => {
    render(<ModeToggle mode="lunch" onToggle={() => {}} />)
    const lunchBtn = screen.getByText(/점심/).closest('button')
    expect(lunchBtn).toHaveClass('from-sky-400')
  })

  test('저녁 버튼 클릭 시 onToggle("dinner") 호출', () => {
    const onToggle = vi.fn()
    render(<ModeToggle mode="lunch" onToggle={onToggle} />)
    fireEvent.click(screen.getByText(/저녁/).closest('button'))
    expect(onToggle).toHaveBeenCalledWith('dinner')
  })

  test('점심 버튼 클릭 시 onToggle("lunch") 호출', () => {
    const onToggle = vi.fn()
    render(<ModeToggle mode="dinner" onToggle={onToggle} />)
    fireEvent.click(screen.getByText(/점심/).closest('button'))
    expect(onToggle).toHaveBeenCalledWith('lunch')
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npm run test:run -- src/__tests__/ModeToggle.test.jsx
```

Expected: FAIL

- [ ] **Step 3: `src/components/ModeToggle.jsx` 작성**

```jsx
export default function ModeToggle({ mode, onToggle }) {
  const activeClass = 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md'
  const inactiveClass = 'bg-blue-50 text-blue-400 hover:bg-blue-100'

  return (
    <div className="flex gap-2 p-4">
      <button
        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
          mode === 'lunch' ? activeClass : inactiveClass
        }`}
        onClick={() => onToggle('lunch')}
      >
        ☀️ 점심
      </button>
      <button
        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
          mode === 'dinner' ? activeClass : inactiveClass
        }`}
        onClick={() => onToggle('dinner')}
      >
        🌙 저녁
      </button>
    </div>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npm run test:run -- src/__tests__/ModeToggle.test.jsx
```

Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/components/ModeToggle.jsx src/__tests__/ModeToggle.test.jsx
git commit -m "feat: add ModeToggle component"
```

---

## Task 6: SpinButton & ResultDisplay 컴포넌트

**Files:**
- Create: `src/components/SpinButton.jsx`
- Create: `src/components/ResultDisplay.jsx`
- Create: `src/__tests__/ResultDisplay.test.jsx`

- [ ] **Step 1: ResultDisplay 테스트 작성**

```jsx
// src/__tests__/ResultDisplay.test.jsx
import { render, screen } from '@testing-library/react'
import ResultDisplay from '../components/ResultDisplay'

describe('ResultDisplay', () => {
  test('result가 null이면 안내 문구를 표시한다', () => {
    render(<ResultDisplay result={null} />)
    expect(screen.getByText(/룰렛을 돌려/)).toBeInTheDocument()
  })

  test('result가 있으면 메뉴명을 표시한다', () => {
    render(<ResultDisplay result="짬뽕" />)
    expect(screen.getByText('짬뽕')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npm run test:run -- src/__tests__/ResultDisplay.test.jsx
```

Expected: FAIL

- [ ] **Step 3: `src/components/SpinButton.jsx` 작성**

```jsx
export default function SpinButton({ isSpinning, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isSpinning}
      className={`w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 ${
        isSpinning
          ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      {isSpinning ? '🎡 돌리는 중...' : '🎡 룰렛 돌리기'}
    </button>
  )
}
```

- [ ] **Step 4: `src/components/ResultDisplay.jsx` 작성**

```jsx
export default function ResultDisplay({ result }) {
  return (
    <div className="mx-4 mb-4 bg-white rounded-2xl p-5 text-center border border-blue-100 shadow-sm">
      {result ? (
        <>
          <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">오늘의 추천</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{result}</p>
        </>
      ) : (
        <p className="text-sm text-blue-300">룰렛을 돌려 오늘의 메뉴를 정해보세요!</p>
      )}
    </div>
  )
}
```

- [ ] **Step 5: 테스트 실행 — 통과 확인**

```bash
npm run test:run -- src/__tests__/ResultDisplay.test.jsx
```

Expected: PASS

- [ ] **Step 6: 커밋**

```bash
git add src/components/SpinButton.jsx src/components/ResultDisplay.jsx src/__tests__/ResultDisplay.test.jsx
git commit -m "feat: add SpinButton and ResultDisplay components"
```

---

## Task 7: RouletteWheel 컴포넌트

**Files:**
- Create: `src/components/RouletteWheel.jsx`
- Create: `src/__tests__/RouletteWheel.test.jsx`

- [ ] **Step 1: 테스트 작성**

```jsx
// src/__tests__/RouletteWheel.test.jsx
import { render, screen } from '@testing-library/react'
import RouletteWheel from '../components/RouletteWheel'

const segments = ['김치찌개', '짬뽕', '초밥', '파스타', '비빔밥', '짜장면', '라멘', '피자']

describe('RouletteWheel', () => {
  test('SVG가 렌더링된다', () => {
    const { container } = render(
      <RouletteWheel segments={segments} isSpinning={false} onSpinEnd={() => {}} rotation={0} />
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  test('8개 세그먼트 텍스트가 모두 렌더링된다', () => {
    render(
      <RouletteWheel segments={segments} isSpinning={false} onSpinEnd={() => {}} rotation={0} />
    )
    segments.forEach(s => {
      expect(screen.getByText(s)).toBeInTheDocument()
    })
  })

  test('포인터(▼)가 렌더링된다', () => {
    render(
      <RouletteWheel segments={segments} isSpinning={false} onSpinEnd={() => {}} rotation={0} />
    )
    expect(screen.getByText('▼')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npm run test:run -- src/__tests__/RouletteWheel.test.jsx
```

Expected: FAIL

- [ ] **Step 3: `src/components/RouletteWheel.jsx` 작성**

```jsx
import { useRef, useEffect } from 'react'
import { getSegmentPath, getTextTransform } from '../utils/roulette'

const CX = 150
const CY = 150
const R = 140
const TEXT_R = 95
const SEGMENT_COLORS = ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD']

export default function RouletteWheel({ segments, isSpinning, onSpinEnd, rotation }) {
  const wheelRef = useRef(null)

  useEffect(() => {
    const el = wheelRef.current
    if (!el) return
    el.style.transition = isSpinning
      ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
      : 'none'
    el.style.transform = `rotate(${rotation}deg)`
  }, [rotation, isSpinning])

  useEffect(() => {
    const el = wheelRef.current
    if (!el || !isSpinning) return
    const handleTransitionEnd = () => onSpinEnd()
    el.addEventListener('transitionend', handleTransitionEnd)
    return () => el.removeEventListener('transitionend', handleTransitionEnd)
  }, [isSpinning, onSpinEnd])

  return (
    <div className="relative flex justify-center items-center py-6">
      {/* 포인터 */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-blue-600 text-2xl z-10 leading-none">
        ▼
      </div>

      <div
        ref={wheelRef}
        style={{ width: 300, height: 300, willChange: 'transform' }}
      >
        <svg viewBox="0 0 300 300" width="300" height="300">
          {/* 조각 */}
          {segments.map((menu, i) => {
            const path = getSegmentPath(i, segments.length, CX, CY, R)
            const fill = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
            const { x, y, rotate } = getTextTransform(i, segments.length, CX, CY, TEXT_R)
            return (
              <g key={i}>
                <path d={path} fill={fill} stroke="#BFDBFE" strokeWidth="1.5" />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#1D4ED8"
                  transform={`rotate(${rotate}, ${x}, ${y})`}
                >
                  {menu.length > 6 ? menu.slice(0, 6) + '…' : menu}
                </text>
              </g>
            )
          })}

          {/* 외곽 테두리 */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#93C5FD" strokeWidth="2.5" />

          {/* 중심 원 */}
          <circle cx={CX} cy={CY} r={24} fill="white" stroke="#3B82F6" strokeWidth="2" />
          <text
            x={CX}
            y={CY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fontWeight="700"
            fill="#2563EB"
          >
            GO
          </text>
        </svg>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npm run test:run -- src/__tests__/RouletteWheel.test.jsx
```

Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/components/RouletteWheel.jsx src/__tests__/RouletteWheel.test.jsx
git commit -m "feat: add RouletteWheel SVG component with spin animation"
```

---

## Task 8: MenuEditor 컴포넌트

**Files:**
- Create: `src/components/MenuEditor.jsx`
- Create: `src/__tests__/MenuEditor.test.jsx`

- [ ] **Step 1: 테스트 작성**

```jsx
// src/__tests__/MenuEditor.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import MenuEditor from '../components/MenuEditor'

const menus = {
  lunch: {
    korean: ['김치찌개', '비빔밥'],
    chinese: ['짬뽕'],
    japanese: ['초밥'],
    western: ['파스타'],
  },
  dinner: {
    korean: ['삼겹살'],
    chinese: ['마라탕'],
    japanese: ['라멘'],
    western: ['스테이크'],
  },
}

const defaultProps = {
  isOpen: true,
  onClose: () => {},
  menus,
  mode: 'lunch',
  onAdd: () => {},
  onRemove: () => {},
}

describe('MenuEditor', () => {
  test('isOpen=true 이면 패널이 보인다', () => {
    render(<MenuEditor {...defaultProps} />)
    expect(screen.getByText('메뉴 편집')).toBeInTheDocument()
  })

  test('4개 카테고리 탭이 렌더링된다', () => {
    render(<MenuEditor {...defaultProps} />)
    expect(screen.getByText('한식')).toBeInTheDocument()
    expect(screen.getByText('중식')).toBeInTheDocument()
    expect(screen.getByText('일식')).toBeInTheDocument()
    expect(screen.getByText('양식')).toBeInTheDocument()
  })

  test('기본 탭(한식)의 메뉴가 표시된다', () => {
    render(<MenuEditor {...defaultProps} />)
    expect(screen.getByText('김치찌개')).toBeInTheDocument()
    expect(screen.getByText('비빔밥')).toBeInTheDocument()
  })

  test('중식 탭 클릭 시 중식 메뉴로 전환된다', () => {
    render(<MenuEditor {...defaultProps} />)
    fireEvent.click(screen.getByText('중식'))
    expect(screen.getByText('짬뽕')).toBeInTheDocument()
  })

  test('× 버튼 클릭 시 onRemove가 호출된다', () => {
    const onRemove = vi.fn()
    render(<MenuEditor {...defaultProps} onRemove={onRemove} />)
    const removeButtons = screen.getAllByText('×')
    fireEvent.click(removeButtons[0])
    expect(onRemove).toHaveBeenCalledWith('lunch', 'korean', 0)
  })

  test('입력 후 추가 버튼 클릭 시 onAdd가 호출된다', () => {
    const onAdd = vi.fn()
    render(<MenuEditor {...defaultProps} onAdd={onAdd} />)
    const input = screen.getByPlaceholderText('메뉴 이름')
    fireEvent.change(input, { target: { value: '설렁탕' } })
    fireEvent.click(screen.getByText('추가'))
    expect(onAdd).toHaveBeenCalledWith('lunch', 'korean', '설렁탕')
  })

  test('닫기(✕) 버튼 클릭 시 onClose가 호출된다', () => {
    const onClose = vi.fn()
    render(<MenuEditor {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('닫기'))
    expect(onClose).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npm run test:run -- src/__tests__/MenuEditor.test.jsx
```

Expected: FAIL

- [ ] **Step 3: `src/components/MenuEditor.jsx` 작성**

```jsx
import { useState } from 'react'

const CATEGORY_LABELS = {
  korean: '한식',
  chinese: '중식',
  japanese: '일식',
  western: '양식',
}
const CATEGORIES = ['korean', 'chinese', 'japanese', 'western']

export default function MenuEditor({ isOpen, onClose, menus, mode, onAdd, onRemove }) {
  const [activeCategory, setActiveCategory] = useState('korean')
  const [inputValue, setInputValue] = useState('')

  function handleAdd() {
    if (!inputValue.trim()) return
    onAdd(mode, activeCategory, inputValue)
    setInputValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20"
          onClick={onClose}
        />
      )}

      {/* 사이드 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-30 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100">
          <h2 className="text-base font-bold text-blue-700">메뉴 편집</h2>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="text-blue-300 hover:text-blue-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex border-b border-blue-100">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-blue-300 hover:text-blue-500'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* 메뉴 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {(menus[mode][activeCategory] || []).map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-blue-50"
            >
              <span className="text-sm text-gray-700">{item}</span>
              <button
                onClick={() => onRemove(mode, activeCategory, i)}
                className="text-blue-200 hover:text-red-400 transition-colors text-base leading-none ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* 추가 입력 */}
        <div className="flex gap-2 px-4 py-4 border-t border-blue-100">
          <input
            type="text"
            placeholder="메뉴 이름"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-sky-400 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            추가
          </button>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npm run test:run -- src/__tests__/MenuEditor.test.jsx
```

Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/components/MenuEditor.jsx src/__tests__/MenuEditor.test.jsx
git commit -m "feat: add MenuEditor side panel with category tabs"
```

---

## Task 9: App 통합

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: `src/App.jsx` 작성**

```jsx
import { useState, useCallback } from 'react'
import ModeToggle from './components/ModeToggle'
import RouletteWheel from './components/RouletteWheel'
import SpinButton from './components/SpinButton'
import ResultDisplay from './components/ResultDisplay'
import MenuEditor from './components/MenuEditor'
import { useMenuStore } from './hooks/useMenuStore'
import { sampleSegments, calculateSpinDegrees, getResultIndex } from './utils/roulette'

export default function App() {
  const { menus, addMenu, removeMenu } = useMenuStore()
  const [mode, setMode] = useState('lunch')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [segments, setSegments] = useState(() => sampleSegments(menus, 'lunch'))
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState(null)

  function handleToggle(newMode) {
    if (isSpinning) return
    setMode(newMode)
    setSegments(sampleSegments(menus, newMode))
    setResult(null)
  }

  function handleSpin() {
    if (isSpinning) return
    const newSegments = sampleSegments(menus, mode)
    setSegments(newSegments)
    const targetIndex = Math.floor(Math.random() * newSegments.length)
    const newRotation = calculateSpinDegrees(targetIndex, newSegments.length, rotation)
    setRotation(newRotation)
    setIsSpinning(true)
    setResult(null)
  }

  const handleSpinEnd = useCallback(() => {
    setIsSpinning(false)
    const idx = getResultIndex(rotation, segments.length)
    setResult(segments[idx])
  }, [rotation, segments])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center">
      <div className="w-full max-w-[480px] flex flex-col">
        {/* 헤더 */}
        <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-blue-100 shadow-sm">
          <h1 className="text-lg font-bold text-blue-700 tracking-tight">🍽 FoodieChoice</h1>
          <button
            onClick={() => setIsEditorOpen(true)}
            className="text-xs border border-blue-200 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            메뉴 편집
          </button>
        </header>

        {/* 점심/저녁 토글 */}
        <ModeToggle mode={mode} onToggle={handleToggle} />

        {/* 룰렛 */}
        <RouletteWheel
          segments={segments}
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
          rotation={rotation}
        />

        {/* 돌리기 버튼 */}
        <div className="px-4 mb-4">
          <SpinButton isSpinning={isSpinning} onClick={handleSpin} />
        </div>

        {/* 결과 */}
        <ResultDisplay result={result} />
      </div>

      {/* 메뉴 편집 패널 */}
      <MenuEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        menus={menus}
        mode={mode}
        onAdd={addMenu}
        onRemove={removeMenu}
      />
    </div>
  )
}
```

- [ ] **Step 2: `src/main.jsx` 확인 및 수정**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: 모든 테스트 통과 확인**

```bash
npm run test:run
```

Expected: 모든 테스트 PASS

- [ ] **Step 4: 개발 서버에서 동작 확인**

```bash
npm run dev
```

체크리스트:
- [ ] 점심/저녁 토글 전환 동작
- [ ] 룰렛 돌리기 → 3.5초 회전 → 결과 표시
- [ ] 메뉴 편집 패널 열기/닫기
- [ ] 한식/중식/일식/양식 탭 전환
- [ ] 메뉴 추가 (입력 후 Enter 또는 추가 버튼)
- [ ] 메뉴 삭제 (× 버튼)
- [ ] 새로고침 후 메뉴 유지 (localStorage)

- [ ] **Step 5: 커밋**

```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: integrate all components in App"
```

---

## Task 10: 반응형 마무리 및 빌드 검증

**Files:**
- Modify: `index.html`

- [ ] **Step 1: `index.html` 메타 태그 설정**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FoodieChoice — 오늘 뭐 먹지?</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: 모바일 화면 확인**

브라우저 DevTools에서 375px 너비(iPhone SE)로 확인:
- 룰렛이 화면 너비에 맞게 표시되는지
- 버튼이 탭하기 충분한 크기인지
- 메뉴 편집 패널이 전체 너비로 열리는지

- [ ] **Step 3: 프로덕션 빌드**

```bash
npm run build
```

Expected: `dist/` 폴더 생성, 오류 없음

- [ ] **Step 4: 빌드 결과 미리보기**

```bash
npm run preview
```

`http://localhost:4173` 에서 프로덕션 빌드 동작 확인

- [ ] **Step 5: 최종 커밋**

```bash
git add index.html
git commit -m "feat: complete FoodieChoice MVP"
```

---

## 전체 테스트 실행

```bash
npm run test:run
```

모든 테스트 통과 후 완료.
