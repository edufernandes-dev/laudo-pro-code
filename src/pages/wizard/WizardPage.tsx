import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { LaudoProvider } from '../../context/LaudoContext'
import { loadLaudo } from '../../services/laudoService'
import type { LaudoCompleto } from '../../types/laudo'

const STEPS = [
  { num: 1, label: 'Geral' },
  { num: 2, label: 'Responsável' },
  { num: 3, label: 'Contratante' },
  { num: 4, label: 'Contratada' },
  { num: 5, label: 'Imóvel' },
  { num: 6, label: 'Confrontantes' },
  { num: 7, label: 'Revisão' },
]

export function WizardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const stepMatch = location.pathname.match(/\/step\/(\d+)/)
  const currentStep = stepMatch ? Number(stepMatch[1]) : 1
  const [laudo, setLaudo] = useState<LaudoCompleto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    loadLaudo(id).then(l => {
      setLaudo(l)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!laudo) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Laudo não encontrado.</p>
      </div>
    )
  }

  function goToStep(s: number) {
    navigate(`/laudo/${id}/step/${s}`)
  }

  return (
    <LaudoProvider initial={laudo}>
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Progress bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-1 mb-1">
            {STEPS.map(s => (
              <button
                key={s.num}
                onClick={() => goToStep(s.num)}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  s.num < currentStep
                    ? 'bg-blue-600'
                    : s.num === currentStep
                    ? 'bg-blue-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-right">
            Etapa {currentStep} de {STEPS.length} — {STEPS[currentStep - 1]?.label}
          </p>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ goToStep, laudoId: id }} />
        </div>
      </div>
    </LaudoProvider>
  )
}
