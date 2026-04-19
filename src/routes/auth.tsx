import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { z } from "zod";
import { Loader2, Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import authBg from "@/assets/admin-auth-bg.jpg";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Admin sign in - Zaaou Food" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: redirect ?? "/admin" });
    }
  }, [loading, user, redirect, navigate]);

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
      // Friendlier error messaging
      const msg = error.message.toLowerCase().includes("invalid")
        ? "Invalid email or password"
        : error.message;
      return toast.error(msg);
    }
    toast.success("Welcome back!");
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left visual panel */}
      <div className="hidden lg:flex relative w-[45%] xl:w-[50%] overflow-hidden">
        <img
          src={authBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/65 to-primary/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 text-primary-foreground w-full">
          <Link to="/" className="font-display font-extrabold text-2xl tracking-tight">
            Zaaou Food
          </Link>
          <div className="space-y-6 max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]">
              <ShieldCheck className="h-3 w-3" /> Admin console
            </span>
            <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-[1.05] tracking-tight">
              Run the kitchen behind Itahari's favourite food app.
            </h1>
            <p className="text-base text-white/85 leading-relaxed">
              Manage restaurants, riders, blog posts, and customer comments — all from one place.
            </p>
            <div className="flex items-center gap-6 pt-4 text-sm text-white/80">
              <Stat label="Restaurants" value="20+" />
              <div className="h-8 w-px bg-white/30" />
              <Stat label="Riders" value="50+" />
              <div className="h-8 w-px bg-white/30" />
              <Stat label="Orders / day" value="500+" />
            </div>
          </div>
          <p className="text-xs text-white/70">© {new Date().getFullYear()} Zaaou Food · All rights reserved</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden block text-center font-display font-extrabold text-2xl mb-6">
            Zaaou Food
          </Link>

          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] mb-4">
              <Lock className="h-3 w-3" /> Restricted area
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage Zaaou Food.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
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
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-1">Admin only</p>
            New admin accounts must be created by an existing admin. If you need access, please contact your system administrator.
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">← Back to Zaaou Food</Link>
          </p>
        </div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-extrabold leading-none">{value}</p>
      <p className="text-[11px] uppercase tracking-wider mt-1 text-white/70">{label}</p>
    </div>
  );
}
