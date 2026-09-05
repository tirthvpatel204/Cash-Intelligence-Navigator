-- Supabase Schema for Full App Features
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/retgzieuiziyhtfjnpah/sql

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles table (synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read on transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow all insert on transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on transactions" ON public.transactions FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on transactions" ON public.transactions FOR DELETE USING (true);

-- 4. Budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  month_year TEXT NOT NULL,
  allocated_amount NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read on budgets" ON public.budgets FOR SELECT USING (true);
CREATE POLICY "Allow all insert on budgets" ON public.budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on budgets" ON public.budgets FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on budgets" ON public.budgets FOR DELETE USING (true);

-- 5. Savings Goals table
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  goal_name TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL,
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  target_date TEXT,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read on savings_goals" ON public.savings_goals FOR SELECT USING (true);
CREATE POLICY "Allow all insert on savings_goals" ON public.savings_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on savings_goals" ON public.savings_goals FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on savings_goals" ON public.savings_goals FOR DELETE USING (true);

-- 6. Paper Submissions table (For research/academic submissions requested)
CREATE TABLE IF NOT EXISTS public.paper_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  authors TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'FinTech & AI',
  status TEXT NOT NULL DEFAULT 'submitted',
  file_url TEXT,
  submitted_by_id TEXT NOT NULL,
  submitted_by_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.paper_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read on papers" ON public.paper_submissions FOR SELECT USING (true);
CREATE POLICY "Allow insert on papers" ON public.paper_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on papers" ON public.paper_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow delete on papers" ON public.paper_submissions FOR DELETE USING (true);

-- 7. Paper Comments table
CREATE TABLE IF NOT EXISTS public.paper_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  paper_id UUID REFERENCES public.paper_submissions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.paper_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read on comments" ON public.paper_comments FOR SELECT USING (true);
CREATE POLICY "Allow insert on comments" ON public.paper_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete on comments" ON public.paper_comments FOR DELETE USING (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.savings_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.paper_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.paper_comments;
