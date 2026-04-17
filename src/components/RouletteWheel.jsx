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
