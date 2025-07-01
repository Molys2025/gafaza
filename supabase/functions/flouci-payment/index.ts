
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FlouciPaymentRequest {
  amount: number; // in millimes
  phoneNumber: string;
  description: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, phoneNumber, description }: FlouciPaymentRequest = await req.json()

    // Flouci API configuration
    const FLOUCI_APP_TOKEN = Deno.env.get('FLOUCI_APP_TOKEN')
    const FLOUCI_APP_SECRET = Deno.env.get('FLOUCI_APP_SECRET')
    const FLOUCI_BASE_URL = 'https://developers.flouci.com/api'

    if (!FLOUCI_APP_TOKEN || !FLOUCI_APP_SECRET) {
      throw new Error('Flouci credentials not configured')
    }

    // Generate payment request
    const paymentData = {
      app_token: FLOUCI_APP_TOKEN,
      app_secret: FLOUCI_APP_SECRET,
      amount: amount,
      accept_card: "true",
      session_timeout_secs: 1200,
      success_link: `${req.headers.get('origin')}/payment/success`,
      fail_link: `${req.headers.get('origin')}/payment/error`,
      developer_tracking_id: `zeytna_${Date.now()}`
    }

    // Make request to Flouci API
    const response = await fetch(`${FLOUCI_BASE_URL}/generate_payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const flouciResponse = await response.json()

    if (flouciResponse.success) {
      // Store payment info in Supabase for tracking
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabase
        .from('payments')
        .insert({
          payment_id: flouciResponse.result.payment_id,
          amount: amount / 1000, // Convert back to TND
          currency: 'TND',
          method: 'flouci',
          status: 'pending',
          phone_number: phoneNumber,
          description: description,
          flouci_data: flouciResponse.result
        })

      return new Response(
        JSON.stringify({
          success: true,
          payment_id: flouciResponse.result.payment_id,
          payment_url: flouciResponse.result.link
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } else {
      throw new Error(flouciResponse.error || 'Flouci payment generation failed')
    }

  } catch (error) {
    console.error('Flouci payment error:', error)
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
