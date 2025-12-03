-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories Table
create table public.categories (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  color text not null,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Goals Table
create table public.goals (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  category_id text not null, -- Keeping as text to match frontend ID usage, or could be FK if categories are strictly relational
  year integer not null,
  emoji text not null,
  title text not null,
  description text, -- Optional description, max 100 chars enforced in app
  type text not null, -- 'NUMERIC' | 'BOOLEAN'
  target_value numeric,
  unit text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.goals enable row level security;
create policy "Users can view own goals" on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on public.goals for delete using (auth.uid() = user_id);

-- Monthly Records Table
create table public.monthly_records (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  goal_id text not null,
  year integer not null,
  month integer not null,
  numeric_value numeric,
  status text, -- 'SUCCESS' | 'FAIL' | 'HOLD'
  achieved boolean, -- Legacy
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, goal_id, year, month) -- Prevent duplicates
);
alter table public.monthly_records enable row level security;
create policy "Users can view own records" on public.monthly_records for select using (auth.uid() = user_id);
create policy "Users can insert own records" on public.monthly_records for insert with check (auth.uid() = user_id);
create policy "Users can update own records" on public.monthly_records for update using (auth.uid() = user_id);
create policy "Users can delete own records" on public.monthly_records for delete using (auth.uid() = user_id);

-- Retrospectives Table
create table public.retrospectives (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  year integer not null,
  month integer not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, year, month)
);
alter table public.retrospectives enable row level security;
create policy "Users can view own retrospectives" on public.retrospectives for select using (auth.uid() = user_id);
create policy "Users can insert own retrospectives" on public.retrospectives for insert with check (auth.uid() = user_id);
create policy "Users can update own retrospectives" on public.retrospectives for update using (auth.uid() = user_id);
create policy "Users can delete own retrospectives" on public.retrospectives for delete using (auth.uid() = user_id);

-- Resolutions Table
create table public.resolutions (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  year integer not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, year)
);
alter table public.resolutions enable row level security;
create policy "Users can view own resolutions" on public.resolutions for select using (auth.uid() = user_id);
create policy "Users can insert own resolutions" on public.resolutions for insert with check (auth.uid() = user_id);
create policy "Users can update own resolutions" on public.resolutions for update using (auth.uid() = user_id);
create policy "Users can delete own resolutions" on public.resolutions for delete using (auth.uid() = user_id);
