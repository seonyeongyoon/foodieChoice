/**
 * SVG 조각 경로 계산 (index번째 조각, 전체 total개, 중심 cx/cy, 반지름 r)
 */
export function getSegmentPath(index, total, cx, cy, r) {
  const startAngle = (index / total) * 2 * Math.PI - Math.PI / 2
  const endAngle = ((index + 1) / total) * 2 * Math.PI - Math.PI / 2
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  return `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 0 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`
}

/**
 * 조각 텍스트 위치 및 회전각 계산
 */
export function getTextTransform(index, total, cx, cy, textR) {
  const angle = ((index + 0.5) / total) * 2 * Math.PI - Math.PI / 2
  return {
    x: cx + textR * Math.cos(angle),
    y: cy + textR * Math.sin(angle),
    rotate: ((index + 0.5) / total) * 360 - 90,
  }
}

/**
 * 각 카테고리에서 2개씩 랜덤 샘플링 → 8개 세그먼트 배열 반환
 */
export function sampleSegments(menus, mode) {
  const categories = ['korean', 'chinese', 'japanese', 'western']
  const segments = []
  for (const cat of categories) {
    const items = [...(menus[mode][cat] || [])]
    const shuffled = items.sort(() => Math.random() - 0.5)
    if (shuffled.length === 0) {
      segments.push('메뉴 없음', '메뉴 없음')
    } else if (shuffled.length === 1) {
      segments.push(shuffled[0], shuffled[0])
    } else {
      segments.push(shuffled[0], shuffled[1])
    }
  }
  return segments
}

/**
 * 목표 인덱스에 멈추도록 스핀 각도 계산 (currentRotation에서 추가 회전량)
 */
export function calculateSpinDegrees(targetIndex, segmentCount, currentRotation) {
  const segmentAngle = 360 / segmentCount
  const targetMidAngle = targetIndex * segmentAngle + segmentAngle / 2
  const extra = 5 * 360 // 5바퀴
  const currentNorm = currentRotation % 360
  const needed = (targetMidAngle - currentNorm + 360) % 360
  return currentRotation + extra + needed
}

/**
 * 총 회전각에서 포인터(상단)에 위치한 세그먼트 인덱스 계산
 */
export function getResultIndex(totalRotation, segmentCount) {
  const segmentAngle = 360 / segmentCount
  const normalizedAngle = totalRotation % 360
  return Math.floor(normalizedAngle / segmentAngle) % segmentCount
}
