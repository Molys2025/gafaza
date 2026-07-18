
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// SECURITY: this endpoint is publicly reachable, so it must NEVER be able to
// return an arbitrary environment variable. Only secrets that are safe to ship
// to a browser (public API tokens) may be listed here. Anything server-side
// (service role key, payment provider secrets) must stay out of this list and
// be used from inside an Edge Function instead.
const PUBLIC_SECRET_ALLOWLIST = new Set([
  'MAPBOX_PUBLIC_TOKEN',
])

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const { name } = await req.json()

    if (!name || typeof name !== 'string') {
      return json({ error: 'Secret name is required' }, 400)
    }

    if (!PUBLIC_SECRET_ALLOWLIST.has(name)) {
      // Same response as "not found": do not let callers probe which
      // environment variables exist on the server.
      console.warn(`Rejected non-allowlisted secret request: ${name}`)
      return json({ error: 'Secret not found' }, 404)
    }

    const value = Deno.env.get(name)

    if (!value) {
      console.error(`Allowlisted secret not configured: ${name}`)
      return json({ error: 'Secret not found' }, 404)
    }

    return json({ value })
  } catch (error) {
    console.error('Error in get-secret function:', error)
    return json({ error: 'Internal server error' }, 500)
  }
})
