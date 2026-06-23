
-- Root cause: previous migration revoked EXECUTE on has_role from anon/PUBLIC,
-- but the "Published jobs are publicly readable" RLS policy invokes has_role()
-- for every role (including anon). That caused "permission denied for function
-- has_role" for logged-out visitors, hiding all jobs.

-- Restore table-level grants (RLS still enforces row-level access).
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;

GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

GRANT INSERT ON public.subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Restore EXECUTE on the SECURITY DEFINER role-check function.
-- It is read-only and only reports whether a user has a given role.
-- It cannot be used to elevate privileges; INSERT/UPDATE/DELETE on user_roles
-- remain admin-only via the existing RLS policies.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
