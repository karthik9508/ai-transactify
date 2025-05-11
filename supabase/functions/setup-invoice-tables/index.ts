
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Execute the functions we created in the migration
    const { error: counterError } = await supabase.rpc('create_invoice_counter');
    if (counterError) {
      throw new Error(`Error creating invoice counter table: ${counterError.message}`);
    }
    
    const { error: invoicesError } = await supabase.rpc('create_invoices_table');
    if (invoicesError) {
      throw new Error(`Error creating invoices table: ${invoicesError.message}`);
    }
    
    return new Response(
      JSON.stringify({ message: "Invoice tables setup successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in setup-invoice-tables function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
