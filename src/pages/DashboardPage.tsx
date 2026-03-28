export function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
      {/* Header da página */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Meus Laudos</h1>
        <button className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700">
          +
        </button>
      </div>

      {/* Estado vazio */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Nenhum laudo ainda</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Toque no botão <strong>+</strong> para criar seu primeiro Laudo de Vistoria Cautelar.
        </p>
      </div>
    </div>
  )
}
