import useUserSession from '~/core/hooks/use-user-session';

/**
 * @name useCurrentUserRole
 * @description Hook to fetch the user's current role
 */
function useCurrentUserRole() {
  const user = useUserSession();

  return user?.role;
}

export default useCurrentUserRole;
