
-- STEP 1: Disable RLS on all affected tables to avoid conflicts during cleanup
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL existing policies by their exact names
-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Job seekers policies
DROP POLICY IF EXISTS "Job seekers can manage their own profile" ON public.job_seekers;
DROP POLICY IF EXISTS "job_seekers_all_own" ON public.job_seekers;

-- Work providers policies
DROP POLICY IF EXISTS "Work providers can manage their own profile" ON public.work_providers;
DROP POLICY IF EXISTS "work_providers_all_own" ON public.work_providers;

-- Jobs policies
DROP POLICY IF EXISTS "Work providers can manage their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "jobs_all_own" ON public.jobs;
DROP POLICY IF EXISTS "Everyone can view published jobs" ON public.jobs;

-- Applications policies
DROP POLICY IF EXISTS "Job seekers can view and manage their own applications" ON public.applications;
DROP POLICY IF EXISTS "applications_all_own" ON public.applications;

-- Messages and conversations policies
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;

-- STEP 3: Drop ALL problematic functions that might cause recursion
DROP FUNCTION IF EXISTS public.get_current_user_id();
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- STEP 4: Re-enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create new MINIMAL policies using ONLY auth.uid()
-- Users table - only access to own record
CREATE POLICY "users_own_access" ON public.users
  FOR ALL USING (id = auth.uid());

-- Job seekers - only access to own profile
CREATE POLICY "job_seekers_own_access" ON public.job_seekers
  FOR ALL USING (id = auth.uid());

-- Work providers - only access to own profile
CREATE POLICY "work_providers_own_access" ON public.work_providers
  FOR ALL USING (id = auth.uid());

-- Jobs - work providers can manage their own jobs, everyone can view published jobs
CREATE POLICY "jobs_owner_access" ON public.jobs
  FOR ALL USING (work_provider_id = auth.uid());

CREATE POLICY "jobs_public_read" ON public.jobs
  FOR SELECT USING (status = 'published');

-- Applications - job seekers can manage their own applications
CREATE POLICY "applications_own_access" ON public.applications
  FOR ALL USING (job_seeker_id = auth.uid());

-- Messages - users can access messages they sent or received
CREATE POLICY "messages_participant_access" ON public.messages
  FOR ALL USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Conversations - users can access conversations they participate in
CREATE POLICY "conversations_participant_access" ON public.conversations
  FOR ALL USING (participant1_id = auth.uid() OR participant2_id = auth.uid());

-- STEP 6: Create a simple role function that doesn't reference users table
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(auth.jwt() ->> 'role', 'anonymous');
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- STEP 7: Create a simple user ID function that uses only auth.uid()
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
