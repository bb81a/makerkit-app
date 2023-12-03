import type { SupabaseClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

import { MEMBERSHIPS_TABLE } from '~/lib/db-tables';
import type Membership from '~/lib/organizations/types/membership';
import type { Database } from '../../database.types';

type Client = SupabaseClient<Database>;

/**
 * @name acceptInviteToOrganization
 * @description Add a member to an organization by using the invite code
 */
export async function acceptInviteToOrganization(
  client: Client,
  params: {
    code: string;
    userId: string;
  }
) {
  return client
    .rpc('accept_invite_to_organization', {
      invite_user_id: params.userId,
      invite_code: params.code,
    })
    .single();
}

/**
 * @name createOrganizationMembership
 * @description Mutation to create a new membership record for a user within an organization.
 * @param client
 * @param membership
 */
export async function createOrganizationMembership(
  client: Client,
  membership: Partial<Membership>
) {
  const code = nanoid(16);

  return getMembershipsTable(client)
    .insert({
      role: membership.role,
      organization_id: membership.organizationId,
      invited_email: membership.invitedEmail,
      code,
    })
    .select('id, code')
    .throwOnError()
    .single();
}

/**
 * @name updateMembershipById
 * @description Mutation to update the role of a member within an organization.
 * @param client
 * @param membership
 */
export async function updateMembershipById(
  client: Client,
  membership: Partial<Membership> & { id: number }
) {
  const { id, ...params } = membership;

  return getMembershipsTable(client)
    .update(params)
    .match({ id })
    .throwOnError();
}

/**
 * @name deleteMembershipById
 * @param client
 * @param membershipId
 */
export async function deleteMembershipById(
  client: Client,
  membershipId: number
) {
  return client
    .from(MEMBERSHIPS_TABLE)
    .delete()
    .eq('id', membershipId)
    .throwOnError();
}

/**
 * @name transferOwnership
 * @description Transfer ownership of an organization to another member.
 * @param client
 * @param params
 */
export async function transferOwnership(
  client: Client,
  params: {
    organizationId: number;
    targetUserMembershipId: number;
  }
) {
  return client.rpc('transfer_organization', {
    org_id: params.organizationId,
    target_user_membership_id: params.targetUserMembershipId,
  });
}

function getMembershipsTable(client: SupabaseClient) {
  return client.from(MEMBERSHIPS_TABLE);
}
