import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getRequest } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";

const schema = z.object({ postId: z.string().uuid() });

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const recordPostView = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env.PROJECT_URL ?? process.env.SUPABASE_URL;
    const key = process.env.SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return { ok: false };

    const req = getRequest();
    const ip =
      req?.headers.get("cf-connecting-ip") ??
      req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const ua = req?.headers.get("user-agent") ?? "unknown";
    const visitor = await sha256Hex(`${ip}|${ua}|${data.postId}`);

    const admin = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Insert; ignore unique violation (already viewed today)
    const { error } = await admin
      .from("post_views")
      .insert({ post_id: data.postId, visitor_hash: visitor });

    if (error && !error.message.toLowerCase().includes("duplicate")) {
      // swallow non-critical errors; views are best-effort
      return { ok: false };
    }
    return { ok: true };
  });
