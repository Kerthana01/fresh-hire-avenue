-- Fix public job/category browsing without exposing SECURITY DEFINER helpers to visitors.
-- Public users can read published jobs and categories; admin actions stay restricted.

-- Jobs: split public published reads from admin reads/writes.
DROP POLICY IF EXISTS "Published jobs are publicly readable" ON public.jobs;
DROP POLICY IF EXISTS "Admins can read all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can delete jobs" ON public.jobs;

CREATE POLICY "Published jobs are publicly readable"
ON public.jobs
FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins can read all jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can insert jobs"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can update jobs"
ON public.jobs
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can delete jobs"
ON public.jobs
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

-- Categories: public reads for normal category rows; admin writes only.
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

CREATE POLICY "Categories are publicly readable"
ON public.categories
FOR SELECT
TO anon, authenticated
USING (slug IS NOT NULL AND name IS NOT NULL);

CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

-- Subscribers: public subscribe, admin-only list/delete.
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
DROP POLICY IF EXISTS "Only admins can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Only admins can delete subscribers" ON public.subscribers;

CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND length(btrim(email)) > 3 AND position('@' in email) > 1);

CREATE POLICY "Only admins can view subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

CREATE POLICY "Only admins can delete subscribers"
ON public.subscribers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'::public.app_role
  )
);

-- User roles: browser clients can only read their own role. Role creation is handled by the auth trigger/service role.
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Table privileges: anon can only read public content and subscribe; authenticated writes still require RLS admin checks.
GRANT SELECT ON TABLE public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.jobs TO authenticated;
GRANT ALL ON TABLE public.jobs TO service_role;

GRANT SELECT ON TABLE public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;
GRANT ALL ON TABLE public.categories TO service_role;

GRANT INSERT ON TABLE public.subscribers TO anon;
GRANT SELECT, INSERT, DELETE ON TABLE public.subscribers TO authenticated;
GRANT ALL ON TABLE public.subscribers TO service_role;

REVOKE ALL ON TABLE public.user_roles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.user_roles FROM authenticated;
GRANT SELECT ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;

-- The admin helper is no longer needed by public policies; do not expose it to browser client roles.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;