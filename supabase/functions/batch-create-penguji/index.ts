import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerId = claimsData.claims.sub;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Only admins can create users" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { users } = await req.json();
    if (!Array.isArray(users)) throw new Error("users must be an array");

    const results: any[] = [];

    for (const u of users) {
      try {
        // Create auth user
        const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
          email: u.email.trim(),
          password: u.password,
          email_confirm: true,
          user_metadata: { full_name: u.full_name.trim() },
        });
        if (createErr) throw createErr;

        // Add penguji role
        await adminClient.from("user_roles").insert({ user_id: newUser.user.id, role: "penguji" });

        // Check if penguji record exists by name, link user_id
        const { data: existingPenguji } = await adminClient
          .from("penguji")
          .select("id")
          .eq("name", u.full_name.trim())
          .maybeSingle();

        if (existingPenguji) {
          await adminClient
            .from("penguji")
            .update({ user_id: newUser.user.id })
            .eq("id", existingPenguji.id);
        } else {
          await adminClient
            .from("penguji")
            .insert({ name: u.full_name.trim(), user_id: newUser.user.id });
        }

        results.push({ email: u.email, success: true, user_id: newUser.user.id });
      } catch (err: any) {
        results.push({ email: u.email, success: false, error: err.message });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
