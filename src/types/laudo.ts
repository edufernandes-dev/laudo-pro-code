export interface ResponsavelTecnico {
  nome: string
  profissao: string
  registro: string
  status: string
  contato: string
}

export interface Contratante {
  id?: string
  papel: string
  nome: string
  cnpj: string
  endereco: string
  bairro: string
  cep: string
}

export interface Contratada {
  id?: string
  papel: string
  nome: string
  cnpj: string
  endereco: string
  bairro: string
  cep: string
}

export interface ItemLegenda {
  numero: number
  descricao: string
  cor: 'vermelho' | 'verde' | 'amarelo' | 'azul'
}

export interface FotoImovelMotivo {
  id?: string
  ordem: number
  imagemUrl: string
  imagemBlob?: Blob
  legenda: string
}

export interface ImovelMotivo {
  id?: string
  endereco: string
  cep: string
  tipologia: string
  padraoConstrutivo: string
  situacaoAtual: string
  finalidadeObra: string
  georreferenciaImagemUrl?: string
  georreferenciaImagemBlob?: Blob
  georreferenciaLegenda: ItemLegenda[]
  fotos: FotoImovelMotivo[]
}

export interface FotoConfrontante {
  id?: string
  ordem: number
  imagemUrl: string
  imagemBlob?: Blob
  legenda: string
  observacoes?: string
}

export interface Confrontante {
  id?: string
  ordem: number
  nome: string
  endereco: string
  documentoTipo: 'CNPJ' | 'CPF' | 'Não informado'
  documentoValor?: string
  iptu?: string
  responsavel?: string
  contatoTelefone?: string
  contatoEmail?: string
  tipologia: string
  ocupacao: string
  posicaoRelativa: string
  posicaoComplemento?: string
  dataDiligencia?: string
  horaDiligencia?: string
  padraoConstrutivo: string[]
  condicoesObservadas: string[]
  fotos: FotoConfrontante[]
}

export interface DadosGerais {
  localEmissao: string
  dataEmissao: string
  dataVistoria: string
  horarioInicio?: string
  horarioFim?: string
  tipoObra: string
  logoUrl?: string
  logoBlob?: Blob
}

export interface LaudoCompleto {
  id: string
  userId?: string
  status: 'rascunho' | 'completo' | 'gerado'
  dadosGerais: DadosGerais
  responsavelTecnico: ResponsavelTecnico
  contratante: Contratante
  contratada: Contratada
  imovelMotivo: ImovelMotivo
  confrontantes: Confrontante[]
  createdAt?: string
  updatedAt?: string
  syncedAt?: string
}

export type LaudoStatus = 'rascunho' | 'completo' | 'gerado'

export interface LaudoResumo {
  id: string
  status: LaudoStatus
  localEmissao: string
  dataVistoria: string
  imovelEndereco: string
  contratanteNome: string
  confrontantesCount: number
  updatedAt: string
}
