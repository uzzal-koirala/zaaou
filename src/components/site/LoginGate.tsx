import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Loader2, ShieldQuestion, AlertTriangle, Lock } from "lucide-react";
import { toast } from "sonner";
import { getLoginGateChallenge, verifyLoginGate } from "@/server/login-gate.functions";

type Audience = "admin" | "author";
type Question = { id: string; question: string };

export function LoginGate({
  audience,
  title = "Quick security check",
  subtitle = "Answer to continue to sign in.",
  children,
}: {
  audience: Audience;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [passed, setPassed] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);
  const [retryAt, setRetryAt] = useState<string | null>(null);

  async function fetchChallenge() {
    setLoading(true);
    try {
      const res = await getLoginGateChallenge({ data: { audience } });
      if (res.passed) {
        setPassed(true);
      } else if (res.locked) {
        setLocked(true);
        setRetryAt(res.retryAt ?? null);
      } else {
        setQuestions(res.questions);
        setAnswers({});
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load security check");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audience]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (questions.length === 0) {
      // Nothing to verify — re-fetch to either pass or surface lockout
      await fetchChallenge();
      return;
    }
    if (questions.some((q) => !answers[q.id]?.length)) {
      toast.error("Please answer all questions");
      return;
    }
    setSubmitting(true);
    try {
      const res = await verifyLoginGate({
        data: {
          audience,
          answers: questions.map((q) => ({ id: q.id, answer: answers[q.id] })),
        },
      });
      if (res.success) {
        toast.success("Verified");
        setPassed(true);
      } else if (res.locked) {
        setLocked(true);
        setRetryAt(res.retryAt ?? null);
        toast.error("Too many wrong attempts. Try again later.");
      } else {
        toast.error("Incorrect answer. Please try again.");
        setAnswers({});
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (passed) {
    return <>{children}</>;
  }

  if (locked) {
    const retryDate = retryAt ? new Date(retryAt) : null;
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-destructive/5 via-background to-background px-5 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card shadow-glow p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-destructive/10 text-destructive grid place-items-center">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-foreground">Too many attempts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For your security, the gate is locked. Please try again
            {retryDate ? ` after ${retryDate.toLocaleTimeString()}` : " later"}.
          </p>
          <button
            onClick={fetchChallenge}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            Check again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-primary/5 via-background to-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card shadow-glow p-7 sm:p-9">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <ShieldQuestion className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {questions.map((q, i) => (
              <div key={q.id}>
                <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                  {questions.length > 1 ? `Question ${i + 1}` : "Question"}
                </label>
                <p className="mb-2 text-sm text-foreground">{q.question}</p>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  autoFocus={i === 0}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Your answer"
                  className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  maxLength={200}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-shadow disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & continue"}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 text-[11px] text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <p>Answers are case-sensitive. After 5 wrong attempts the gate is locked for 15 minutes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
