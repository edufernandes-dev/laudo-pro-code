import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../services/supabase'
import { signOut } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface Perfil {
  nome_completo: string
  profissao: string
  registro_crea: string
  status_registro: string
  telefone: string
  email: string
}

export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState<Perfil>({
    nome_completo: '',
    profissao: 'Engenheiro Civil',
    registro_crea: '',
    status_registro: 'Ativo',
    telefone: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!user) return
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setPerfil({
          nome_completo: data.nome_completo ?? '',
          profissao: data.profissao ?? 'Engenheiro Civil',
          registro_crea: data.registro_crea ?? '',
          status_registro: data.status_registro ?? 'Ativo',
          telefone: data.telefone ?? '',
          email: data.email ?? user.email ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [user])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')
    try {
      const { error: err } = await supabase
        .from('users')
        .update({
          nome_completo: perfil.nome_completo,
          profissao: perfil.profissao,
          registro_crea: perfil.registro_crea,
          status_registro: perfil.status_registro,
          telefone: perfil.telefone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (err) throw err
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  function field(label: string, key: keyof Perfil, type = 'text', placeholder = '') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type={type}
          value={perfil[key]}
          onChange={e => setPerfil(prev => ({ ...prev, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Dados pessoais</h2>
          {field('Nome completo', 'nome_completo', 'text', 'Seu nome completo')}
          {field('Profissão', 'profissao', 'text', 'Ex: Engenheiro Civil')}
          {field('Registro CREA', 'registro_crea', 'text', 'Ex: CREA-SP 123456/D')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status do registro</label>
            <select
              value={perfil.status_registro}
              onChange={e => setPerfil(prev => ({ ...prev, status_registro: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Ativo</option>
              <option>Inativo</option>
              <option>Aposentado</option>
            </select>
          </div>

          {field('Telefone', 'telefone', 'tel', '(11) 99999-9999')}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Conta</h2>
          <p className="text-sm text-gray-500">Email: <span className="font-medium text-gray-800">{perfil.email}</span></p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar perfil'}
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full border border-gray-300 text-gray-600 rounded-xl py-3 font-medium hover:bg-gray-50 transition-colors"
        >
          Sair da conta
        </button>
      </form>
    </div>
  )
}
