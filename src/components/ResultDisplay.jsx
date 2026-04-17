export default function ResultDisplay({ result }) {
  return (
    <div className="mx-4 mb-4 bg-white rounded-2xl p-5 text-center border border-blue-100 shadow-sm">
      {result ? (
        <>
          <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">오늘의 추천</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{result}</p>
        </>
      ) : (
        <p className="text-sm text-blue-300">룰렛을 돌려 오늘의 메뉴를 정해보세요!</p>
      )}
    </div>
  )
}
