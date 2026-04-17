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
