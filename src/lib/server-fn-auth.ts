import { supabase } from "@/integrations/supabase/client";

/**
 * Wraps a server function call so the current Supabase access token is
 * forwarded as a Bearer Authorization header. Required for any server
 * function protected by `requireSupabaseAuth`.
 */
export async function callWithAuth<TInput, TOutput>(
  fn: (args: { data?: TInput; headers?: Record<string, string> }) => Promise<TOutput>,
  data?: TInput,
): Promise<TOutput> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) {
    throw new Error("You are not signed in. Please sign in again.");
  }
  const args: { data?: TInput; headers: Record<string, string> } = {
    headers: { Authorization: `Bearer ${token}` },
  };
  if (data !== undefined) args.data = data;
  return fn(args);
}
