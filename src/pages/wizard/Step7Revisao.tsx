import { useOutletContext, useNavigate } from 'react-router-dom'
import { useLaudo } from '../../context/LaudoContext'
import { StepNavButtons } from './StepNavButtons'

interface Context { goToStep: (s: number) => void; laudoId: string }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="p-4 space-y-1.5">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <span className="text-xs text-gray-500 w-32 shrink-0">{label}</span>
      <span className="text-xs text-gray-800 font-medium">{value}</span>
    </div>
  )
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('T')[0].split('-')
  return `${d}/${m}/${y}`
}

export function Step7Revisao() {
  const { goToStep } = useOutletContext<Context>()
  const navigate = useNavigate()
  const { laudo, dispatch, save, saving } = useLaudo()

  async function handleFinish() {
    dispatch({ type: 'SET_STATUS', payload: 'completo' })
    await save()
    navigate('/')
  }

  const { dadosGerais: dg, responsavelTecnico: rt, contratante, contratada, imovelMotivo, confrontantes } = laudo

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">Revisão Final</h2>
        <p className="text-sm text-gray-500">Verifique os dados antes de finalizar.</p>

        <Section title="Dados Gerais">
          <Row label="Local emissão" value={dg.localEmissao} />
          <Row label="Data emissão" value={formatDate(dg.dataEmissao)} />
          <Row label="Data vistoria" value={formatDate(dg.dataVistoria)} />
          <Row label="Horário" value={dg.horarioInicio ? `${dg.horarioInicio} – ${dg.horarioFim}` : undefined} />
          <Row label="Tipo de obra" value={dg.tipoObra} />
        </Section>

        <Section title="Responsável Técnico">
          <Row label="Nome" value={rt.nome} />
          <Row label="Profissão" value={rt.profissao} />
          <Row label="Registro" value={rt.registro} />
          <Row label="Status" value={rt.status} />
          <Row label="Contato" value={rt.contato} />
        </Section>

        <Section title="Contratante">
          <Row label="Papel" value={contratante.papel} />
          <Row label="Nome" value={contratante.nome} />
          <Row label="CNPJ/CPF" value={contratante.cnpj} />
          <Row label="Endereço" value={contratante.endereco} />
        </Section>

        <Section title="Contratada">
          <Row label="Papel" value={contratada.papel} />
          <Row label="Nome" value={contratada.nome} />
          <Row label="CNPJ/CPF" value={contratada.cnpj} />
          <Row label="Endereço" value={contratada.endereco} />
        </Section>

        <Section title="Imóvel Motivo">
          <Row label="Endereço" value={imovelMotivo.endereco} />
          <Row label="CEP" value={imovelMotivo.cep} />
          <Row label="Tipologia" value={imovelMotivo.tipologia} />
          <Row label="Padrão" value={imovelMotivo.padraoConstrutivo} />
          <Row label="Situação" value={imovelMotivo.situacaoAtual} />
          <Row label="Finalidade" value={imovelMotivo.finalidadeObra} />
        </Section>

        <Section title={`Confrontantes (${confrontantes.length})`}>
          {confrontantes.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhum confrontante cadastrado.</p>
          ) : (
            confrontantes.map((c, i) => (
              <div key={i} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <p className="text-xs font-semibold text-gray-700">{i + 1}. {c.nome || 'Sem nome'}</p>
                {c.posicaoRelativa && <p className="text-xs text-gray-500">{c.posicaoRelativa}</p>}
                {c.padraoConstrutivo.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">{c.padraoConstrutivo.join(', ')}</p>
                )}
                {c.condicoesObservadas.length > 0 && (
                  <p className="text-xs text-gray-500">{c.condicoesObservadas.join(', ')}</p>
                )}
              </div>
            ))
          )}
        </Section>

        <div className="flex gap-2 flex-wrap">
          {[1,2,3,4,5,6].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => goToStep(s)}
              className="text-xs text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
            >
              Editar etapa {s}
            </button>
          ))}
        </div>
      </div>

      <StepNavButtons
        onBack={() => goToStep(6)}
        onSave={handleFinish}
        saving={saving}
        isLast
      />
    </div>
  )
}
