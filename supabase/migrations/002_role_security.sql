-- Migration 002: Role-based security
-- @adaptig.com emails = trainers (auto)
-- Other emails = clients (invited by trainers)

-- ============================================
-- 1. Update handle_new_user trigger to set role based on email domain
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    case
      when new.email like '%@adaptig.com' then 'trainer'
      else 'client'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- ============================================
-- 2. Client invitations table
-- ============================================
create table public.client_invitations (
  id uuid default uuid_generate_v4() primary key,
  trainer_id uuid references public.profiles(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete set null,
  email text not null,
  name text,
  title text,
  level text default 'C-Suite' check (level in ('C-Suite', 'VP', 'Director', 'Manager', 'Individual')),
  status text default 'pending' check (status in ('pending', 'accepted', 'expired')),
  invite_token uuid default uuid_generate_v4() unique not null,
  created_at timestamptz default now(),
  accepted_at timestamptz
);

-- RLS for invitations
alter table public.client_invitations enable row level security;

-- Trainers can manage their own invitations
create policy "Trainers can view own invitations"
  on public.client_invitations for select
  using (auth.uid() = trainer_id);

create policy "Trainers can insert invitations"
  on public.client_invitations for insert
  with check (auth.uid() = trainer_id);

create policy "Trainers can update own invitations"
  on public.client_invitations for update
  using (auth.uid() = trainer_id);

create policy "Trainers can delete own invitations"
  on public.client_invitations for delete
  using (auth.uid() = trainer_id);

-- Anyone can read an invitation by token (for the join page)
-- We use a function for this since RLS can't do unauthenticated access easily
create or replace function public.get_invitation_by_token(token uuid)
returns table (
  id uuid,
  trainer_id uuid,
  company_id uuid,
  email text,
  name text,
  title text,
  level text,
  status text,
  trainer_name text,
  company_name text
) as $$
begin
  return query
  select
    ci.id,
    ci.trainer_id,
    ci.company_id,
    ci.email,
    ci.name,
    ci.title,
    ci.level,
    ci.status,
    p.full_name as trainer_name,
    c.name as company_name
  from public.client_invitations ci
  left join public.profiles p on p.id = ci.trainer_id
  left join public.companies c on c.id = ci.company_id
  where ci.invite_token = token
    and ci.status = 'pending';
end;
$$ language plpgsql security definer;

-- ============================================
-- 3. Function to accept invitation after client signs up
-- ============================================
create or replace function public.accept_invitation(token uuid, user_id uuid)
returns void as $$
declare
  inv record;
begin
  -- Get the invitation
  select * into inv from public.client_invitations
  where invite_token = token and status = 'pending';

  if inv is null then
    raise exception 'Invalid or expired invitation';
  end if;

  -- Update invitation status
  update public.client_invitations
  set status = 'accepted', accepted_at = now()
  where id = inv.id;

  -- Create a client record linked to the trainer
  insert into public.clients (trainer_id, company_id, name, email, title, level)
  values (
    inv.trainer_id,
    inv.company_id,
    coalesce(inv.name, ''),
    inv.email,
    inv.title,
    coalesce(inv.level, 'C-Suite')
  );

  -- Link the profile to this invitation's trainer
  update public.profiles
  set company = (select name from public.companies where id = inv.company_id)
  where id = user_id;
end;
$$ language plpgsql security definer;

-- ============================================
-- 4. Update clients RLS to also allow clients to view their own record
-- ============================================
create policy "Clients can view own record"
  on public.clients for select
  using (email = (select email from public.profiles where id = auth.uid()));

-- ============================================
-- 5. Update sessions RLS to allow clients to view their own sessions
-- ============================================
create policy "Clients can view own sessions"
  on public.sessions for select
  using (
    client_id in (
      select id from public.clients
      where email = (select email from public.profiles where id = auth.uid())
    )
  );

-- ============================================
-- 6. Allow clients to view the company they belong to
-- ============================================
create policy "Clients can view their company"
  on public.companies for select
  using (
    id in (
      select company_id from public.clients
      where email = (select email from public.profiles where id = auth.uid())
    )
  );
