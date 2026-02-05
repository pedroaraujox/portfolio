-- MIGRATION: SECURITY HARDENING
-- DATA: 2026-02-05
-- OBJETIVO: Implementar Controle de Acesso Baseado em Whitelist (RBAC) e corrigir RLS permissivo.

-- 1. Criar tabela de Admins (Whitelist)
CREATE TABLE IF NOT EXISTS public.admin_whitelist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS na tabela de whitelist
ALTER TABLE public.admin_whitelist ENABLE ROW LEVEL SECURITY;

-- 3. Criar função segura para verificar se usuário é admin
-- SECURITY DEFINER: roda com permissões do dono da função (postgres), permitindo ler a whitelist
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_whitelist
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Remover políticas antigas (Permissivas demais) e Limpar Conflitos
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can manage site_content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin full access to projects" ON public.projects;
DROP POLICY IF EXISTS "Admin full access to services" ON public.services;
DROP POLICY IF EXISTS "Admin full access to site content" ON public.site_content;
DROP POLICY IF EXISTS "Admin full access to contact messages" ON public.contact_messages;

-- Remover políticas NOVAS caso já existam (para evitar erro 42710 em re-execução)
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can view messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view whitelist" ON public.admin_whitelist;
DROP POLICY IF EXISTS "Admins can manage whitelist" ON public.admin_whitelist;
DROP POLICY IF EXISTS "Admins can delete from whitelist" ON public.admin_whitelist;

-- 5. Criar Novas Políticas Restritivas (Baseadas em is_admin())

-- PROJETOS
CREATE POLICY "Admins can manage projects" ON public.projects
    FOR ALL USING (public.is_admin());

-- SERVIÇOS
CREATE POLICY "Admins can manage services" ON public.services
    FOR ALL USING (public.is_admin());

-- CONTEÚDO DO SITE
CREATE POLICY "Admins can manage site_content" ON public.site_content
    FOR ALL USING (public.is_admin());

-- MENSAGENS DE CONTATO
CREATE POLICY "Admins can view messages" ON public.contact_messages
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update messages" ON public.contact_messages
    FOR UPDATE USING (public.is_admin());

-- LOGS DE AUDITORIA
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (public.is_admin());

-- 6. Proteger a própria tabela de Whitelist
-- Apenas admins podem ver quem são os admins
CREATE POLICY "Admins can view whitelist" ON public.admin_whitelist
    FOR SELECT USING (public.is_admin());

-- Apenas admins podem adicionar novos admins
CREATE POLICY "Admins can manage whitelist" ON public.admin_whitelist
    FOR INSERT WITH CHECK (public.is_admin());
    
CREATE POLICY "Admins can delete from whitelist" ON public.admin_whitelist
    FOR DELETE USING (public.is_admin());

-- 7. Corrigir Storage Policies (Bucket 'portfolio')
-- Remover antigas e possíveis novas conflitantes
DROP POLICY IF EXISTS "Admin can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;

-- Criar novas com is_admin()
CREATE POLICY "Admins can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' 
  AND public.is_admin()
);

CREATE POLICY "Admins can update portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio' 
  AND public.is_admin()
);

CREATE POLICY "Admins can delete portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio' 
  AND public.is_admin()
);

-- 8. INSERIR ADMIN INICIAL (IMPORTANTE: Substitua pelo seu email se necessário)
-- Tenta inserir o admin padrão definido no .env ou um placeholder
INSERT INTO public.admin_whitelist (email)
VALUES ('admin@portfolio.com') -- ALTERE PARA O SEU EMAIL REAL NO SQL EDITOR
ON CONFLICT (email) DO NOTHING;
