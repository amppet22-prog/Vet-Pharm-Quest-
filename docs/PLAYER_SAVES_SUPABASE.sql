-- Run in the Supabase SQL Editor after setting up project authentication.
-- Every authenticated player can only read and write their own clinic progress.
create table if not exists public.player_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint player_saves_is_object check (jsonb_typeof(save_data) = 'object'),
  constraint player_saves_max_size check (octet_length(save_data::text) <= 524288)
);
alter table public.player_saves enable row level security;
revoke all on public.player_saves from anon;
grant select,insert,update,delete on public.player_saves to authenticated;
drop policy if exists player_saves_select_own on public.player_saves;
create policy player_saves_select_own on public.player_saves
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists player_saves_insert_own on public.player_saves;
create policy player_saves_insert_own on public.player_saves
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists player_saves_update_own on public.player_saves;
create policy player_saves_update_own on public.player_saves
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
drop policy if exists player_saves_delete_own on public.player_saves;
create policy player_saves_delete_own on public.player_saves
  for delete to authenticated using (auth.uid() = user_id);
create or replace function public.set_player_saves_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists player_saves_updated_at on public.player_saves;
create trigger player_saves_updated_at before update on public.player_saves
for each row execute function public.set_player_saves_updated_at();
