
-- Add comprehensive profile fields for employer-student matching
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS career_interests text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS industry_preferences text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS availability text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS salary_expectations text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS portfolio_url text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS linkedin_url text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS github_url text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS phone_number text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS work_experience jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS soft_skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS graduation_year integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS location_preference text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS about_me text DEFAULT NULL;

-- Create index on skills for search
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_industry_preferences ON public.profiles USING GIN(industry_preferences);
CREATE INDEX IF NOT EXISTS idx_profiles_languages ON public.profiles USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_profiles_soft_skills ON public.profiles USING GIN(soft_skills);

-- Create employer_ads table for paid advertisements
CREATE TABLE IF NOT EXISTS public.employer_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_name text NOT NULL,
  employer_email text NOT NULL,
  company_name text NOT NULL,
  company_logo_url text,
  ad_title text NOT NULL,
  ad_description text NOT NULL,
  ad_type text NOT NULL DEFAULT 'job', -- job, event, general
  target_skills text[] DEFAULT '{}',
  target_universities uuid[] DEFAULT '{}',
  target_countries uuid[] DEFAULT '{}',
  location text,
  salary_range text,
  application_url text,
  contact_email text,
  is_paid boolean DEFAULT false,
  payment_id text,
  payment_amount numeric DEFAULT 0,
  status text DEFAULT 'pending', -- pending, active, expired, rejected
  starts_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '30 days'),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.employer_ads ENABLE ROW LEVEL SECURITY;

-- Anyone can view active ads
CREATE POLICY "Anyone can view active ads"
  ON public.employer_ads FOR SELECT
  USING (status = 'active' AND expires_at > now());

-- Authenticated users can create ads
CREATE POLICY "Authenticated users can create ads"
  ON public.employer_ads FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can manage all ads
CREATE POLICY "Admins can manage all ads"
  ON public.employer_ads FOR ALL
  USING (is_admin());
