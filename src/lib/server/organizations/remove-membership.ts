import getSupabaseServerActionClient from '~/core/supabase/action-client';
import { MEMBERSHIPS_TABLE } from '~/lib/db-tables';
import MembershipRole from '~/lib/organizations/types/membership-role';
import getLogger from '~/core/logger';

/**
 * @description Removes a user membership from an organization.
 *
 * This can be used for a user leaving an organization or a super-admin
 * removing a user from an organization. This function prevents an owner
 * from being removed, since this flow is handled separately when the owner
 * deletes the organization.
 */
export default async function removeMembership(params: {
  organizationId: number;
  userId: string;
}) {
  const logger = getLogger();
  const { organizationId, userId } = params;

  logger.info(params, `User leaving organization...`);

  const adminClient = getSupabaseServerActionClient({ admin: true });

  const response = await adminClient
    .from(MEMBERSHIPS_TABLE)
    .delete()
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .neq('role', MembershipRole.Owner);

  if (response.error) {
    logger.info(params, `Error leaving organization`);

    throw new Error(`Error leaving organization`);
  }
}
