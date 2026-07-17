## Objectif
Connecter l'application au nouveau projet Supabase `kefwnqnptjyqqnkqmxxl` en repartant de zéro (aucune migration de données).

## Étapes

### 1. Mettre à jour le client Supabase
Modifier `src/integrations/supabase/client.ts` :
- `SUPABASE_URL` → `https://kefwnqnptjyqqnkqmxxl.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` → `sb_publishable_qDtyhwpGpfcsygnnaxEf8A_fZJiijf-`

### 2. Recréer le schéma sur le nouveau projet
Le nouveau projet est vide. Il faut rejouer l'intégralité du schéma actuel :
- Tables métier : `users`, `job_seekers`, `work_providers`, `profiles`, `owner_profiles`, `harvester_profiles`, `jobs`, `applications`, `conversations`, `messages`, `groups`, `group_members`, `group_invites`, `payments`, etc.
- Fonctions security definer : `get_current_user_id`, `get_current_user_role`, `has_role`
- Policies RLS (versions non-récursives déjà finalisées)
- Triggers (`handle_new_user`, updated_at)
- Storage buckets (avatars, vidéos onboarding)

Consolidation dans une nouvelle migration `supabase/migrations/<timestamp>-initial-schema-new-project.sql` regroupant l'état final actuel.

### 3. Redéployer les Edge Functions
Les fonctions existent déjà dans le repo (`analyze-onboarding-video`, `ai-profile-assistant`, `flouci-payment`, `flouci-payment-status`). Elles seront redéployées automatiquement sur le nouveau projet.

### 4. Reconfigurer les secrets
Les secrets sont liés à l'ancien projet. À reconfigurer sur le nouveau :
- `OPENAI_API_KEY`
- `FLOUCI_APP_TOKEN` / `FLOUCI_APP_SECRET` (si utilisés)

Je demanderai ces secrets via `add_secret` une fois le nouveau projet actif.

### 5. Vérification
- Test connexion (Sign Up / Sign In)
- Onglet **Admin > Tests** (CRUDTest + SupabaseDiagnostic) pour valider les policies RLS
- Test création profil Cueilleur et Propriétaire

## Point d'attention
La clé fournie est au format nouveau (`sb_publishable_...`) et non un JWT anon classique. Elle est compatible avec `@supabase/supabase-js` v2 récent, mais si vous rencontrez un souci d'auth, il faudra récupérer aussi la **anon key JWT** classique dans Settings → API du projet Supabase.

## Confirmation nécessaire
- L'ancien projet `ctclmbrymczduwnncnnj` peut-il être définitivement abandonné ?
- Souhaitez-vous que je regroupe tout le schéma actuel dans une seule migration initiale pour le nouveau projet ?