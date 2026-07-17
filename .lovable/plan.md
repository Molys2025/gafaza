## Objectif
Remplacer la connexion Supabase actuelle (projet `ctclmbrymczduwnncnnj`) par un nouveau projet Supabase que vous fournirez.

## Ce dont j'ai besoin de votre part
Depuis votre nouveau projet Supabase (dashboard → Project Settings → API), me transmettre :
1. **Project URL** (ex: `https://xxxxx.supabase.co`)
2. **anon public key** (clé publique, sûre à mettre dans le code)
3. **Project ID / ref** (l'identifiant `xxxxx` dans l'URL)

Ces valeurs sont publiques et peuvent être stockées dans le code (comme actuellement).

## Étapes d'implémentation

1. **Mise à jour du client Supabase**
   - `src/integrations/supabase/client.ts` : remplacer `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` par les nouvelles valeurs.
   - `supabase/config.toml` : remplacer `project_id` par le nouveau ref.

2. **Migration du schéma vers le nouveau projet** (à faire par vous côté Supabase)
   - Le nouveau projet est vide. Il faut recréer :
     - Toutes les tables (`users`, `work_providers`, `harvesters`, `groups`, `messages`, `user_roles`, etc.)
     - Les policies RLS (versions non-récursives déjà corrigées)
     - Les fonctions (`has_role`, triggers)
     - Les buckets de storage éventuels
   - Option A : vous exportez le SQL depuis l'ancien projet et je vous aide à l'appliquer sur le nouveau.
   - Option B : je régénère les migrations SQL nécessaires à partir des types actuels.

3. **Reconfiguration des secrets edge functions**
   Les secrets suivants doivent être reconfigurés dans le nouveau projet Supabase :
   - `OPENAI_API_KEY`
   - `MAPBOX_PUBLIC_TOKEN`
   - Clés Flouci (payment)
   - Tout autre secret utilisé par les edge functions

4. **Redéploiement des edge functions**
   - `analyze-onboarding-video`, `ai-profile-assistant`, `flouci-payment`, `flouci-payment-status`, `get-secret` seront redéployées automatiquement sur le nouveau projet.

5. **Régénération des types TypeScript**
   - `src/integrations/supabase/types.ts` devra être régénéré à partir du schéma du nouveau projet une fois les tables créées.

6. **Test**
   - Vérifier auth (sign up / sign in)
   - Vérifier création d'enregistrements (profils, annonces)
   - Vérifier les edge functions (OpenAI, Mapbox, Flouci)

## Points d'attention
- **Perte de données** : les utilisateurs et données de l'ancien projet ne sont PAS transférés automatiquement. Si vous voulez migrer les données existantes, il faudra un export/import SQL.
- **Fichiers dupliqués** : `src/lib/supabase.ts` utilise `import.meta.env.VITE_SUPABASE_*` mais ces vars ne sont pas définies — ce fichier semble inutilisé. À nettoyer ou aligner sur le nouveau projet.

## Question avant de démarrer
Confirmez-vous que vous voulez **abandonner les données de l'ancien projet** (ou souhaitez-vous les migrer) ? Et pouvez-vous me communiquer l'URL et l'anon key du nouveau projet ?
