import { type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function RoleGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-sm text-center">
          <ShieldAlert className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-display font-bold">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to sign in to access the admin area.
          </p>
          <button
            onClick={() => navigate({ to: "/auth", search: { redirect: "/admin" } })}
            className="mt-5 inline-flex rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-md text-center">
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-3" />
          <h1 className="text-xl font-display font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) doesn't have admin permissions. Ask an administrator to grant you the admin role.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
