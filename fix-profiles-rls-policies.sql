-- Fix RLS Policies for Profiles Table
-- Run this in your Supabase SQL Editor

-- First, drop any existing policies that might conflict
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can SELECT (read) their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Users can INSERT their own profile
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can UPDATE their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Check if your user profile exists (replace with your actual user ID)
-- SELECT * FROM profiles WHERE user_id = '0da6d503-70b3-4b92-b28c-c90879fadfba';

-- If profile doesn't exist, create it manually (run this separately after policies are set):
-- INSERT INTO profiles (user_id, full_name, email, role, points, rank)
-- VALUES (
--   '0da6d503-70b3-4b92-b28c-c90879fadfba',
--   'User',
--   (SELECT email FROM auth.users WHERE id = '0da6d503-70b3-4b92-b28c-c90879fadfba'),
--   'student',
--   0,
--   'bronze'
-- )
-- ON CONFLICT (user_id) DO NOTHING;
