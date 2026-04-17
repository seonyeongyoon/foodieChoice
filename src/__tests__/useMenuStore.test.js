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
