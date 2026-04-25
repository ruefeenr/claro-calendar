alter table public.profiles
add column if not exists avatar_emoji text not null default '🐼';

update public.profiles
set avatar_emoji = '🐼'
where avatar_emoji is null or avatar_emoji = '';
