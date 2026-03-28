import { useOutletContext } from 'react-router-dom'
import { useLaudo } from '../../context/LaudoContext'
import { StepNavButtons } from './StepNavButtons'
import { TIPOLOGIAS_IMOVEL, SITUACOES_IMOVEL } from '../../constants/suggestions'

interface Context { goToStep: (s: number) => void }

export function Step5Imovel() {
  const { goToStep } = useOutletContext<Context>()
  const { laudo, dispatch, save, saving } = useLaudo()
  const im = laudo.imovelMotivo

  function update(field: string, value: string) {
    dispatch({ type: 'UPDATE_IMOVEL', payload: { [field]: value } })
  }

  async function handleNext() {
    await save()
    goToStep(6)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Imóvel Motivo da Obra</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <input
            type="text"
            value={im.endereco}
            onChange={e => update('endereco', e.target.value)}
            placeholder="Rua, número, bairro"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
          <input
            type="text"
            value={im.cep}
            onChange={e => update('cep', e.target.value)}
            placeholder="00000-000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipologia</label>
          <select
            value={im.tipologia}
            onChange={e => update('tipologia', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {TIPOLOGIAS_IMOVEL.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Padrão construtivo</label>
          <input
            type="text"
            value={im.padraoConstrutivo}
            onChange={e => update('padraoConstrutivo', e.target.value)}
            placeholder="Ex: Alvenaria convencional"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Situação atual</label>
          <select
            value={im.situacaoAtual}
            onChange={e => update('situacaoAtual', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {SITUACOES_IMOVEL.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Finalidade da obra</label>
          <textarea
            value={im.finalidadeObra}
            onChange={e => update('finalidadeObra', e.target.value)}
            placeholder="Descreva a finalidade da obra..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <StepNavButtons onBack={() => goToStep(4)} onNext={handleNext} saving={saving} />
    </div>
  )
}
