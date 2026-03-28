import { createContext, useContext, useReducer, useState, useCallback, type ReactNode } from 'react'
import type { LaudoCompleto, Confrontante, FotoConfrontante, FotoImovelMotivo } from '../types/laudo'
import { saveLaudo } from '../services/laudoService'

type LaudoAction =
  | { type: 'SET_LAUDO'; payload: LaudoCompleto }
  | { type: 'UPDATE_DADOS_GERAIS'; payload: Partial<LaudoCompleto['dadosGerais']> }
  | { type: 'UPDATE_RESPONSAVEL'; payload: Partial<LaudoCompleto['responsavelTecnico']> }
  | { type: 'UPDATE_CONTRATANTE'; payload: Partial<LaudoCompleto['contratante']> }
  | { type: 'UPDATE_CONTRATADA'; payload: Partial<LaudoCompleto['contratada']> }
  | { type: 'UPDATE_IMOVEL'; payload: Partial<LaudoCompleto['imovelMotivo']> }
  | { type: 'ADD_CONFRONTANTE'; payload: Confrontante }
  | { type: 'UPDATE_CONFRONTANTE'; payload: { index: number; data: Partial<Confrontante> } }
  | { type: 'REMOVE_CONFRONTANTE'; payload: number }
  | { type: 'ADD_FOTO_CONFRONTANTE'; payload: { index: number; foto: FotoConfrontante } }
  | { type: 'REMOVE_FOTO_CONFRONTANTE'; payload: { confrontanteIndex: number; fotoIndex: number } }
  | { type: 'ADD_FOTO_IMOVEL'; payload: FotoImovelMotivo }
  | { type: 'REMOVE_FOTO_IMOVEL'; payload: number }
  | { type: 'SET_STATUS'; payload: LaudoCompleto['status'] }

function reducer(state: LaudoCompleto, action: LaudoAction): LaudoCompleto {
  switch (action.type) {
    case 'SET_LAUDO':
      return action.payload
    case 'UPDATE_DADOS_GERAIS':
      return { ...state, dadosGerais: { ...state.dadosGerais, ...action.payload } }
    case 'UPDATE_RESPONSAVEL':
      return { ...state, responsavelTecnico: { ...state.responsavelTecnico, ...action.payload } }
    case 'UPDATE_CONTRATANTE':
      return { ...state, contratante: { ...state.contratante, ...action.payload } }
    case 'UPDATE_CONTRATADA':
      return { ...state, contratada: { ...state.contratada, ...action.payload } }
    case 'UPDATE_IMOVEL':
      return { ...state, imovelMotivo: { ...state.imovelMotivo, ...action.payload } }
    case 'ADD_CONFRONTANTE':
      return { ...state, confrontantes: [...state.confrontantes, action.payload] }
    case 'UPDATE_CONFRONTANTE': {
      const list = [...state.confrontantes]
      list[action.payload.index] = { ...list[action.payload.index], ...action.payload.data }
      return { ...state, confrontantes: list }
    }
    case 'REMOVE_CONFRONTANTE':
      return { ...state, confrontantes: state.confrontantes.filter((_, i) => i !== action.payload) }
    case 'ADD_FOTO_CONFRONTANTE': {
      const list = [...state.confrontantes]
      const c = { ...list[action.payload.index] }
      c.fotos = [...c.fotos, action.payload.foto]
      list[action.payload.index] = c
      return { ...state, confrontantes: list }
    }
    case 'REMOVE_FOTO_CONFRONTANTE': {
      const list = [...state.confrontantes]
      const c = { ...list[action.payload.confrontanteIndex] }
      c.fotos = c.fotos.filter((_, i) => i !== action.payload.fotoIndex)
      list[action.payload.confrontanteIndex] = c
      return { ...state, confrontantes: list }
    }
    case 'ADD_FOTO_IMOVEL':
      return { ...state, imovelMotivo: { ...state.imovelMotivo, fotos: [...state.imovelMotivo.fotos, action.payload] } }
    case 'REMOVE_FOTO_IMOVEL':
      return { ...state, imovelMotivo: { ...state.imovelMotivo, fotos: state.imovelMotivo.fotos.filter((_, i) => i !== action.payload) } }
    case 'SET_STATUS':
      return { ...state, status: action.payload }
    default:
      return state
  }
}

const EMPTY: LaudoCompleto = {
  id: '',
  status: 'rascunho',
  dadosGerais: { localEmissao: '', dataEmissao: '', dataVistoria: '', tipoObra: '' },
  responsavelTecnico: { nome: '', profissao: '', registro: '', status: '', contato: '' },
  contratante: { papel: '', nome: '', cnpj: '', endereco: '', bairro: '', cep: '' },
  contratada: { papel: '', nome: '', cnpj: '', endereco: '', bairro: '', cep: '' },
  imovelMotivo: { endereco: '', cep: '', tipologia: '', padraoConstrutivo: '', situacaoAtual: '', finalidadeObra: '', georreferenciaLegenda: [], fotos: [] },
  confrontantes: [],
}

interface LaudoContextValue {
  laudo: LaudoCompleto
  dispatch: React.Dispatch<LaudoAction>
  save: () => Promise<void>
  saving: boolean
}

const LaudoContext = createContext<LaudoContextValue | null>(null)

export function LaudoProvider({ children, initial }: { children: ReactNode; initial?: LaudoCompleto }) {
  const [laudo, dispatch] = useReducer(reducer, initial ?? EMPTY)
  const [saving, setSaving] = useState(false)

  const save = useCallback(async () => {
    setSaving(true)
    try {
      await saveLaudo(laudo)
    } finally {
      setSaving(false)
    }
  }, [laudo])

  return (
    <LaudoContext.Provider value={{ laudo, dispatch, save, saving }}>
      {children}
    </LaudoContext.Provider>
  )
}

export function useLaudo() {
  const ctx = useContext(LaudoContext)
  if (!ctx) throw new Error('useLaudo must be inside LaudoProvider')
  return ctx
}
