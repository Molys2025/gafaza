
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, guardRequest } from "../_shared/guard.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Video/audio transcription is the costliest call in the app: signed-in
  // users only, and a tight cap since onboarding runs it a handful of times.
  const guard = await guardRequest(req, { limit: 5, windowMs: 10 * 60 * 1000 });
  if ('response' in guard) return guard.response;

  try {
    const { videoData, userType, mediaType = 'video' } = await req.json();

    if (!videoData) {
      throw new Error('No media data provided');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Starting ${mediaType} analysis for user type: ${userType}`);
    
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

    console.log('Sending transcription request to OpenAI...');

    const transcribeResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!transcribeResponse.ok) {
      const errorText = await transcribeResponse.text();
      console.error('Transcription failed:', errorText);
      throw new Error(`Transcription failed: ${errorText}`);
    }

    const transcription = await transcribeResponse.json();
    const transcribedText = transcription.text;

    console.log('Transcription completed:', transcribedText);

    // Step 2: Analyze transcribed text with GPT to extract structured data
    // The JSON schema below uses the EXACT column names of the target DB tables
    // (public.work_providers / public.job_seekers) so the client can map 1:1.
    const analysisPrompt = `
Analyse le texte suivant d'une présentation ${mediaType === 'video' ? 'vidéo' : 'audio'} d'un utilisateur qui s'inscrit sur la marketplace agricole Zeytna (récolte d'olives).

Type d'utilisateur: ${userType === 'owner' ? "Propriétaire d'oliveraie (work_provider)" : 'Cueilleur / Récolteur (job_seeker)'}

Texte à analyser: "${transcribedText}"

Extrais et structure les informations au format JSON en utilisant EXACTEMENT les clés ci-dessous (les noms correspondent aux colonnes de la base). Utilise null quand l'info est absente.

{
  "personal_info": {
    "name": "nom complet si mentionné",
    "first_name": "prénom si extractible",
    "last_name": "nom de famille si extractible",
    "location": "ville / région mentionnée",
    "experience_years": "nombre d'années d'expérience (integer)"
  },
  "phone": "numéro de téléphone si mentionné",
  "whatsapp": "numéro WhatsApp si mentionné",
  ${userType === 'owner' ? `
  "property_info": {
    "business_name": "nom de l'exploitation / entreprise",
    "property_address": "adresse ou localisation précise de la propriété",
    "property_size": "surface de la propriété en hectares (number)",
    "tree_count": "nombre d'oliviers (integer)",
    "olive_types": ["variétés d'olives mentionnées"]
  }` : `
  "skills_and_services": {
    "specializations": ["compétences / techniques maîtrisées → colonne skills"],
    "daily_rate": "tarif journalier en TND (number) → colonne daily_rate",
    "bio": "courte présentation / bio du cueilleur"
  },
  "work_preferences": {
    "preferred_regions": ["régions où le cueilleur accepte de travailler → colonne preferred_regions"]
  }`}
  "additional_info": {
    "special_notes": "informations importantes non catégorisées"
  },
  "confidence_score": "score de confiance sur l'extraction (0-100)",
  "missing_info": ["informations importantes manquantes à demander"],
  "media_type": "${mediaType}"
}

Réponds uniquement avec le JSON structuré, sans texte additionnel.
`;

    console.log('Sending analysis request to OpenAI GPT...');

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
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
      const errorText = await analysisResponse.text();
      console.error('Analysis failed:', errorText);
      throw new Error(`Analysis failed: ${errorText}`);
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

    console.log('Successfully processed media and extracted data');

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
