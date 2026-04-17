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
