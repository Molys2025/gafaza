
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const paymentId = url.pathname.split('/').pop()

    if (!paymentId) {
      throw new Error('Payment ID is required')
    }

    // Flouci API configuration
    const FLOUCI_APP_TOKEN = Deno.env.get('FLOUCI_APP_TOKEN')
    const FLOUCI_APP_SECRET = Deno.env.get('FLOUCI_APP_SECRET')
    const FLOUCI_BASE_URL = 'https://developers.flouci.com/api'

    if (!FLOUCI_APP_TOKEN || !FLOUCI_APP_SECRET) {
      throw new Error('Flouci credentials not configured')
    }

    // Check payment status with Flouci
    const response = await fetch(`${FLOUCI_BASE_URL}/verify_payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_token: FLOUCI_APP_TOKEN,
        app_secret: FLOUCI_APP_SECRET,
        payment_id: paymentId
      })
    })

    const flouciResponse = await response.json()

    // Update payment status in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let status = 'pending'
    if (flouciResponse.success) {
      if (flouciResponse.result.status === 'SUCCESS') {
        status = 'completed'
      } else if (flouciResponse.result.status === 'FAILED') {
        status = 'failed'
      }

      await supabase
        .from('payments')
        .update({ 
          status: status,
          flouci_verification: flouciResponse.result,
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', paymentId)
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: flouciResponse.success ? flouciResponse.result.status : 'FAILED',
        payment_id: paymentId,
        details: flouciResponse.result
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Payment status check error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
