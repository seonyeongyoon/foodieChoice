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
