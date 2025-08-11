-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "profiles_admin_select" ON public.profiles;

-- Keep only safe policies that don't cause recursion
-- Users can see their own profile
CREATE POLICY "profiles_self_select" ON public.profiles
FOR SELECT USING (id = auth.uid());

-- Active admins/editors can see all profiles using security definer function
CREATE POLICY "profiles_admin_can_see_all" ON public.profiles  
FOR SELECT USING (is_admin_or_editor_active());