-- 1. Add 'author' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'author';
