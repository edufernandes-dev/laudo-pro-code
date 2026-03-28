-- ============================================================
-- LAUDO PRO — Schema completo do banco de dados
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- 1. TABELAS
-- ============================================================

CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo TEXT NOT NULL DEFAULT '',
    profissao TEXT NOT NULL DEFAULT 'Engenheiro Civil',
    registro_crea TEXT NOT NULL DEFAULT '',
    status_registro TEXT DEFAULT 'Ativo',
    telefone TEXT,
    email TEXT,
    company_id UUID REFERENCES public.companies(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.laudos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    company_id UUID REFERENCES public.companies(id),
    status TEXT NOT NULL DEFAULT 'rascunho'
        CHECK (status IN ('rascunho', 'completo', 'gerado')),
    local_emissao TEXT,
    data_emissao DATE,
    data_vistoria DATE,
    horario_inicio TIME,
    horario_fim TIME,
    tipo_obra TEXT,
    logo_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    synced_at TIMESTAMPTZ
);

CREATE TABLE public.contratantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laudo_id UUID NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
    papel TEXT DEFAULT 'Construtora',
    nome TEXT NOT NULL DEFAULT '',
    cnpj TEXT,
    endereco TEXT,
    bairro TEXT,
    cep TEXT
);

CREATE TABLE public.contratadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laudo_id UUID NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
    papel TEXT DEFAULT 'Demolição',
    nome TEXT NOT NULL DEFAULT '',
    cnpj TEXT,
    endereco TEXT,
    bairro TEXT,
    cep TEXT
);

CREATE TABLE public.imoveis_motivo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laudo_id UUID NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
    endereco TEXT NOT NULL DEFAULT '',
    cep TEXT,
    tipologia TEXT,
    padrao_construtivo TEXT,
    situacao_atual TEXT,
    finalidade_obra TEXT,
    georreferencia_imagem_url TEXT,
    georreferencia_legenda JSONB DEFAULT '[]'
);

CREATE TABLE public.confrontantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laudo_id UUID NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
    ordem INT NOT NULL DEFAULT 1,
    nome TEXT NOT NULL DEFAULT '',
    endereco TEXT,
    documento_tipo TEXT CHECK (documento_tipo IN ('CNPJ', 'CPF', 'Não informado')),
    documento_valor TEXT,
    iptu TEXT,
    responsavel TEXT,
    contato_telefone TEXT,
    contato_email TEXT,
    tipologia TEXT,
    ocupacao TEXT,
    posicao_relativa TEXT,
    posicao_complemento TEXT,
    data_diligencia DATE,
    hora_diligencia TIME,
    padrao_construtivo JSONB DEFAULT '[]',
    condicoes_observadas JSONB DEFAULT '[]'
);

CREATE TABLE public.fotos_confrontante (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    confrontante_id UUID NOT NULL REFERENCES public.confrontantes(id) ON DELETE CASCADE,
    ordem INT NOT NULL DEFAULT 1,
    imagem_url TEXT NOT NULL DEFAULT '',
    legenda TEXT NOT NULL DEFAULT '',
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.fotos_imovel_motivo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imovel_motivo_id UUID NOT NULL REFERENCES public.imoveis_motivo(id) ON DELETE CASCADE,
    ordem INT NOT NULL DEFAULT 1,
    imagem_url TEXT NOT NULL DEFAULT '',
    legenda TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ÍNDICES
-- ============================================================

CREATE INDEX idx_laudos_user_id ON public.laudos(user_id);
CREATE INDEX idx_laudos_status ON public.laudos(status);
CREATE INDEX idx_confrontantes_laudo_id ON public.confrontantes(laudo_id);
CREATE INDEX idx_fotos_confrontante_id ON public.fotos_confrontante(confrontante_id);
CREATE INDEX idx_fotos_imovel_motivo_id ON public.fotos_imovel_motivo(imovel_motivo_id);

-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imoveis_motivo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confrontantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos_confrontante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos_imovel_motivo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own" ON public.users
    FOR ALL USING (id = auth.uid());

CREATE POLICY "laudos_own" ON public.laudos
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "contratantes_own" ON public.contratantes
    FOR ALL USING (
        laudo_id IN (SELECT id FROM public.laudos WHERE user_id = auth.uid())
    );

CREATE POLICY "contratadas_own" ON public.contratadas
    FOR ALL USING (
        laudo_id IN (SELECT id FROM public.laudos WHERE user_id = auth.uid())
    );

CREATE POLICY "imoveis_motivo_own" ON public.imoveis_motivo
    FOR ALL USING (
        laudo_id IN (SELECT id FROM public.laudos WHERE user_id = auth.uid())
    );

CREATE POLICY "confrontantes_own" ON public.confrontantes
    FOR ALL USING (
        laudo_id IN (SELECT id FROM public.laudos WHERE user_id = auth.uid())
    );

CREATE POLICY "fotos_confrontante_own" ON public.fotos_confrontante
    FOR ALL USING (
        confrontante_id IN (
            SELECT c.id FROM public.confrontantes c
            JOIN public.laudos l ON c.laudo_id = l.id
            WHERE l.user_id = auth.uid()
        )
    );

CREATE POLICY "fotos_imovel_motivo_own" ON public.fotos_imovel_motivo
    FOR ALL USING (
        imovel_motivo_id IN (
            SELECT im.id FROM public.imoveis_motivo im
            JOIN public.laudos l ON im.laudo_id = l.id
            WHERE l.user_id = auth.uid()
        )
    );

-- 4. TRIGGER: cria perfil automaticamente ao registrar usuário
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. STORAGE BUCKETS
-- (Execute separadamente na aba Storage do Supabase, ou via SQL abaixo)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('laudo-fotos', 'laudo-fotos', false),
  ('laudo-logos', 'laudo-logos', false),
  ('laudo-georreferencia', 'laudo-georreferencia', false)
ON CONFLICT (id) DO NOTHING;

-- Policies de Storage
CREATE POLICY "fotos_select_own" ON storage.objects
    FOR SELECT USING (
        bucket_id IN ('laudo-fotos', 'laudo-logos', 'laudo-georreferencia')
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "fotos_insert_own" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('laudo-fotos', 'laudo-logos', 'laudo-georreferencia')
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "fotos_update_own" ON storage.objects
    FOR UPDATE USING (
        bucket_id IN ('laudo-fotos', 'laudo-logos', 'laudo-georreferencia')
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "fotos_delete_own" ON storage.objects
    FOR DELETE USING (
        bucket_id IN ('laudo-fotos', 'laudo-logos', 'laudo-georreferencia')
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
