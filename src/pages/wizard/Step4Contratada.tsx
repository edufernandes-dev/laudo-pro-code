import { useOutletContext } from 'react-router-dom'
import { useLaudo } from '../../context/LaudoContext'
import { StepNavButtons } from './StepNavButtons'
import { PAPEIS_CONTRATADA } from '../../constants/suggestions'

interface Context { goToStep: (s: number) => void }

export function Step4Contratada() {
  const { goToStep } = useOutletContext<Context>()
  const { laudo, dispatch, save, saving } = useLaudo()
  const cd = laudo.contratada

  function update(field: string, value: string) {
    dispatch({ type: 'UPDATE_CONTRATADA', payload: { [field]: value } })
  }

  async function handleNext() {
    await save()
    goToStep(5)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Contratada</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Papel</label>
          <select
            value={cd.papel}
            onChange={e => update('papel', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAPEIS_CONTRATADA.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razão social / Nome</label>
          <input
            type="text"
            value={cd.nome}
            onChange={e => update('nome', e.target.value)}
            placeholder="Nome da empresa ou pessoa"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ / CPF</label>
          <input
            type="text"
            value={cd.cnpj}
            onChange={e => update('cnpj', e.target.value)}
            placeholder="00.000.000/0001-00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <input
            type="text"
            value={cd.endereco}
            onChange={e => update('endereco', e.target.value)}
            placeholder="Rua, número"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input
              type="text"
              value={cd.bairro}
              onChange={e => update('bairro', e.target.value)}
              placeholder="Bairro"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input
              type="text"
              value={cd.cep}
              onChange={e => update('cep', e.target.value)}
              placeholder="00000-000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <StepNavButtons onBack={() => goToStep(3)} onNext={handleNext} saving={saving} />
    </div>
  )
}
