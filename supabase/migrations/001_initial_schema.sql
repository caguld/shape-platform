-- SHAPE Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (linked to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  company text,
  role text default 'trainer',
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Clients table
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  email text,
  company text,
  title text,
  notes text,
  created_at timestamptz default now()
);

-- Sessions table
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references public.profiles(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  title text not null,
  date timestamptz not null,
  duration_minutes integer default 60,
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  notes text,
  ai_prep text,
  ai_followup text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.sessions enable row level security;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Clients: trainers can only CRUD their own clients
create policy "Trainers can view own clients"
  on public.clients for select
  using (auth.uid() = trainer_id);

create policy "Trainers can insert own clients"
  on public.clients for insert
  with check (auth.uid() = trainer_id);

create policy "Trainers can update own clients"
  on public.clients for update
  using (auth.uid() = trainer_id);

create policy "Trainers can delete own clients"
  on public.clients for delete
  using (auth.uid() = trainer_id);

-- Sessions: trainers can only CRUD their own sessions
create policy "Trainers can view own sessions"
  on public.sessions for select
  using (auth.uid() = trainer_id);

create policy "Trainers can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = trainer_id);

create policy "Trainers can update own sessions"
  on public.sessions for update
  using (auth.uid() = trainer_id);

create policy "Trainers can delete own sessions"
  on public.sessions for delete
  using (auth.uid() = trainer_id);
