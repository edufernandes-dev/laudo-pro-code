import { supabase } from './supabase'
import {
  saveLaudoOffline,
  getAllLaudosOffline,
  getLaudoOffline,
  deleteLaudoOffline,
} from './offlineStorage'
import type { LaudoCompleto, LaudoResumo } from '../types/laudo'

export function createEmptyLaudo(userId: string, perfil?: { nome: string; profissao: string; registro: string; status: string; contato: string }): LaudoCompleto {
  return {
    id: crypto.randomUUID(),
    userId,
    status: 'rascunho',
    dadosGerais: {
      localEmissao: 'São Paulo - SP',
      dataEmissao: new Date().toISOString().split('T')[0],
      dataVistoria: new Date().toISOString().split('T')[0],
      horarioInicio: '',
      horarioFim: '',
      tipoObra: '',
    },
    responsavelTecnico: {
      nome: perfil?.nome ?? '',
      profissao: perfil?.profissao ?? 'Engenheiro Civil',
      registro: perfil?.registro ?? '',
      status: perfil?.status ?? 'Ativo',
      contato: perfil?.contato ?? '',
    },
    contratante: {
      papel: 'Construtora',
      nome: '',
      cnpj: '',
      endereco: '',
      bairro: '',
      cep: '',
    },
    contratada: {
      papel: 'Demolição',
      nome: '',
      cnpj: '',
      endereco: '',
      bairro: '',
      cep: '',
    },
    imovelMotivo: {
      endereco: '',
      cep: '',
      tipologia: '',
      padraoConstrutivo: '',
      situacaoAtual: '',
      finalidadeObra: '',
      georreferenciaLegenda: [],
      fotos: [],
    },
    confrontantes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function laudoToResumo(l: LaudoCompleto): LaudoResumo {
  return {
    id: l.id,
    status: l.status,
    localEmissao: l.dadosGerais.localEmissao,
    dataVistoria: l.dadosGerais.dataVistoria,
    imovelEndereco: l.imovelMotivo.endereco,
    contratanteNome: l.contratante.nome,
    confrontantesCount: l.confrontantes.length,
    updatedAt: l.updatedAt ?? l.createdAt ?? new Date().toISOString(),
  }
}

export async function saveLaudo(laudo: LaudoCompleto): Promise<void> {
  const updated = { ...laudo, updatedAt: new Date().toISOString() }
  await saveLaudoOffline(updated, false)

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase.from('laudos').upsert({
      id: updated.id,
      user_id: session.user.id,
      status: updated.status,
      local_emissao: updated.dadosGerais.localEmissao,
      data_emissao: updated.dadosGerais.dataEmissao || null,
      data_vistoria: updated.dadosGerais.dataVistoria || null,
      horario_inicio: updated.dadosGerais.horarioInicio || null,
      horario_fim: updated.dadosGerais.horarioFim || null,
      tipo_obra: updated.dadosGerais.tipoObra,
      logo_url: updated.dadosGerais.logoUrl ?? null,
      metadata: updated,
      updated_at: updated.updatedAt,
      synced_at: new Date().toISOString(),
    })

    await saveLaudoOffline(updated, true)
  } catch {
    // offline — already saved locally
  }
}

export async function loadLaudos(): Promise<LaudoCompleto[]> {
  // Always load from IndexedDB first (instant)
  const local = await getAllLaudosOffline()

  try {
    const { data, error } = await supabase
      .from('laudos')
      .select('metadata')
      .order('updated_at', { ascending: false })

    if (error || !data) return local

    const remote: LaudoCompleto[] = data
      .map((r) => r.metadata as LaudoCompleto)
      .filter(Boolean)

    // Merge: save remote to IndexedDB
    for (const r of remote) {
      await saveLaudoOffline(r, true)
    }

    return remote.length > 0 ? remote : local
  } catch {
    return local
  }
}

export async function loadLaudo(id: string): Promise<LaudoCompleto | null> {
  const local = await getLaudoOffline(id)

  try {
    const { data } = await supabase
      .from('laudos')
      .select('metadata')
      .eq('id', id)
      .single()

    if (data?.metadata) {
      const remote = data.metadata as LaudoCompleto
      await saveLaudoOffline(remote, true)
      return remote
    }
  } catch {
    // offline
  }

  return local
}

export async function deleteLaudo(id: string): Promise<void> {
  await deleteLaudoOffline(id)
  try {
    await supabase.from('laudos').delete().eq('id', id)
  } catch {
    // offline — will sync later
  }
}
