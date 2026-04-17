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
