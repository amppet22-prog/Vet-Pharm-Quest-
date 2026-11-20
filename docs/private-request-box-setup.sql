-- Vet Pharm Quest private requests: run ONCE in the linked Supabase project's SQL editor.
-- Do not add database service keys to the public game. Use your own authenticated user UUID
-- in the owner enrollment statement at the bottom, and run that line as a database administrator.
create table if not exists public.vpq_request_owners (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.vpq_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null check (char_length(category) between 1 and 100),
  title text not null check (char_length(title) between 1 and 120),
  location text not null default '' check (char_length(location)<=140),
  details text not null check (char_length(details) between 1 and 5000),
  status text not null default 'new' check (status in ('new','reviewing','resolved'))
);
alter table public.vpq_request_owners enable row level security;
alter table public.vpq_requests enable row level security;
revoke all on public.vpq_request_owners from anon, authenticated;
revoke all on public.vpq_requests from anon, authenticated;
grant select on public.vpq_request_owners to authenticated;
grant insert on public.vpq_requests to anon, authenticated;
grant select, update on public.vpq_requests to authenticated;

drop policy if exists "Owners can recognize own membership" on public.vpq_request_owners;
create policy "Owners can recognize own membership"
on public.vpq_request_owners for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Visitors can submit requests" on public.vpq_requests;
create policy "Visitors can submit requests"
on public.vpq_requests for insert to anon, authenticated
with check (status = 'new');

drop policy if exists "Owner can read requests" on public.vpq_requests;
create policy "Owner can read requests"
on public.vpq_requests for select to authenticated
using (exists(select 1 from public.vpq_request_owners own where own.user_id = (select auth.uid())));

drop policy if exists "Owner can update request status" on public.vpq_requests;
create policy "Owner can update request status"
on public.vpq_requests for update to authenticated
using (exists(select 1 from public.vpq_request_owners own where own.user_id = (select auth.uid())))
with check (exists(select 1 from public.vpq_request_owners own where own.user_id = (select auth.uid())));

create index if not exists vpq_requests_created_at_idx on public.vpq_requests(created_at desc);

-- OWNER SETUP (replace UUID and run as administrator after signing up in the game):
-- insert into public.vpq_request_owners(user_id)
-- values ('REPLACE_WITH_YOUR_SUPABASE_AUTH_USER_UUID')
-- on conflict (user_id) do nothing;
--
-- SECURITY NOTE: Direct anonymous table inserts are suitable only for an initial small-scale
-- student project. Before widely announcing this feature, add request rate limits and
-- CAPTCHA/abuse detection in a server-side Supabase Edge Function. Never publish owner
-- user IDs, tokens, or service-role keys in client-side JavaScript.
