-- Paws — Phase 2a schema. Paste into the Supabase SQL editor and run.
-- Mirrors src/types.ts. IDs for sitters/services are stable text keys the app
-- already uses (e.g. 'svc-boarding'); reviews/reservations get generated uuids.

-- ── Enums ──────────────────────────────────────────────────────
create type pricing_unit as enum ('night', 'day', 'walk', 'hour', 'visit');
create type reservation_source as enum ('direct', 'manual');
create type reservation_status as enum ('pending', 'approved', 'declined', 'cancelled');

-- ── Tables ─────────────────────────────────────────────────────
create table sitters (
  id       text primary key,
  slug     text unique not null,
  name     text not null,
  avatar   text,
  headline text,
  bio      text,
  area     text,
  photos   text[] not null default '{}',
  whatsapp text
);

create table services (
  id                  text primary key,
  sitter_id           text not null references sitters(id) on delete cascade,
  name                text not null,
  unit                pricing_unit not null,
  base_rate           numeric not null,
  additional_pet_rate numeric not null,
  active              boolean not null default true
);

create table reviews (
  id        uuid primary key default gen_random_uuid(),
  sitter_id text not null references sitters(id) on delete cascade,
  author    text not null,
  rating    int  not null check (rating between 1 and 5),
  date      date not null,
  text      text not null
);

-- The DirectReservation | ManualBlock union as one table, discriminated by
-- `source`, with a CHECK enforcing the shape of each variant.
create table reservations (
  id         uuid primary key default gen_random_uuid(),
  sitter_id  text not null references sitters(id) on delete cascade,
  source     reservation_source not null,
  start_date date not null,
  end_date   date not null,
  status     reservation_status not null default 'pending',
  created_at timestamptz not null default now(),
  notes      text,
  -- direct-only
  service_id    text references services(id),
  pets          int,
  quoted_price  numeric,
  contact_name  text,
  contact_email text,
  contact_phone text,
  pet_details   text,
  message       text,
  -- manual-only
  title text,
  constraint reservation_shape check (
    (source = 'direct'
      and service_id is not null and pets is not null and quoted_price is not null
      and contact_name is not null and contact_email is not null)
    or
    (source = 'manual' and title is not null)
  )
);

-- Public availability: booked ranges only, NO client PII.
create view availability as
  select sitter_id, start_date, end_date
  from reservations
  where status = 'approved';

-- ── Row Level Security ─────────────────────────────────────────
-- ⚠️ INTERIM (no auth yet): the reservations table is fully open to the anon
-- key so the un-gated admin still works. Phase 2b locks this down (admin-only
-- reads of full rows; public reads only the `availability` view).
alter table sitters      enable row level security;
alter table services     enable row level security;
alter table reviews      enable row level security;
alter table reservations enable row level security;

create policy "public read sitters"  on sitters  for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read reviews"  on reviews  for select using (true);

create policy "read reservations"    on reservations for select using (true);
create policy "insert reservations"  on reservations for insert with check (true);
create policy "update reservations"  on reservations for update using (true);
create policy "delete reservations"  on reservations for delete using (true);

grant select on availability to anon, authenticated;
