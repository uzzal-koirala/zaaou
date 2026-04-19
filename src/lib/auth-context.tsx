import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthorLite = {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isAuthor: boolean;
  author: AuthorLite | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuthor: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [author, setAuthor] = useState<AuthorLite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setTimeout(() => {
          loadRolesAndAuthor(newSession.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setIsAuthor(false);
        setAuthor(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadRolesAndAuthor(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function loadRolesAndAuthor(userId: string) {
    const [rolesRes, authorRes] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase
        .from("authors")
        .select("id, name, slug, avatar_url")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);
    const roles = (rolesRes.data ?? []).map((r) => r.role);
    setIsAdmin(roles.includes("admin"));
    setIsAuthor(roles.includes("author"));
    setAuthor(authorRes.data ?? null);
  }

  async function refreshAuthor() {
    if (!session?.user) return;
    await loadRolesAndAuthor(session.user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin,
        isAuthor,
        author,
        loading,
        signOut,
        refreshAuthor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
