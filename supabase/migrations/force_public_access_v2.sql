-- PERIGO: Este script remove TODA a segurança do banco de dados.
-- Use apenas porque você optou por não ter autenticação no backend.

-- Habilita acesso total para qualquer pessoa (anon) na tabela projects
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access projects" ON projects;
CREATE POLICY "Public full access projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- Habilita acesso total para qualquer pessoa (anon) na tabela services
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access services" ON services;
CREATE POLICY "Public full access services" ON services FOR ALL USING (true) WITH CHECK (true);

-- Habilita acesso total para qualquer pessoa (anon) na tabela site_content
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access site_content" ON site_content;
CREATE POLICY "Public full access site_content" ON site_content FOR ALL USING (true) WITH CHECK (true);

-- Habilita acesso total para qualquer pessoa (anon) na tabela contact_messages
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access contact_messages" ON contact_messages;
CREATE POLICY "Public full access contact_messages" ON contact_messages FOR ALL USING (true) WITH CHECK (true);
