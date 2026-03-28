import Dexie, { type Table } from 'dexie'
import type { LaudoCompleto } from '../types/laudo'

export interface OfflineLaudo {
  id: string
  data: LaudoCompleto
  updatedAt: number
  syncStatus: 'synced' | 'pending' | 'conflict'
}

export interface OfflineFoto {
  id: string
  laudoId: string
  contexto: string // 'imovel-motivo' | 'confrontante-{index}' | 'georreferencia' | 'logo'
  ordem: number
  blob: Blob
  uploadStatus: 'uploaded' | 'pending'
  remoteUrl?: string
}

export interface SyncQueueItem {
  id: string
  action: 'create' | 'update' | 'delete' | 'upload_foto'
  table: string
  payload: unknown
  createdAt: number
  retries: number
}

class LaudoProDB extends Dexie {
  laudos!: Table<OfflineLaudo>
  fotos!: Table<OfflineFoto>
  syncQueue!: Table<SyncQueueItem>

  constructor() {
    super('laudo-pro')
    this.version(1).stores({
      laudos: 'id, syncStatus, updatedAt',
      fotos: 'id, laudoId, uploadStatus, contexto',
      syncQueue: 'id, action, createdAt',
    })
  }
}

export const db = new LaudoProDB()

export async function saveLaudoOffline(laudo: LaudoCompleto, synced = false): Promise<void> {
  await db.laudos.put({
    id: laudo.id,
    data: laudo,
    updatedAt: Date.now(),
    syncStatus: synced ? 'synced' : 'pending',
  })
}

export async function getLaudoOffline(id: string): Promise<LaudoCompleto | null> {
  const record = await db.laudos.get(id)
  return record?.data ?? null
}

export async function getAllLaudosOffline(): Promise<LaudoCompleto[]> {
  const records = await db.laudos.orderBy('updatedAt').reverse().toArray()
  return records.map(r => r.data)
}

export async function deleteLaudoOffline(id: string): Promise<void> {
  await db.laudos.delete(id)
  await db.fotos.where('laudoId').equals(id).delete()
}

export async function saveFotoOffline(foto: OfflineFoto): Promise<void> {
  await db.fotos.put(foto)
}

export async function getFotoOffline(id: string): Promise<OfflineFoto | null> {
  return (await db.fotos.get(id)) ?? null
}

export async function getFotosByLaudo(laudoId: string): Promise<OfflineFoto[]> {
  return db.fotos.where('laudoId').equals(laudoId).toArray()
}

export async function addToSyncQueue(item: Omit<SyncQueueItem, 'createdAt' | 'retries'>): Promise<void> {
  await db.syncQueue.put({ ...item, createdAt: Date.now(), retries: 0 })
}
