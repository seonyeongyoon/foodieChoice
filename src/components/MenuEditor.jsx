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
