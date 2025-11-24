-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  persona jsonb, -- Stores adaptive profile (learning style, level, etc.)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses table
create table if not exists courses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  topic text not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Modules table
create table if not exists modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Lessons table
create table if not exists lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references modules(id) on delete cascade not null,
  title text not null,
  content jsonb not null, -- Stores explanation, examples, analogies, images, graphs
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quizzes table
create table if not exists quizzes (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references lessons(id) on delete cascade not null,
  questions jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student Progress table (Renamed from user_progress to avoid keyword conflicts)
create table if not exists student_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  lesson_id uuid references lessons(id) not null,
  completed boolean default false,
  score integer,
  last_accessed timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- RLS Policies
alter table profiles enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table quizzes enable row level security;
alter table student_progress enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- Courses policies
create policy "Users can view own courses." on courses for select using ( auth.uid() = user_id );
create policy "Users can insert own courses." on courses for insert with check ( auth.uid() = user_id );

-- Modules/Lessons/Quizzes policies
create policy "Users can view modules of own courses." on modules for select using ( exists ( select 1 from courses where id = modules.course_id and user_id = auth.uid() ) );
create policy "Users can view lessons of own courses." on lessons for select using ( exists ( select 1 from modules join courses on modules.course_id = courses.id where modules.id = lessons.module_id and courses.user_id = auth.uid() ) );

-- Progress policies
create policy "Users can view own progress." on student_progress for select using ( auth.uid() = user_id );
create policy "Users can insert own progress." on student_progress for insert with check ( auth.uid() = user_id );
create policy "Users can update own progress." on student_progress for update using ( auth.uid() = user_id );
