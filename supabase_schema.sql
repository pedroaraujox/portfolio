-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects Table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  image_url text,
  problem text,
  solution text,
  technologies text,
  result text,
  learnings text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Services Table
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  icon_name text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Site Content Table (for About, Contact info, etc.)
create table if not exists public.site_content (
  id uuid default uuid_generate_v4() primary key,
  page_name text not null,
  section_name text not null,
  content_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(page_name, section_name)
);

-- Contact Messages Table
create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  sender_name text not null,
  sender_email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audit Logs Table (History & Security)
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  table_name text not null,
  record_id text,
  action text not null, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data jsonb,
  new_data jsonb,
  performed_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;
alter table public.audit_logs enable row level security;

-- RLS Policies

-- Public Read Access
drop policy if exists "Public projects are viewable by everyone" on public.projects;
create policy "Public projects are viewable by everyone" on public.projects for select using (true);

drop policy if exists "Public services are viewable by everyone" on public.services;
create policy "Public services are viewable by everyone" on public.services for select using (true);

drop policy if exists "Public site_content is viewable by everyone" on public.site_content;
create policy "Public site_content is viewable by everyone" on public.site_content for select using (true);

-- Admin Full Access
drop policy if exists "Authenticated users can manage projects" on public.projects;
create policy "Authenticated users can manage projects" on public.projects for all using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can manage services" on public.services;
create policy "Authenticated users can manage services" on public.services for all using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can manage site_content" on public.site_content;
create policy "Authenticated users can manage site_content" on public.site_content for all using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can view messages" on public.contact_messages;
create policy "Authenticated users can view messages" on public.contact_messages for select using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update messages" on public.contact_messages;
create policy "Authenticated users can update messages" on public.contact_messages for update using (auth.role() = 'authenticated');

-- Contact Form Public Insert
drop policy if exists "Anyone can insert messages" on public.contact_messages;
create policy "Anyone can insert messages" on public.contact_messages for insert with check (true);

-- Audit Logs - Only Admin can insert/view
drop policy if exists "Authenticated users can insert audit logs" on public.audit_logs;
create policy "Authenticated users can insert audit logs" on public.audit_logs for insert with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can view audit logs" on public.audit_logs;
create policy "Authenticated users can view audit logs" on public.audit_logs for select using (auth.role() = 'authenticated');

-- Realtime configuration
do $$
begin
  -- 1. Create publication if it doesn't exist
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;

  -- 2. Add tables to publication if they are not already in it
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'projects') then
    alter publication supabase_realtime add table public.projects;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'services') then
    alter publication supabase_realtime add table public.services;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'site_content') then
    alter publication supabase_realtime add table public.site_content;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'contact_messages') then
    alter publication supabase_realtime add table public.contact_messages;
  end if;
end
$$;

