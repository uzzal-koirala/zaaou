import { createServerFn } from "@tanstack/react-start";
import { getRequest, getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import crypto from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Returns true if the server has the secrets needed for the admin client.
 * If false, the login gate fails open so admin sign-in stays reachable —
 * the real security layer is the password authentication on /auth.
 */
function hasAdminEnv(): boolean {
  const url = process.env.SUPABASE_URL ?? process.env.PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY;
  return Boolean(url && key);
}

const AudienceSchema = z.enum(["admin", "author"]);
type Audience = z.infer<typeof AudienceSchema>;

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const PASS_COOKIE_MAX_AGE = 10 * 60; // 10 min

function getClientIpHash(): string {
  const req = getRequest();
  const fwd = req?.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || req?.headers.get("x-real-ip") || "unknown";
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function passCookieName(audience: Audience) {
  return `lg_pass_${audience}`;
}

function signPassToken(audience: Audience, expiresAt: number): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "fallback-secret";
  const payload = `${audience}.${expiresAt}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${expiresAt}.${sig}`;
}

function verifyPassToken(audience: Audience, token: string | undefined): boolean {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = signPassToken(audience, exp).split(".")[1];
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

async function isLockedOut(audience: Audience, ipHash: string): Promise<{ locked: boolean; retryAt?: Date }> {
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("login_gate_attempts")
    .select("created_at, succeeded")
    .eq("audience", audience)
    .eq("ip_hash", ipHash)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error || !data) return { locked: false };
  // Reset window after a successful attempt within the window
  const failures: typeof data = [];
  for (const row of data) {
    if (row.succeeded) break;
    failures.push(row);
  }
  if (failures.length >= MAX_ATTEMPTS) {
    const oldest = failures[failures.length - 1];
    const retryAt = new Date(new Date(oldest.created_at).getTime() + LOCKOUT_MINUTES * 60 * 1000);
    return { locked: true, retryAt };
  }
  return { locked: false };
}

/** Pick N random active questions for the audience (text only). */
export const getLoginGateChallenge = createServerFn({ method: "POST" })
  .inputValidator((input: { audience: Audience }) => ({
    audience: AudienceSchema.parse(input.audience),
  }))
  .handler(async ({ data }) => {
    // Already passed?
    const cookie = getCookie(passCookieName(data.audience));
    if (verifyPassToken(data.audience, cookie)) {
      return { passed: true as const, questions: [] as { id: string; question: string }[], count: 0, locked: false as const };
    }

    // Fail-open if admin secrets are unavailable — gate is a soft layer.
    if (!hasAdminEnv()) {
      const exp = Date.now() + PASS_COOKIE_MAX_AGE * 1000;
      setCookie(passCookieName(data.audience), signPassToken(data.audience, exp), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: PASS_COOKIE_MAX_AGE,
      });
      return { passed: true as const, questions: [], count: 0, locked: false as const };
    }

    const ipHash = getClientIpHash();
    const lockout = await isLockedOut(data.audience, ipHash);
    if (lockout.locked) {
      return {
        passed: false as const,
        questions: [],
        count: 0,
        locked: true as const,
        retryAt: lockout.retryAt?.toISOString() ?? null,
      };
    }

    const { data: settings } = await supabaseAdmin
      .from("blog_settings")
      .select("login_gate_question_count, login_gate_enabled")
      .eq("singleton", true)
      .maybeSingle();

    // Gate disabled => bypass entirely (issue pass cookie)
    if (settings && settings.login_gate_enabled === false) {
      const exp = Date.now() + PASS_COOKIE_MAX_AGE * 1000;
      setCookie(passCookieName(data.audience), signPassToken(data.audience, exp), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: PASS_COOKIE_MAX_AGE,
      });
      return { passed: true as const, questions: [], count: 0, locked: false as const };
    }

    const count = Math.min(2, Math.max(1, settings?.login_gate_question_count ?? 1));

    const { data: pool } = await supabaseAdmin
      .from("login_gate_questions")
      .select("id, question")
      .eq("audience", data.audience)
      .eq("is_active", true);

    if (!pool || pool.length === 0) {
      // No questions configured => bypass with cookie
      const exp = Date.now() + PASS_COOKIE_MAX_AGE * 1000;
      setCookie(passCookieName(data.audience), signPassToken(data.audience, exp), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: PASS_COOKIE_MAX_AGE,
      });
      return { passed: true as const, questions: [], count: 0, locked: false as const };
    }

    // Random sample without replacement
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(count, pool.length));
    return {
      passed: false as const,
      questions: picked,
      count: picked.length,
      locked: false as const,
    };
  });

/** Verify answers; on success set short-lived cookie. */
export const verifyLoginGate = createServerFn({ method: "POST" })
  .inputValidator((input: { audience: Audience; answers: { id: string; answer: string }[] }) => ({
    audience: AudienceSchema.parse(input.audience),
    answers: z
      .array(
        z.object({
          id: z.string().uuid(),
          answer: z.string().min(1).max(200),
        }),
      )
      .min(1)
      .max(2)
      .parse(input.answers),
  }))
  .handler(async ({ data }) => {
    const ipHash = getClientIpHash();
    const lockout = await isLockedOut(data.audience, ipHash);
    if (lockout.locked) {
      return {
        success: false as const,
        locked: true as const,
        retryAt: lockout.retryAt?.toISOString() ?? null,
      };
    }

    const ids = data.answers.map((a) => a.id);
    const { data: rows, error } = await supabaseAdmin
      .from("login_gate_questions")
      .select("id, answer_hash, audience, is_active")
      .in("id", ids);

    if (error || !rows || rows.length !== ids.length) {
      await supabaseAdmin.from("login_gate_attempts").insert({
        ip_hash: ipHash,
        audience: data.audience,
        succeeded: false,
      });
      return { success: false as const, locked: false as const };
    }

    function hashAnswer(raw: string): string {
      return crypto.createHash("sha256").update(raw.trim().toLowerCase()).digest("hex");
    }

    const allMatch = data.answers.every((submitted) => {
      const row = rows.find((r) => r.id === submitted.id) as
        | { id: string; answer_hash: string | null; audience: string; is_active: boolean }
        | undefined;
      if (!row || !row.is_active || row.audience !== data.audience) return false;
      if (!row.answer_hash) return false;
      const submittedHash = hashAnswer(submitted.answer);
      try {
        return crypto.timingSafeEqual(
          Buffer.from(row.answer_hash, "hex"),
          Buffer.from(submittedHash, "hex"),
        );
      } catch {
        return false;
      }
    });

    await supabaseAdmin.from("login_gate_attempts").insert({
      ip_hash: ipHash,
      audience: data.audience,
      succeeded: allMatch,
    });

    if (!allMatch) {
      // Re-check lockout AFTER insert so the response reflects current state
      const afterLock = await isLockedOut(data.audience, ipHash);
      return {
        success: false as const,
        locked: afterLock.locked,
        retryAt: afterLock.retryAt?.toISOString() ?? null,
      };
    }

    const exp = Date.now() + PASS_COOKIE_MAX_AGE * 1000;
    setCookie(passCookieName(data.audience), signPassToken(data.audience, exp), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: PASS_COOKIE_MAX_AGE,
    });

    return { success: true as const, locked: false as const };
  });
