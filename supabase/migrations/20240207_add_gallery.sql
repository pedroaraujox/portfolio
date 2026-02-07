-- Add gallery column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

-- Create storage bucket for project images if it doesn't exist
-- Note: This usually needs to be done via dashboard or specific storage API calls, 
-- but putting it here for documentation.
-- insert into storage.buckets (id, name) values ('project-images', 'project-images');

-- Set up security policies for storage (Example)
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'project-images' );
-- create policy "Authenticated Upload" on storage.objects for insert with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );
