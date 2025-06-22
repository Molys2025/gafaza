
-- Migration pour corriger les policies RLS récursives
-- Supprimer et recréer les policies pour éviter les récursions infinies

-- STEP 1: Désactiver temporairement RLS sur les tables concernées
ALTER TABLE public.groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites DISABLE ROW LEVEL SECURITY;

-- STEP 2: Supprimer toutes les policies existantes sur ces tables
-- Groups policies
DROP POLICY IF EXISTS "Group members can view their groups" ON public.groups;
DROP POLICY IF EXISTS "Work providers can create groups for their jobs" ON public.groups;
DROP POLICY IF EXISTS "Group admins and work providers can update groups" ON public.groups;

-- Group members policies
DROP POLICY IF EXISTS "Users can view group members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
DROP POLICY IF EXISTS "Group admins can manage members" ON public.group_members;

-- Messages policies (en plus de celles déjà dans la migration précédente)
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;
DROP POLICY IF EXISTS "messages_participant_access" ON public.messages;

-- Group invites policies
DROP POLICY IF EXISTS "Users can view invites sent to them" ON public.group_invites;
DROP POLICY IF EXISTS "Group members can create invites" ON public.group_invites;
DROP POLICY IF EXISTS "Users can update their own invites" ON public.group_invites;

-- STEP 3: Réactiver RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

-- STEP 4: Créer des policies simplifiées sans récursion

-- Groups - policies simplifiées
CREATE POLICY "groups_owner_access" ON public.groups
  FOR ALL USING (work_provider_id = auth.uid());

CREATE POLICY "groups_public_read" ON public.groups
  FOR SELECT USING (is_private = false);

-- Group members - policies simplifiées
CREATE POLICY "group_members_own_access" ON public.group_members
  FOR ALL USING (user_id = auth.uid());

-- Messages - policies simplifiées (remplace les précédentes)
CREATE POLICY "messages_sender_access" ON public.messages
  FOR ALL USING (sender_id = auth.uid());

CREATE POLICY "messages_receiver_access" ON public.messages
  FOR SELECT USING (receiver_id = auth.uid());

-- Group invites - policies simplifiées
CREATE POLICY "group_invites_invitee_access" ON public.group_invites
  FOR SELECT USING (invitee_id = auth.uid());

CREATE POLICY "group_invites_inviter_access" ON public.group_invites
  FOR ALL USING (inviter_id = auth.uid());
