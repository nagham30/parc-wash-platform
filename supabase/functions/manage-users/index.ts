import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Content-Type": "application/json" };
const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return respond({ error: "Unauthorized" }, 401);
    const authClient = createClient(url, anonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) return respond({ error: "Unauthorized" }, 401);
    const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data: callerRole, error: roleError } = await admin.from("user_roles").select("role").eq("user_id", user.id).single();
    if (roleError || callerRole?.role !== "manager") return respond({ error: "Only managers may manage users" }, 403);
    const body = await req.json();
    if (body.operation === "invite") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const name = String(body.name ?? "").trim();
      const role = String(body.role ?? "employee");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name || name.length > 150 || !["manager", "assistant_manager", "employee"].includes(role)) return respond({ error: "Invalid user data" }, 400);
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: name } });
      if (error || !data.user) return respond({ error: error?.message ?? "Invitation failed" }, 400);
      const { error: insertError } = await admin.from("user_roles").upsert({ user_id: data.user.id, role });
      if (insertError) return respond({ error: "Invitation created, but role assignment failed: " + insertError.message }, 500);
      await admin.from("audit_logs").insert({ user_id: user.id, action: "invite_user", entity_type: "user", entity_id: data.user.id, details: { role } });
      return respond({ success: true });
    }
    if (body.operation === "set_role" || body.operation === "set_disabled") {
      const target = String(body.user_id ?? "");
      if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(target)) return respond({ error: "Invalid user id" }, 400);
      if (target === user.id) return respond({ error: "You cannot change your own account here" }, 400);
      const { data: targetData, error: targetError } = await admin.auth.admin.getUserById(target);
      if (targetError || !targetData.user) return respond({ error: "User not found" }, 404);
      if (body.operation === "set_role") {
        const role = String(body.role ?? "");
        if (!["manager", "assistant_manager", "employee"].includes(role)) return respond({ error: "Invalid role" }, 400);
        const { error } = await admin.from("user_roles").upsert({ user_id: target, role });
        if (error) return respond({ error: error.message }, 500);
        await admin.from("audit_logs").insert({ user_id: user.id, action: "set_role", entity_type: "user", entity_id: target, details: { role } });
      } else {
        if (typeof body.disabled !== "boolean") return respond({ error: "Invalid status" }, 400);
        const { error } = await admin.auth.admin.updateUserById(target, { ban_duration: body.disabled ? "876000h" : "none" });
        if (error) return respond({ error: error.message }, 500);
        await admin.from("audit_logs").insert({ user_id: user.id, action: "set_disabled", entity_type: "user", entity_id: target, details: { disabled: body.disabled } });
      }
      return respond({ success: true });
    }
    return respond({ error: "Unknown operation" }, 400);
  } catch (error) { return respond({ error: error instanceof Error ? error.message : "Internal error" }, 500); }
});
