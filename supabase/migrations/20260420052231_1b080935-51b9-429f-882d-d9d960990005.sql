-- Login gate questions (admin-managed for both audiences)
CREATE TABLE public.login_gate_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audience TEXT NOT NULL CHECK (audience IN ('admin', 'author')),
  question TEXT NOT NULL CHECK (char_length(question) BETWEEN 1 AND 300),
  answer TEXT NOT NULL CHECK (char_length(answer) BETWEEN 1 AND 200),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_login_gate_questions_audience ON public.login_gate_questions(audience, is_active);

ALTER TABLE public.login_gate_questions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage. Answers are NEVER exposed to clients (no public SELECT).
CREATE POLICY "Admins can view login gate questions"
  ON public.login_gate_questions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert login gate questions"
  ON public.login_gate_questions FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update login gate questions"
  ON public.login_gate_questions FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete login gate questions"
  ON public.login_gate_questions FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_login_gate_questions_updated_at
  BEFORE UPDATE ON public.login_gate_questions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Track failed attempts for lockout (5 wrong / 15 min) per IP+audience
CREATE TABLE public.login_gate_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  audience TEXT NOT NULL CHECK (audience IN ('admin', 'author')),
  succeeded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_login_gate_attempts_lookup
  ON public.login_gate_attempts(ip_hash, audience, created_at DESC);

ALTER TABLE public.login_gate_attempts ENABLE ROW LEVEL SECURITY;

-- No client access at all — only the service role (server functions) can read/write.
CREATE POLICY "Admins can view attempts"
  ON public.login_gate_attempts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add configurable question count to blog_settings
ALTER TABLE public.blog_settings
  ADD COLUMN IF NOT EXISTS login_gate_question_count SMALLINT NOT NULL DEFAULT 1
    CHECK (login_gate_question_count IN (1, 2)),
  ADD COLUMN IF NOT EXISTS login_gate_enabled BOOLEAN NOT NULL DEFAULT true;