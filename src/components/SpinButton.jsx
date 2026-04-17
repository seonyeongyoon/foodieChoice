export default function SpinButton({ isSpinning, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isSpinning}
      className={`w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 ${
        isSpinning
          ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      {isSpinning ? '🎡 돌리는 중...' : '🎡 룰렛 돌리기'}
    </button>
  )
}
