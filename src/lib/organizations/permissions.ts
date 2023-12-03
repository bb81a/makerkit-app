import MembershipRole from '~/lib/organizations/types/membership-role';

/**
 * Permissions
 *
 * Permissions should be kept here or in a centralized place. Assuming you will add new custom
 * functions to check the user's permission to perform an action, it's recommended that you do it here
 *
 * This helps track down behavior rather than changing logic in every single place, which is
 * going to make it difficult to track down the logic. Keep this lightweight, so you don't need to make
 * different files for server vs client
 *
 * Permissions are defined such that a user can perform a disruptive option on other users
 * only if they have a greater role. For example, an Admin cannot remove another Admin from an organization
 *
 * You can update {@link MembershipRole} however you wish according to your app's domain
 */

/**
 *
 * @param currentUserRole The current logged-in user
 * @param targetUser The role of the target of the action
 * @description Checks if a user can perform actions (such as update a role) of another user
 * @name canUpdateUser
 */
export function canUpdateUser(
  currentUserRole: MembershipRole,
  targetUser: MembershipRole
) {
  return currentUserRole > targetUser;
}

/**
 * @name canChangeBilling
 * @param currentUserRole
 * @description Checks if a role can change billing information.
 * By default, only Owners and Admin can invite users
 */
export function canChangeBilling(currentUserRole: MembershipRole) {
  return currentUserRole === MembershipRole.Owner;
}

/**
 * @name canInviteUsers
 * @param currentUserRole
 * @description Checks if a role can change invite new users to an organization.
 * By default, only Owners and Admin can invite users
 */
export function canInviteUsers(currentUserRole: MembershipRole) {
  return currentUserRole >= MembershipRole.Admin;
}

/**
 * @description Check a user with role {@link inviterRole} can invite a user
 * with role {@link inviteeRole}.
 *
 * By default, users can invite users having the same or inferior role, and
 * ownership can only be transferred
 * @param inviterRole
 * @param inviteeRole
 * @name canInviteUser
 */
export function canInviteUser(
  inviterRole: MembershipRole,
  inviteeRole: MembershipRole
) {
  const canInvite = canInviteUsers(inviterRole);
  const hasGreaterRole = inviterRole >= inviteeRole;
  const isNotOwner = inviteeRole !== MembershipRole.Owner;

  return canInvite && hasGreaterRole && isNotOwner;
}

/**
 * @description Check if a user can delete invites
 * @param inviterRole
 * @name canDeleteInvites
 */
export function canDeleteInvites(inviterRole: MembershipRole) {
  return canInviteUsers(inviterRole);
}
