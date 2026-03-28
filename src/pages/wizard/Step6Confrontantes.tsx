import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useLaudo } from '../../context/LaudoContext'
import { StepNavButtons } from './StepNavButtons'
import type { Confrontante } from '../../types/laudo'
import {
  SUGESTOES_PADRAO_CONSTRUTIVO,
  SUGESTOES_CONDICOES,
  TIPOLOGIAS_IMOVEL,
  POSICOES_RELATIVAS,
} from '../../constants/suggestions'

interface Context { goToStep: (s: number) => void }

function newConfrontante(ordem: number): Confrontante {
  return {
    ordem,
    nome: '',
    endereco: '',
    documentoTipo: 'CNPJ',
    documentoValor: '',
    iptu: '',
    responsavel: '',
    contatoTelefone: '',
    contatoEmail: '',
    tipologia: '',
    ocupacao: '',
    posicaoRelativa: '',
    posicaoComplemento: '',
    dataDiligencia: '',
    horaDiligencia: '',
    padraoConstrutivo: [],
    condicoesObservadas: [],
    fotos: [],
  }
}

function ChipSelector({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
            selected.includes(opt)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function ConfrontanteCard({
  confrontante,
  index,
  onUpdate,
  onRemove,
}: {
  confrontante: Confrontante
  index: number
  onUpdate: (data: Partial<Confrontante>) => void
  onRemove: () => void
}) {
  const [expanded, setExpanded] = useState(index === 0)

  function field(label: string, key: keyof Confrontante, type = 'text', placeholder = '') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <input
          type={type}
          value={(confrontante[key] as string) ?? ''}
          onChange={e => onUpdate({ [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <span className="text-xs font-medium text-blue-600">Confrontante {index + 1}</span>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">
            {confrontante.nome || 'Sem nome'}
          </p>
          {confrontante.posicaoRelativa && (
            <p className="text-xs text-gray-500">{confrontante.posicaoRelativa}</p>
          )}
        </div>
        <span className="text-gray-400 text-lg">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          {field('Nome / Razão social', 'nome', 'text', 'Nome do confrontante')}
          {field('Endereço', 'endereco', 'text', 'Rua, número')}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Posição relativa</label>
            <select
              value={confrontante.posicaoRelativa}
              onChange={e => onUpdate({ posicaoRelativa: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {POSICOES_RELATIVAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {field('Complemento da posição', 'posicaoComplemento', 'text', 'Ex: lateral esquerdo')}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipologia</label>
            <select
              value={confrontante.tipologia}
              onChange={e => onUpdate({ tipologia: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {TIPOLOGIAS_IMOVEL.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {field('Ocupação', 'ocupacao', 'text', 'Ex: Residencial')}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Documento</label>
            <div className="flex gap-2">
              <select
                value={confrontante.documentoTipo}
                onChange={e => onUpdate({ documentoTipo: e.target.value as Confrontante['documentoTipo'] })}
                className="w-32 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>CNPJ</option>
                <option>CPF</option>
                <option>Não informado</option>
              </select>
              <input
                type="text"
                value={confrontante.documentoValor ?? ''}
                onChange={e => onUpdate({ documentoValor: e.target.value })}
                placeholder="Número do documento"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {field('IPTU', 'iptu', 'text', 'Número do IPTU')}
          {field('Responsável', 'responsavel', 'text', 'Nome do responsável')}
          {field('Telefone', 'contatoTelefone', 'tel', '(11) 99999-9999')}

          <div className="grid grid-cols-2 gap-2">
            {field('Data diligência', 'dataDiligencia', 'date')}
            {field('Hora', 'horaDiligencia', 'time')}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Padrão construtivo</label>
            <ChipSelector
              options={SUGESTOES_PADRAO_CONSTRUTIVO}
              selected={confrontante.padraoConstrutivo}
              onChange={v => onUpdate({ padraoConstrutivo: v })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Condições observadas</label>
            <ChipSelector
              options={SUGESTOES_CONDICOES}
              selected={confrontante.condicoesObservadas}
              onChange={v => onUpdate({ condicoesObservadas: v })}
            />
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="w-full text-red-500 text-sm border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors mt-2"
          >
            Remover confrontante
          </button>
        </div>
      )}
    </div>
  )
}

export function Step6Confrontantes() {
  const { goToStep } = useOutletContext<Context>()
  const { laudo, dispatch, save, saving } = useLaudo()

  function addConfrontante() {
    dispatch({ type: 'ADD_CONFRONTANTE', payload: newConfrontante(laudo.confrontantes.length + 1) })
  }

  function updateConfrontante(index: number, data: Partial<Confrontante>) {
    dispatch({ type: 'UPDATE_CONFRONTANTE', payload: { index, data } })
  }

  function removeConfrontante(index: number) {
    dispatch({ type: 'REMOVE_CONFRONTANTE', payload: index })
  }

  async function handleNext() {
    await save()
    goToStep(7)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Confrontantes</h2>
          <button
            type="button"
            onClick={addConfrontante}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Adicionar
          </button>
        </div>

        {laudo.confrontantes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🏠</div>
            <p className="text-sm">Nenhum confrontante adicionado.</p>
            <p className="text-xs mt-1">Toque em "+ Adicionar" para começar.</p>
          </div>
        ) : (
          laudo.confrontantes.map((c, i) => (
            <ConfrontanteCard
              key={i}
              confrontante={c}
              index={i}
              onUpdate={data => updateConfrontante(i, data)}
              onRemove={() => removeConfrontante(i)}
            />
          ))
        )}
      </div>

      <StepNavButtons onBack={() => goToStep(5)} onNext={handleNext} saving={saving} />
    </div>
  )
}
