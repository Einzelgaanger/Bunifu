
-- Add 'employer' to user_role enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'employer';

-- Add employer and CV fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cv_url text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS cv_file_path text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_name text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_role text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS company_website text DEFAULT NULL;

-- Create AI matches table
CREATE TABLE IF NOT EXISTS public.ai_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  matched_user_id uuid NOT NULL,
  match_type text NOT NULL DEFAULT 'collaboration',
  match_score numeric DEFAULT 0,
  match_reason text,
  context_data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.ai_matches ENABLE ROW LEVEL SECURITY;

-- Users can see matches involving them
CREATE POLICY "Users can view own matches" ON public.ai_matches
FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = matched_user_id);

-- Authenticated users can create matches (via edge function)
CREATE POLICY "Authenticated can create matches" ON public.ai_matches
FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id);

-- Users can update status of their matches
CREATE POLICY "Users can update own matches" ON public.ai_matches
FOR UPDATE USING (auth.uid() = requester_id);

-- Create CV storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-cvs', 'student-cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Users can upload their own CV
CREATE POLICY "Users upload own CV" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'student-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own CV
CREATE POLICY "Users view own CV" ON storage.objects
FOR SELECT USING (bucket_id = 'student-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own CV
CREATE POLICY "Users update own CV" ON storage.objects
FOR UPDATE USING (bucket_id = 'student-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own CV
CREATE POLICY "Users delete own CV" ON storage.objects
FOR DELETE USING (bucket_id = 'student-cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Authenticated users can view CVs (for employer search results)
CREATE POLICY "Authenticated view CVs" ON storage.objects
FOR SELECT USING (bucket_id = 'student-cvs' AND auth.role() = 'authenticated');
