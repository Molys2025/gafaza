
-- Drop existing problematic policies that might cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Create or replace security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new policies using the security definer function
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (id = public.get_current_user_id());

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (id = public.get_current_user_id());

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (id = public.get_current_user_id());
