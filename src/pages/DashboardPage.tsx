import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loadLaudos, deleteLaudo, createEmptyLaudo, saveLaudo, laudoToResumo } from '../services/laudoService'
import type { LaudoResumo } from '../types/laudo'

const STATUS_LABEL: Record<string, string> = {
  rascunho: 'Rascunho',
  completo: 'Completo',
  gerado: 'Gerado',
}

const STATUS_COLOR: Record<string, string> = {
  rascunho: 'bg-yellow-100 text-yellow-800',
  completo: 'bg-green-100 text-green-800',
  gerado: 'bg-blue-100 text-blue-800',
}

function formatDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('T')[0].split('-')
  return `${d}/${m}/${y}`
}

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [laudos, setLaudos] = useState<LaudoResumo[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function fetchLaudos() {
    setLoading(true)
    try {
      const data = await loadLaudos()
      setLaudos(data.map(laudoToResumo))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLaudos() }, [])

  async function handleNew() {
    if (!user) return
    const laudo = createEmptyLaudo(user.id)
    await saveLaudo(laudo)
    navigate(`/laudo/${laudo.id}/step/1`)
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este laudo? Esta ação não pode ser desfeita.')) return
    setDeletingId(id)
    await deleteLaudo(id)
    setLaudos(prev => prev.filter(l => l.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Meus Laudos</h1>
        <button
          onClick={handleNew}
          className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-transform"
          title="Novo Laudo"
        >
          +
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : laudos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Nenhum laudo ainda</h2>
          <p className="text-gray-500 text-sm max-w-xs">
            Toque no botão <strong>+</strong> para criar seu primeiro Laudo de Vistoria Cautelar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {laudos.map(laudo => (
            <div
              key={laudo.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => navigate(`/laudo/${laudo.id}/step/1`)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[laudo.status]}`}>
                      {STATUS_LABEL[laudo.status]}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(laudo.dataVistoria)}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm leading-snug">
                    {laudo.imovelEndereco || 'Endereço não informado'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {laudo.contratanteNome || 'Contratante não informado'}
                    {laudo.confrontantesCount > 0 && ` · ${laudo.confrontantesCount} confrontante${laudo.confrontantesCount > 1 ? 's' : ''}`}
                  </p>
                </button>
                <button
                  onClick={() => handleDelete(laudo.id)}
                  disabled={deletingId === laudo.id}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors disabled:opacity-40"
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
