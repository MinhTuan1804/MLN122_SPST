// resolve_turn/index.ts
// Supabase Edge Function to resolve game turns securely on server-side

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { session_id, turn_number } = await req.json();

    if (!session_id || turn_number === undefined) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize Supabase Client with Service Role Key to bypass RLS and perform server-side calculations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? "",
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ""
    );

    // 1. Fetch previous turn state from game_turns
    const { data: prevTurns, error: turnErr } = await supabase
      .from('game_turns')
      .select('*')
      .eq('session_id', session_id)
      .eq('turn_number', turn_number - 1)
      .maybeSingle();

    if (turnErr) throw turnErr;
    if (!prevTurns) {
      return new Response(JSON.stringify({ error: "Previous turn state not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Fetch the card choices submitted by both players this turn
    const { data: builds, error: buildErr } = await supabase
      .from('player_build')
      .select('*, card_pool(*)')
      .eq('session_id', session_id)
      .eq('turn_picked', turn_number);

    if (buildErr) throw buildErr;

    // Filter choices for Capitalist and Worker
    const capCard = builds.find(b => b.card_pool.faction === 'capitalist')?.card_pool;
    const wrkCard = builds.find(b => b.card_pool.faction === 'worker')?.card_pool;

    const capEffects = capCard?.effects_json || {};
    const wrkEffects = wrkCard?.effects_json || {};

    // 3. Apply economic formula (Ported server-side Deno equivalent)
    const nextC = Math.max(50, Number(prevTurns.constant_capital) + (capEffects.constantCapital || 0) + (wrkEffects.constantCapital || 0));
    const nextV = Math.max(50, Number(prevTurns.variable_capital) + (capEffects.variableCapital || 0) + (wrkEffects.variableCapital || 0));
    
    const organicComposition = nextC / nextV;
    const nextWorkerHealth = Math.min(100, Math.max(0, prevTurns.worker_health + (capEffects.workerHealth || 0) + (wrkEffects.workerHealth || 0)));
    const nextConflictRate = Math.min(100, Math.max(0, prevTurns.conflict_rate + (capEffects.conflictRate || 0) + (wrkEffects.conflictRate || 0)));
    const nextClassConsciousness = Math.min(100, Math.max(0, prevTurns.class_consciousness + (capEffects.classConsciousness || 0) + (wrkEffects.classConsciousness || 0)));
    const nextSolidarityNetwork = Math.min(100, Math.max(0, prevTurns.solidarity_network + (capEffects.solidarityNetwork || 0) + (wrkEffects.solidarityNetwork || 0)));
    const nextMarketShare = Math.min(100, Math.max(0, prevTurns.market_share + (capEffects.marketShare || 0) + (wrkEffects.marketShare || 0)));
    const nextReputation = Math.min(100, Math.max(0, prevTurns.reputation + (capEffects.reputation || 0) + (wrkEffects.reputation || 0)));

    // Marxist surplus calculations
    const baseSurplusRate = 1.20;
    const healthModifier = nextWorkerHealth / 100;
    const machineryModifier = 1 + Math.log(1 + organicComposition) * 0.3;
    const resistanceModifier = 1 - (nextClassConsciousness * nextConflictRate) / 25000;

    const actualSurplusRate = Math.max(0.1, baseSurplusRate * healthModifier * machineryModifier * resistanceModifier);
    const surplusValue = nextV * actualSurplusRate;
    const socialValue = nextC + nextV + surplusValue;

    // Capitalist wealth accumulator
    const marketModifier = nextMarketShare / 50;
    const capitalistProfit = surplusValue * marketModifier;
    let nextCapital = Number(prevTurns.capital) + capitalistProfit + (capEffects.capital || 0) + (wrkEffects.capital || 0) - nextC / 5;
    nextCapital = Math.max(0, nextCapital);

    // Worker union fund accumulator
    const workerContribution = nextV * (nextClassConsciousness / 100) * (nextSolidarityNetwork / 100) * 0.15;
    const conflictDrain = nextConflictRate * 1.5;
    let nextUnionFund = Number(prevTurns.union_fund) + workerContribution - conflictDrain + (capEffects.unionFund || 0) + (wrkEffects.unionFund || 0);
    nextUnionFund = Math.max(0, nextUnionFund);

    const aggregateDemand = nextV * 1.5 + nextC * 0.2 + (capEffects.aggregateDemand || 0) + (wrkEffects.aggregateDemand || 0);

    const resultState = {
      capital: Math.round(nextCapital),
      constant_capital: Math.round(nextC),
      variable_capital: Math.round(nextV),
      organic_composition: parseFloat(organicComposition.toFixed(4)),
      surplus_value: Math.round(surplusValue),
      worker_health: Math.round(nextWorkerHealth),
      conflict_rate: Math.round(nextConflictRate),
      union_fund: Math.round(nextUnionFund),
      class_consciousness: Math.round(nextClassConsciousness),
      market_share: Math.round(nextMarketShare),
      reputation: Math.round(nextReputation),
      aggregate_demand: Math.round(aggregateDemand),
      social_value: Math.round(socialValue)
    };

    // 4. Save new turn in the database
    const { data: newTurn, error: saveErr } = await supabase
      .from('game_turns')
      .insert([{
        session_id: session_id,
        turn_number: turn_number,
        ...resultState
      }])
      .select()
      .single();

    if (saveErr) throw saveErr;

    // Return next state to client
    return new Response(JSON.stringify(newTurn), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
