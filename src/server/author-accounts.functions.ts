import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function getAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const createSchema = z.object({
  authorId: z.string().uuid(),
  email: z.string().email().max(254),
  password: z.string().min(8).max(72),
});

export const createAuthorAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    // Verify caller is admin
    const { data: roleRow, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr || !roleRow) {
      throw new Error("Forbidden: admin only");
    }

    const admin = getAdmin();

    // Verify the author exists and isn't already linked
    const { data: existingAuthor, error: authorErr } = await admin
      .from("authors")
      .select("id, user_id, name")
      .eq("id", data.authorId)
      .maybeSingle();
    if (authorErr) throw new Error(authorErr.message);
    if (!existingAuthor) throw new Error("Author not found");
    if (existingAuthor.user_id) throw new Error("This author already has a login account");

    // Create the auth user (auto-confirm so they can log in immediately)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { name: existingAuthor.name, role: "author" },
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message ?? "Failed to create user");
    }
    const newUserId = created.user.id;

    // Link author -> user
    const { error: linkErr } = await admin
      .from("authors")
      .update({ user_id: newUserId })
      .eq("id", data.authorId);
    if (linkErr) {
      // Rollback the auth user
      await admin.auth.admin.deleteUser(newUserId).catch(() => {});
      throw new Error(linkErr.message);
    }

    // Grant the 'author' role
    const { error: roleInsertErr } = await admin
      .from("user_roles")
      .insert({ user_id: newUserId, role: "author" });
    if (roleInsertErr) {
      await admin.auth.admin.deleteUser(newUserId).catch(() => {});
      throw new Error(roleInsertErr.message);
    }

    return { ok: true, userId: newUserId };
  });

const resetSchema = z.object({
  authorId: z.string().uuid(),
  email: z.string().email().max(254).optional(),
  password: z.string().min(8).max(72).optional(),
});

export const updateAuthorAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => resetSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin only");

    if (!data.email && !data.password) {
      throw new Error("Provide a new email or password");
    }

    const admin = getAdmin();
    const { data: a } = await admin
      .from("authors")
      .select("user_id")
      .eq("id", data.authorId)
      .maybeSingle();
    if (!a?.user_id) throw new Error("Author has no login account");

    const updates: { email?: string; password?: string; email_confirm?: boolean } = {};
    if (data.email) {
      updates.email = data.email;
      updates.email_confirm = true;
    }
    if (data.password) updates.password = data.password;

    const { error } = await admin.auth.admin.updateUserById(a.user_id, updates);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Backwards-compatible alias
export const resetAuthorPassword = updateAuthorAccount;

const removeSchema = z.object({ authorId: z.string().uuid() });

export const removeAuthorAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => removeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin only");

    const admin = getAdmin();
    const { data: a } = await admin
      .from("authors")
      .select("user_id")
      .eq("id", data.authorId)
      .maybeSingle();
    if (!a?.user_id) return { ok: true };

    const userId = a.user_id;
    await admin.from("authors").update({ user_id: null }).eq("id", data.authorId);
    await admin.from("user_roles").delete().eq("user_id", userId).eq("role", "author");
    await admin.auth.admin.deleteUser(userId).catch(() => {});
    return { ok: true };
  });
