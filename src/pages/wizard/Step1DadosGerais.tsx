import { useOutletContext } from 'react-router-dom'
import { useLaudo } from '../../context/LaudoContext'
import { StepNavButtons } from './StepNavButtons'
import { TIPOS_OBRA } from '../../constants/suggestions'

interface Context { goToStep: (s: number) => void }

export function Step1DadosGerais() {
  const { goToStep } = useOutletContext<Context>()
  const { laudo, dispatch, save, saving } = useLaudo()
  const dg = laudo.dadosGerais

  function update(field: string, value: string) {
    dispatch({ type: 'UPDATE_DADOS_GERAIS', payload: { [field]: value } })
  }

  async function handleNext() {
    await save()
    goToStep(2)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Dados Gerais</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Local de emissão</label>
          <input
            type="text"
            value={dg.localEmissao}
            onChange={e => update('localEmissao', e.target.value)}
            placeholder="Ex: São Paulo - SP"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de emissão</label>
            <input
              type="date"
              value={dg.dataEmissao}
              onChange={e => update('dataEmissao', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data da vistoria</label>
            <input
              type="date"
              value={dg.dataVistoria}
              onChange={e => update('dataVistoria', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horário início</label>
            <input
              type="time"
              value={dg.horarioInicio ?? ''}
              onChange={e => update('horarioInicio', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horário fim</label>
            <input
              type="time"
              value={dg.horarioFim ?? ''}
              onChange={e => update('horarioFim', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de obra</label>
          <select
            value={dg.tipoObra}
            onChange={e => update('tipoObra', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {TIPOS_OBRA.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <StepNavButtons onNext={handleNext} saving={saving} />
    </div>
  )
}
