-- Tighten table-level access while preserving public job browsing
REVOKE ALL ON TABLE public.jobs FROM anon;
GRANT SELECT ON TABLE public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.jobs TO authenticated;
GRANT ALL ON TABLE public.jobs TO service_role;

REVOKE ALL ON TABLE public.categories FROM anon;
GRANT SELECT ON TABLE public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;
GRANT ALL ON TABLE public.categories TO service_role;

REVOKE ALL ON TABLE public.subscribers FROM anon;
GRANT INSERT ON TABLE public.subscribers TO anon;
GRANT SELECT, INSERT, DELETE ON TABLE public.subscribers TO authenticated;
GRANT ALL ON TABLE public.subscribers TO service_role;

REVOKE ALL ON TABLE public.user_roles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;

-- Split job read access so anonymous users never need to execute admin role checks
DROP POLICY IF EXISTS "Published jobs are publicly readable" ON public.jobs;

CREATE POLICY "Published jobs are publicly readable"
ON public.jobs
FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins can read all jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- The role check is required for authenticated admin RLS policies, but no longer needed by anonymous visitors
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;