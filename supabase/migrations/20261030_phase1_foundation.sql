-- VIP ROOM Phase 1: identity, source provenance, and RLS foundation.
create extension if not exists pgcrypto;
create type public.app_role as enum ('admin', 'member');
create type public.visibility as enum ('private', 'friends');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 40),
  avatar_url text,
  role public.app_role not null default 'member',
  is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(nullif(left(new.raw_user_meta_data->>'nickname', 40), ''), 'VIP-' || left(new.id::text, 8)));
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create table public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  locale text not null default 'ko', theme text not null default 'dark' check (theme in ('dark','system')),
  lyric_font_size smallint not null default 18 check (lyric_font_size between 12 and 32), lyric_auto_scroll boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.invitations (
  id uuid primary key default gen_random_uuid(), code text not null unique, expires_at timestamptz not null,
  max_uses integer not null default 1 check (max_uses > 0), uses integer not null default 0 check (uses >= 0),
  requires_approval boolean not null default false, created_by uuid not null references public.profiles(id), created_at timestamptz not null default now()
);
create table public.artists (id uuid primary key default gen_random_uuid(), name text not null, kind text not null check(kind in ('group','member','unit','guest')), source_url text, source_name text, verification_status text not null default 'unverified', verified_at timestamptz, last_updated_at timestamptz not null default now(), unique(name));
create table public.albums (id uuid primary key default gen_random_uuid(), title text not null, artist_id uuid references public.artists(id), release_date date, album_type text, country_code text, cover_url text, source_url text, source_name text, verification_status text not null default 'unverified', verified_at timestamptz, last_updated_at timestamptz not null default now());
create table public.tracks (id uuid primary key default gen_random_uuid(), title text not null, title_en text, primary_artist_id uuid references public.artists(id), duration_ms integer check(duration_ms >= 0), source_url text, source_name text, verification_status text not null default 'unverified', verified_at timestamptz, last_updated_at timestamptz not null default now());
create table public.album_tracks (album_id uuid references public.albums(id) on delete cascade, track_id uuid references public.tracks(id) on delete cascade, disc_number smallint not null default 1, track_number smallint not null, primary key(album_id, track_id), unique(album_id, disc_number, track_number));
-- Metadata only: browser-resident audio blobs are deliberately never stored here.
create table public.user_track_library (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, track_id uuid references public.tracks(id) on delete set null, local_file_key text not null, file_name text not null, fingerprint text, duration_ms integer, created_at timestamptz not null default now(), unique(user_id, local_file_key));
create index user_track_library_owner_idx on public.user_track_library(user_id);
create table public.favorites (user_id uuid references public.profiles(id) on delete cascade, track_id uuid references public.tracks(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id, track_id));
alter table public.profiles enable row level security; alter table public.user_settings enable row level security; alter table public.invitations enable row level security; alter table public.user_track_library enable row level security; alter table public.favorites enable row level security;
create policy "profiles readable by signed in users" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()) and is_active = (select is_active from public.profiles where id = auth.uid()));
create policy "users manage own settings" on public.user_settings for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own library metadata" on public.user_track_library for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own favorites" on public.favorites for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins manage invitations" on public.invitations for all to authenticated using ((select role from public.profiles where id = auth.uid()) = 'admin') with check ((select role from public.profiles where id = auth.uid()) = 'admin');
