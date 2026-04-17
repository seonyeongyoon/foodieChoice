export default function ModeToggle({ mode, onToggle }) {
  const activeClass = 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md'
  const inactiveClass = 'bg-blue-50 text-blue-400 hover:bg-blue-100'

  return (
    <div className="flex gap-2 p-4">
      <button
        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
          mode === 'lunch' ? activeClass : inactiveClass
        }`}
        onClick={() => onToggle('lunch')}
      >
        ☀️ 점심
      </button>
      <button
        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
          mode === 'dinner' ? activeClass : inactiveClass
        }`}
        onClick={() => onToggle('dinner')}
      >
        🌙 저녁
      </button>
    </div>
  )
}
