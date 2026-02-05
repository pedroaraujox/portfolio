-- Habilitar a extensão de storage se ainda não estiver habilitada (geralmente já vem habilitada no Supabase)
-- create extension if not exists "storage" schema "extensions";

-- 1. Criar o bucket 'portfolio' se ele não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar RLS na tabela de objetos (boa prática, embora o Supabase geralmente já force isso)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas para evitar conflitos (opcional, mas recomendado para garantir limpeza)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public can view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio images" ON storage.objects;

-- 4. Criar Políticas de Segurança (RLS)

-- POLÍTICA DE LEITURA (SELECT): Permitir que QUALQUER UM (anon e authenticated) veja os arquivos no bucket 'portfolio'
CREATE POLICY "Public can view portfolio images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

-- POLÍTICA DE UPLOAD (INSERT): Apenas usuários AUTENTICADOS podem fazer upload no bucket 'portfolio'
CREATE POLICY "Admin can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' 
  AND auth.role() = 'authenticated'
);

-- POLÍTICA DE ATUALIZAÇÃO (UPDATE): Apenas usuários AUTENTICADOS podem atualizar arquivos no bucket 'portfolio'
CREATE POLICY "Admin can update portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio' 
  AND auth.role() = 'authenticated'
);

-- POLÍTICA DE DELEÇÃO (DELETE): Apenas usuários AUTENTICADOS podem deletar arquivos no bucket 'portfolio'
CREATE POLICY "Admin can delete portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio' 
  AND auth.role() = 'authenticated'
);
