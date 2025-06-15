
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  console.log(`Requête reçue: ${req.method} ${req.url}`)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name } = await req.json()
    console.log(`Recherche du secret: ${name}`)

    if (!name) {
      console.error('Nom du secret manquant')
      return new Response(
        JSON.stringify({ error: 'Secret name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Récupérer le secret depuis les variables d'environnement
    const value = Deno.env.get(name)
    console.log(`Secret trouvé: ${name} = ${value ? 'OUI (longueur: ' + value.length + ')' : 'NON'}`)

    if (!value) {
      console.error(`Secret non trouvé: ${name}`)
      return new Response(
        JSON.stringify({ error: `Secret '${name}' not found` }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Retour du secret avec succès')
    return new Response(
      JSON.stringify({ value }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Erreur dans la fonction:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
