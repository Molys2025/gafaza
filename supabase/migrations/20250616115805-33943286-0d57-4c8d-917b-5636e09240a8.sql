
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Job seekers can manage their own profile" ON public.job_seekers;
DROP POLICY IF EXISTS "Anyone can view job seekers profiles" ON public.job_seekers;
DROP POLICY IF EXISTS "Work providers can manage their own profile" ON public.work_providers;
DROP POLICY IF EXISTS "Anyone can view work providers profiles" ON public.work_providers;
DROP POLICY IF EXISTS "Work providers can manage their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Job seekers can view and manage their own applications" ON public.applications;
DROP POLICY IF EXISTS "Work providers can view applications for their jobs" ON public.applications;
DROP POLICY IF EXISTS "Work providers can update applications for their jobs" ON public.applications;
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations they participate in" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;
DROP POLICY IF EXISTS "Group members can view their groups" ON public.groups;
DROP POLICY IF EXISTS "Work providers can create groups for their jobs" ON public.groups;
DROP POLICY IF EXISTS "Group admins and work providers can update groups" ON public.groups;
DROP POLICY IF EXISTS "Users can view group members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
DROP POLICY IF EXISTS "Group admins can manage members" ON public.group_members;
DROP POLICY IF EXISTS "Users can view invites sent to them" ON public.group_invites;
DROP POLICY IF EXISTS "Group members can create invites" ON public.group_invites;
DROP POLICY IF EXISTS "Users can update their own invites" ON public.group_invites;
DROP POLICY IF EXISTS "Users can view ratings about them" ON public.ratings;
DROP POLICY IF EXISTS "Users can create ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.ratings;

-- Enable RLS on all tables (this won't fail if already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Job seekers table policies
CREATE POLICY "Job seekers can manage their own profile" ON public.job_seekers
  FOR ALL USING (id = auth.uid());

CREATE POLICY "Anyone can view job seekers profiles" ON public.job_seekers
  FOR SELECT USING (true);

-- Work providers table policies
CREATE POLICY "Work providers can manage their own profile" ON public.work_providers
  FOR ALL USING (id = auth.uid());

CREATE POLICY "Anyone can view work providers profiles" ON public.work_providers
  FOR SELECT USING (true);

-- Jobs table policies
CREATE POLICY "Work providers can manage their own jobs" ON public.jobs
  FOR ALL USING (work_provider_id = auth.uid());

CREATE POLICY "Anyone can view active jobs" ON public.jobs
  FOR SELECT USING (status = 'active');

-- Applications table policies
CREATE POLICY "Job seekers can view and manage their own applications" ON public.applications
  FOR ALL USING (job_seeker_id = auth.uid());

CREATE POLICY "Work providers can view applications for their jobs" ON public.applications
  FOR SELECT USING (
    job_id IN (SELECT id FROM public.jobs WHERE work_provider_id = auth.uid())
  );

CREATE POLICY "Work providers can update applications for their jobs" ON public.applications
  FOR UPDATE USING (
    job_id IN (SELECT id FROM public.jobs WHERE work_provider_id = auth.uid())
  );

-- Conversations table policies
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (
    participant1_id = auth.uid() OR participant2_id = auth.uid()
  );

CREATE POLICY "Users can create conversations they participate in" ON public.conversations
  FOR INSERT WITH CHECK (
    participant1_id = auth.uid() OR participant2_id = auth.uid()
  );

CREATE POLICY "Users can update their own conversations" ON public.conversations
  FOR UPDATE USING (
    participant1_id = auth.uid() OR participant2_id = auth.uid()
  );

-- Messages table policies
CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    sender_id = auth.uid() OR 
    receiver_id = auth.uid() OR
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    ) OR
    group_id IN (
      SELECT group_id FROM public.group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages" ON public.messages
  FOR DELETE USING (sender_id = auth.uid());

-- Groups table policies
CREATE POLICY "Group members can view their groups" ON public.groups
  FOR SELECT USING (
    id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid()) OR
    is_private = false
  );

CREATE POLICY "Work providers can create groups for their jobs" ON public.groups
  FOR INSERT WITH CHECK (
    work_provider_id = auth.uid() OR work_provider_id IS NULL
  );

CREATE POLICY "Group admins and work providers can update groups" ON public.groups
  FOR UPDATE USING (
    work_provider_id = auth.uid() OR
    id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Group members table policies
CREATE POLICY "Users can view group members of their groups" ON public.group_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups" ON public.group_members
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Group admins can manage members" ON public.group_members
  FOR ALL USING (
    group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Group invites table policies
CREATE POLICY "Users can view invites sent to them" ON public.group_invites
  FOR SELECT USING (invitee_id = auth.uid() OR inviter_id = auth.uid());

CREATE POLICY "Group members can create invites" ON public.group_invites
  FOR INSERT WITH CHECK (
    inviter_id = auth.uid() AND
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own invites" ON public.group_invites
  FOR UPDATE USING (invitee_id = auth.uid());

-- Ratings table policies
CREATE POLICY "Users can view ratings about them" ON public.ratings
  FOR SELECT USING (rated_id = auth.uid() OR rater_id = auth.uid());

CREATE POLICY "Users can create ratings" ON public.ratings
  FOR INSERT WITH CHECK (rater_id = auth.uid());

CREATE POLICY "Users can update their own ratings" ON public.ratings
  FOR UPDATE USING (rater_id = auth.uid());

-- Create indexes for better performance (IF NOT EXISTS prevents errors)
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_jobs_work_provider_id ON public.jobs(work_provider_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_seeker_id ON public.applications(job_seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(participant1_id, participant2_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON public.messages(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_id ON public.ratings(rated_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rater_id ON public.ratings(rater_id);
