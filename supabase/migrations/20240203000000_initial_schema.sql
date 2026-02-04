-- Admin Users Table (managed by Supabase Auth)
-- Authentication handled natively by Supabase Auth service

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    technologies TEXT NOT NULL,
    result TEXT NOT NULL,
    learnings TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Content Table (for editable text sections)
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name VARCHAR(100) NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    content_text TEXT,
    content_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_name, section_name)
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
-- Grant read access to anonymous users for public content
GRANT SELECT ON projects TO anon;
GRANT SELECT ON services TO anon;
GRANT SELECT ON site_content TO anon;
GRANT INSERT ON contact_messages TO anon;

-- Grant full access to authenticated admin
GRANT ALL PRIVILEGES ON projects TO authenticated;
GRANT ALL PRIVILEGES ON services TO authenticated;
GRANT ALL PRIVILEGES ON site_content TO authenticated;
GRANT ALL PRIVILEGES ON contact_messages TO authenticated;

-- Row Level Security Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public can view active projects" ON projects
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view site content" ON site_content
    FOR SELECT USING (true);
    
CREATE POLICY "Public can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Policies for authenticated admin full access
CREATE POLICY "Admin full access to projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to site content" ON site_content
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to contact messages" ON contact_messages
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial content examples
INSERT INTO site_content (page_name, section_name, content_text) VALUES
('sobre', 'hero_title', 'Pedro Henrique Araújo Silva'),
('sobre', 'hero_subtitle', 'Analista de Suporte Júnior | Estudante de ADS'),
('sobre', 'about_text', 'Apaixonado por tecnologia desde jovem, comecei minha jornada explorando hardware e redes. Hoje, como Analista de Suporte Júnior e estudante de Análise e Desenvolvimento de Sistemas, busco constantemente evoluir minhas habilidades em programação e infraestrutura.'),
('contato', 'email', 'pa8088253@gmail.com'),
('contato', 'linkedin', 'www.linkedin.com/in/pedroaraujox'),
('contato', 'whatsapp', 'Seu número aqui')
ON CONFLICT (page_name, section_name) DO NOTHING;

INSERT INTO services (title, description, icon_name, display_order) VALUES
('Suporte Técnico', 'Resolução de problemas de hardware e software com agilidade e eficiência.', 'Wrench', 1),
('Redes de Computadores', 'Configuração e manutenção de redes locais e infraestrutura de conectividade.', 'Network', 2),
('Programação Web', 'Desenvolvimento de sites e aplicações web modernas e responsivas.', 'Code', 3),
('Automação', 'Criação de scripts e processos automatizados para otimizar tarefas.', 'Cpu', 4),
('Banco de Dados', 'Modelagem e administração de bancos de dados relacionais.', 'Database', 5),
('Consultoria TI', 'Análise e recomendações para melhoria de ambiente tecnológico.', 'Lightbulb', 6);
