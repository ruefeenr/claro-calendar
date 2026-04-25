create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text not null,
  display_color text not null default '#2563eb',
  avatar_emoji text not null default '🐼',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_display_color_format check (display_color ~ '^#[0-9A-Fa-f]{6}$')
);

create table if not exists public.stays (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_date date not null,
  end_date date not null,
  note text,
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint stays_date_order check (end_date >= start_date)
);

create table if not exists public.stay_participants (
  stay_id uuid not null references public.stays (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (stay_id, profile_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists stays_set_updated_at on public.stays;
create trigger stays_set_updated_at
before update on public.stays
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.stays enable row level security;
alter table public.stay_participants enable row level security;

drop policy if exists "family can read profiles" on public.profiles;
create policy "family can read profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "users manage own profile" on public.profiles;
create policy "users manage own profile"
on public.profiles
for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "family can read stays" on public.stays;
create policy "family can read stays"
on public.stays
for select
to authenticated
using (true);

drop policy if exists "family can create stays" on public.stays;
create policy "family can create stays"
on public.stays
for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "creators manage their stays" on public.stays;
create policy "creators manage their stays"
on public.stays
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

drop policy if exists "creators delete their stays" on public.stays;
create policy "creators delete their stays"
on public.stays
for delete
to authenticated
using (auth.uid() = created_by);

drop policy if exists "family can read stay participants" on public.stay_participants;
create policy "family can read stay participants"
on public.stay_participants
for select
to authenticated
using (true);

drop policy if exists "creators insert stay participants" on public.stay_participants;
create policy "creators insert stay participants"
on public.stay_participants
for insert
to authenticated
with check (
  exists (
    select 1
    from public.stays
    where public.stays.id = stay_id
      and public.stays.created_by = auth.uid()
  )
);

drop policy if exists "creators update stay participants" on public.stay_participants;
create policy "creators update stay participants"
on public.stay_participants
for update
to authenticated
using (
  exists (
    select 1
    from public.stays
    where public.stays.id = stay_id
      and public.stays.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.stays
    where public.stays.id = stay_id
      and public.stays.created_by = auth.uid()
  )
);

drop policy if exists "creators delete stay participants" on public.stay_participants;
create policy "creators delete stay participants"
on public.stay_participants
for delete
to authenticated
using (
  exists (
    select 1
    from public.stays
    where public.stays.id = stay_id
      and public.stays.created_by = auth.uid()
  )
);
