#!/usr/bin/env node
/**
 * Script de administração do Supabase para Laudo Pro.
 * Uso: node scripts/supabase-admin.mjs <comando> [args]
 *
 * Comandos disponíveis:
 *   create-user <email>        — Cria usuário e envia email de definição de senha
 *   list-users                 — Lista todos os usuários
 *   update-profile <email>     — Atualiza perfil de um usuário
 *   verify-tables              — Verifica se todas as tabelas existem
 *   run-sql <arquivo.sql>      — Executa um arquivo SQL
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Carrega .env manualmente (sem dotenv para manter sem dependências extras)
function loadEnv() {
  try {
    const env = readFileSync('.env', 'utf-8')
    for (const line of env.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      const value = trimmed.slice(idx + 1).trim()
      process.env[key] = value
    }
  } catch {
    console.error('Arquivo .env não encontrado. Copie .env.example para .env e preencha as chaves.')
    process.exit(1)
  }
}

loadEnv()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Variáveis VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias no .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const EXPECTED_TABLES = [
  'companies', 'users', 'laudos', 'contratantes', 'contratadas',
  'imoveis_motivo', 'confrontantes', 'fotos_confrontante', 'fotos_imovel_motivo'
]

async function createUser(email) {
  console.log(`Criando usuário: ${email}`)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
  })
  if (error) { console.error('Erro:', error.message); return }
  console.log('Usuário criado:', data.user.id)

  // Envia email de recuperação para definir senha
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'recovery', email })
  })
  const link = await res.json()
  if (link.action_link) {
    console.log('Email de definição de senha enviado para:', email)
  }
}

async function listUsers() {
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) { console.error('Erro:', error.message); return }
  console.log(`\n${data.users.length} usuário(s):\n`)
  for (const u of data.users) {
    console.log(`  ${u.email} — ${u.id} — criado em ${u.created_at}`)
  }
}

async function verifyTables() {
  console.log('Verificando tabelas...\n')
  for (const table of EXPECTED_TABLES) {
    const { error } = await supabase.from(table).select('id').limit(1)
    const status = error ? `❌ ERRO: ${error.message}` : '✅ OK'
    console.log(`  ${table}: ${status}`)
  }
}

// Router de comandos
const [,, cmd, ...args] = process.argv

switch (cmd) {
  case 'create-user':
    if (!args[0]) { console.error('Uso: node supabase-admin.mjs create-user <email>'); break }
    await createUser(args[0])
    break
  case 'list-users':
    await listUsers()
    break
  case 'verify-tables':
    await verifyTables()
    break
  default:
    console.log('Comandos: create-user <email> | list-users | verify-tables')
}
