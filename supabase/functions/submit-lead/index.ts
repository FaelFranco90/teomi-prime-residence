import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Received lead submission:', JSON.stringify(body));

    // Forward to n8n webhook (seu webhook está registrado para GET)
    const url = new URL('https://n8n.teomiimoveis.com.br/webhook/lead-prime');

    if (body && typeof body === 'object') {
      for (const [key, value] of Object.entries(body)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    }

    const response = await fetch(url.toString(), { method: 'GET' });
    const responseText = await response.text();

    if (!response.ok) {
      console.error('n8n webhook error:', responseText);
      throw new Error(`Webhook returned ${response.status}: ${responseText}`);
    }

    console.log('Lead submitted successfully to n8n');

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in submit-lead function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
