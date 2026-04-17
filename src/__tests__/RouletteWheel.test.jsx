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
