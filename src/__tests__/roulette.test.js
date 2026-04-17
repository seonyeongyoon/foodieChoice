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
