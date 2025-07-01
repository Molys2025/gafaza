
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, currentProfile, userType, conversationHistory } = await req.json();

    // Build context for the AI assistant
    const systemPrompt = `
Tu es un assistant IA spécialisé dans l'aide à la création de profils pour une marketplace agricole (Zeytna) dédiée à la récolte d'olives en Tunisie.

Type d'utilisateur: ${userType === 'owner' ? 'Propriétaire d\'oliveraie' : 'Cueilleur/Récolteur'}

Profil actuel de l'utilisateur:
${JSON.stringify(currentProfile, null, 2)}

Ton rôle:
- Aider l'utilisateur à compléter et affiner son profil
- Poser des questions pertinentes pour obtenir les informations manquantes
- Suggérer des améliorations basées sur les bonnes pratiques
- Guider vers une finalisation du profil
- Être amical, professionnel et encourageant
- Répondre en français

Instructions spéciales:
- Si l'utilisateur semble satisfait de son profil, propose de le finaliser
- Identifie les informations critiques manquantes (localisation, contact, etc.)
- Donne des conseils pour améliorer l'attractivité du profil
- Reste concis et actionnable dans tes réponses

${userType === 'owner' ? 
  `Focus propriétaire:
  - Taille et localisation de la propriété
  - Nombre d'oliviers et variétés
  - Période de récolte
  - Nombre de cueilleurs recherchés
  - Budget et conditions de travail
  - Logement et repas pour les cueilleurs` :
  `Focus cueilleur:
  - Expérience et spécialisations
  - Zone de travail acceptée
  - Tarifs journaliers
  - Équipements possédés
  - Disponibilités
  - Moyens de transport`
}

Quand tu estimes que le profil est suffisamment complet (>80% des infos essentielles), tu peux suggérer la finalisation.
`;

    // Build conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        functions: [
          {
            name: 'update_profile',
            description: 'Met à jour le profil utilisateur avec de nouvelles informations',
            parameters: {
              type: 'object',
              properties: {
                updates: {
                  type: 'object',
                  description: 'Objet contenant les mises à jour du profil'
                },
                completion_percentage: {
                  type: 'number',
                  description: 'Pourcentage de completion du profil (0-100)'
                }
              }
            }
          },
          {
            name: 'finalize_profile',
            description: 'Finalise le profil utilisateur quand il est suffisamment complet',
            parameters: {
              type: 'object',
              properties: {
                final_profile: {
                  type: 'object',
                  description: 'Profil final structuré pour la base de données'
                }
              }
            }
          }
        ],
        function_call: 'auto'
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const result = await response.json();
    const assistantMessage = result.choices[0].message;

    let responseData = {
      response: assistantMessage.content,
      updatedProfile: null,
      isComplete: false
    };

    // Handle function calls
    if (assistantMessage.function_call) {
      const functionName = assistantMessage.function_call.name;
      const functionArgs = JSON.parse(assistantMessage.function_call.arguments);

      if (functionName === 'update_profile') {
        responseData.updatedProfile = {
          ...currentProfile,
          ...functionArgs.updates
        };
        
        // Add a message about the update
        responseData.response = assistantMessage.content + 
          '\n\n✅ J\'ai mis à jour votre profil avec ces nouvelles informations.';
      }

      if (functionName === 'finalize_profile') {
        responseData.updatedProfile = functionArgs.final_profile;
        responseData.isComplete = true;
        responseData.response = assistantMessage.content + 
          '\n\n🎉 Parfait ! Votre profil est maintenant complet. Je vais procéder à sa création...';
      }
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-profile-assistant:', error);
    return new Response(JSON.stringify({
      error: error.message,
      response: 'Désolé, j\'ai rencontré une erreur. Pouvez-vous réessayer ?'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
