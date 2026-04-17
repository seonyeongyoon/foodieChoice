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
