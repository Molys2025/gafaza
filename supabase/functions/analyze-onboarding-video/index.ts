
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
    const { videoData, userType, mediaType = 'video' } = await req.json();

    if (!videoData) {
      throw new Error('No media data provided');
    }

    // Step 1: Extract audio and transcribe with Whisper
    console.log(`Starting ${mediaType} analysis...`);
    
    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(videoData), c => c.charCodeAt(0));
    
    // Create FormData for Whisper API
    const formData = new FormData();
    const blob = new Blob([binaryData], { 
      type: mediaType === 'video' ? 'video/webm' : 'audio/webm' 
    });
    formData.append('file', blob, `media.webm`);
    formData.append('model', 'whisper-1');
    formData.append('language', 'fr');

    const transcribeResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!transcribeResponse.ok) {
      throw new Error(`Transcription failed: ${await transcribeResponse.text()}`);
    }

    const transcription = await transcribeResponse.json();
    const transcribedText = transcription.text;

    console.log('Transcription completed:', transcribedText);

    // Step 2: Analyze transcribed text with GPT to extract structured data
    const analysisPrompt = `
Analyse le texte suivant d'une présentation ${mediaType === 'video' ? 'vidéo' : 'audio'} d'un utilisateur qui s'inscrit sur une marketplace agricole (Zeytna) spécialisée dans la récolte d'olives.

Type d'utilisateur: ${userType === 'owner' ? 'Propriétaire d\'oliveraie' : 'Cueilleur/Récolteur'}

Texte à analyser: "${transcribedText}"

Extrais et structure les informations suivantes au format JSON :

{
  "personal_info": {
    "name": "nom complet si mentionné",
    "location": "ville, région ou zone géographique mentionnée",
    "experience_years": "nombre d'années d'expérience si mentionné (nombre)",
    "age_range": "tranche d'âge estimée si pertinent"
  },
  ${userType === 'owner' ? `
  "property_info": {
    "property_size": "taille de la propriété si mentionnée",
    "tree_count": "nombre d'oliviers si mentionné (nombre)",
    "olive_varieties": "variétés d'olives mentionnées",
    "harvest_period": "période de récolte mentionnée",
    "property_location": "localisation précise de la propriété"
  },
  "services_needed": {
    "workers_needed": "nombre de cueilleurs recherchés (nombre)",
    "work_type": "type de travail demandé",
    "budget": "budget mentionné",
    "urgency": "urgence de la demande",
    "special_requirements": "exigences particulières"
  }` : `
  "skills_and_services": {
    "specializations": ["liste des spécialisations mentionnées"],
    "equipment_owned": ["équipements possédés"],
    "availability": "disponibilité mentionnée",
    "work_radius": "zone de travail acceptée",
    "daily_rate": "tarif journalier si mentionné",
    "team_size": "travaille seul ou en équipe"
  },
  "work_preferences": {
    "preferred_regions": ["régions préférées"],
    "work_schedule": "horaires de travail préférés",
    "transportation": "moyen de transport",
    "accommodation": "besoin d'hébergement"
  }`}
  "additional_info": {
    "motivation": "motivation principale",
    "contact_preference": "préférence de contact (téléphone, WhatsApp, etc.)",
    "languages": ["langues parlées"],
    "special_notes": "informations importantes non catégorisées"
  },
  "confidence_score": "score de confiance sur l'extraction (0-100)",
  "missing_info": ["informations importantes manquantes à demander"],
  "media_type": "${mediaType}"
}

Réponds uniquement avec le JSON structuré, sans texte additionnel.
`;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en extraction d\'informations structurées. Tu extrais des données précises à partir de présentations orales et tu les structures au format JSON.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`Analysis failed: ${await analysisResponse.text()}`);
    }

    const analysisResult = await analysisResponse.json();
    const extractedDataText = analysisResult.choices[0].message.content;

    console.log('Analysis completed:', extractedDataText);

    // Parse the JSON response
    let extractedData;
    try {
      extractedData = JSON.parse(extractedDataText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Fallback: create a basic structure
      extractedData = {
        personal_info: {
          name: "Information extraite du média",
          location: "À préciser",
        },
        transcription: transcribedText,
        confidence_score: 50,
        missing_info: ["Informations à compléter avec l'assistant"],
        media_type: mediaType
      };
    }

    // Add the original transcription for reference
    extractedData.original_transcription = transcribedText;
    extractedData.media_type = mediaType;

    return new Response(JSON.stringify({
      success: true,
      extractedData: extractedData,
      transcription: transcribedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-onboarding-video:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
