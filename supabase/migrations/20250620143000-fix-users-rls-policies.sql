
-- Drop existing problematic policies that cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Create simple policies using auth.uid() directly to avoid recursion
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Also drop and recreate the security definer function to ensure it's clean
DROP FUNCTION IF EXISTS public.get_current_user_id();

CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update other policies that might be using the problematic pattern
-- Drop and recreate job_seekers policies
DROP POLICY IF EXISTS "Job seekers can manage their own profile" ON public.job_seekers;
CREATE POLICY "Job seekers can manage their own profile" ON public.job_seekers
  FOR ALL USING (id = auth.uid());

-- Drop and recreate work_providers policies  
DROP POLICY IF EXISTS "Work providers can manage their own profile" ON public.work_providers;
CREATE POLICY "Work providers can manage their own profile" ON public.work_providers
  FOR ALL USING (id = auth.uid());

-- Drop and recreate jobs policies
DROP POLICY IF EXISTS "Work providers can manage their own jobs" ON public.jobs;
CREATE POLICY "Work providers can manage their own jobs" ON public.jobs
  FOR ALL USING (work_provider_id = auth.uid());

-- Drop and recreate applications policies
DROP POLICY IF EXISTS "Job seekers can view and manage their own applications" ON public.applications;
CREATE POLICY "Job seekers can view and manage their own applications" ON public.applications
  FOR ALL USING (job_seeker_id = auth.uid());
