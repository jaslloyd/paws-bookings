-- Allow the (currently un-gated) admin to create/edit services.
-- ⚠️ INTERIM — open to the anon key, same as reservations. Phase 2b locks this
-- down to the signed-in sitter. Run once in the Supabase SQL editor.
create policy "insert services" on services for insert with check (true);
create policy "update services" on services for update using (true);
