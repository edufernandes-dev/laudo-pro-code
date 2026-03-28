import { useOutletContext } from 'react-router-dom'
import { useLaudo } from '../../context/LaudoContext'
import { StepNavButtons } from './StepNavButtons'

interface Context { goToStep: (s: number) => void }

export function Step2Responsavel() {
  const { goToStep } = useOutletContext<Context>()
  const { laudo, dispatch, save, saving } = useLaudo()
  const rt = laudo.responsavelTecnico

  function update(field: string, value: string) {
    dispatch({ type: 'UPDATE_RESPONSAVEL', payload: { [field]: value } })
  }

  async function handleNext() {
    await save()
    goToStep(3)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Responsável Técnico</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
          <input
            type="text"
            value={rt.nome}
            onChange={e => update('nome', e.target.value)}
            placeholder="Nome do engenheiro/arquiteto"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
          <input
            type="text"
            value={rt.profissao}
            onChange={e => update('profissao', e.target.value)}
            placeholder="Ex: Engenheiro Civil"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registro CREA/CAU</label>
          <input
            type="text"
            value={rt.registro}
            onChange={e => update('registro', e.target.value)}
            placeholder="Ex: CREA-SP 123456/D"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status do registro</label>
          <select
            value={rt.status}
            onChange={e => update('status', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Ativo</option>
            <option>Inativo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contato (telefone/email)</label>
          <input
            type="text"
            value={rt.contato}
            onChange={e => update('contato', e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <StepNavButtons onBack={() => goToStep(1)} onNext={handleNext} saving={saving} />
    </div>
  )
}
