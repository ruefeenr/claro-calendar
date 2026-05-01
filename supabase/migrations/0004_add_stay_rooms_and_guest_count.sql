alter table public.stays
add column if not exists guest_count integer not null default 1,
add column if not exists room_ids text[] not null default '{}';

alter table public.stays
drop constraint if exists stays_guest_count_positive,
add constraint stays_guest_count_positive check (guest_count >= 1);

alter table public.stays
drop constraint if exists stays_room_ids_known,
add constraint stays_room_ids_known
check (room_ids <@ array['office', 'parents', 'garden', 'living']::text[]);
