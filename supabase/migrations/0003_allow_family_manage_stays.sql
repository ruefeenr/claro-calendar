drop policy if exists "creators manage their stays" on public.stays;
create policy "family can update stays"
on public.stays
for update
to authenticated
using (true)
with check (true);

drop policy if exists "creators delete their stays" on public.stays;
create policy "family can delete stays"
on public.stays
for delete
to authenticated
using (true);

drop policy if exists "creators insert stay participants" on public.stay_participants;
create policy "family can insert stay participants"
on public.stay_participants
for insert
to authenticated
with check (true);

drop policy if exists "creators update stay participants" on public.stay_participants;
create policy "family can update stay participants"
on public.stay_participants
for update
to authenticated
using (true)
with check (true);

drop policy if exists "creators delete stay participants" on public.stay_participants;
create policy "family can delete stay participants"
on public.stay_participants
for delete
to authenticated
using (true);
