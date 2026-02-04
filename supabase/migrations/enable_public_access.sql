-- IMPORTANTE: Rode este SQL no SQL Editor do Supabase para liberar o acesso ao banco
-- sem necessidade de autenticação no backend (já que o frontend está fazendo a auth simplificada)

-- 1. Desabilita RLS (Row Level Security) temporariamente ou permite tudo para anon
-- A opção mais segura sem auth é manter RLS mas criar policies para 'anon' role

-- Projetos
DROP POLICY IF EXISTS "Admin full access to projects" ON projects;
CREATE POLICY "Public full access to projects" ON projects
    FOR ALL USING (true);

-- Serviços
DROP POLICY IF EXISTS "Admin full access to services" ON services;
CREATE POLICY "Public full access to services" ON services
    FOR ALL USING (true);

-- Conteúdo do Site
DROP POLICY IF EXISTS "Admin full access to site content" ON site_content;
CREATE POLICY "Public full access to site content" ON site_content
    FOR ALL USING (true);

-- Mensagens de Contato
DROP POLICY IF EXISTS "Admin full access to contact messages" ON contact_messages;
CREATE POLICY "Public full access to contact messages" ON contact_messages
    FOR ALL USING (true);
