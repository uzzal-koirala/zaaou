import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { Loader2, Eye, EyeOff, Lock, Mail, PenSquare, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { LoginGate } from "@/components/site/LoginGate";

export const Route = createFileRoute("/author/login")({
  head: () => ({
    meta: [
      { title: "Author sign in - Zaaou Food" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthorLoginWrapper,
});

function AuthorLoginWrapper() {
  return (
    <LoginGate
      audience="author"
      title="Author security check"
      subtitle="Answer to continue to the author sign-in."
    >
      <AuthorLoginPage />
    </LoginGate>
  );
}

function AuthorLoginPage() {
  const { user, isAuthor, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAuthor) {
      navigate({ to: "/author" });
    }
  }, [loading, user, isAuthor, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      const msg = error.message.toLowerCase().includes("invalid")
        ? "Invalid email or password"
        : error.message;
      return toast.error(msg);
    }
    toast.success("Welcome back!");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-primary/5 via-background to-background px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-display font-extrabold text-2xl mb-8">
          Zaaou Food
        </Link>

        <div className="rounded-3xl border border-border bg-card shadow-glow p-7 sm:p-9">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <PenSquare className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Author sign in
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Manage your posts and comments.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-background pl-10 pr-11 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-shadow disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
            New author accounts are created by an admin. Contact your editor if you need access.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">← Back to Zaaou Food</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground/80 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
