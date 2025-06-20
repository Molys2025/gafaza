
-- First, disable RLS temporarily to avoid any conflicts
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Job seekers can manage their own profile" ON public.job_seekers;
DROP POLICY IF EXISTS "Work providers can manage their own profile" ON public.work_providers;
DROP POLICY IF EXISTS "Work providers can manage their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Job seekers can view and manage their own applications" ON public.applications;

-- Drop any problematic functions
DROP FUNCTION IF EXISTS public.get_current_user_id();
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create new clean policies using ONLY auth.uid() - no subqueries
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "job_seekers_all_own" ON public.job_seekers
  FOR ALL USING (id = auth.uid());

CREATE POLICY "work_providers_all_own" ON public.work_providers
  FOR ALL USING (id = auth.uid());

CREATE POLICY "jobs_all_own" ON public.jobs
  FOR ALL USING (work_provider_id = auth.uid());

CREATE POLICY "applications_all_own" ON public.applications
  FOR ALL USING (job_seeker_id = auth.uid());

-- Create a simple security definer function for role checking (if needed elsewhere)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT auth.jwt() ->> 'role';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
