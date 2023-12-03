import type { SupabaseClient } from '@supabase/supabase-js';
import { MEMBERSHIPS_TABLE } from '~/lib/db-tables';
import type Membership from '~/lib/organizations/types/membership';
import type { Database } from '../../database.types';

type Client = SupabaseClient<Database>;

/**
 * @name getMembershipByInviteCode
 * @description Fetch a membership by its invite code
 */
export async function getMembershipByInviteCode<Response>(
  client: Client,
  params: {
    code: string;
    query?: string;
  },
) {
  return client
    .from(MEMBERSHIPS_TABLE)
    .select<string, Response>(
      params.query ??
        `
      id,
      role,
      code,
      invitedEmail: invited_email,
      organizationId: organization_id,
      userId: user_id,
      `,
    )
    .eq('code', params.code)
    .throwOnError()
    .single();
}

/**
 * @description Get the role of a user given an organization ID
 */
export async function getUserMembershipByOrganization(
  client: Client,
  params: {
    userId: string;
    organizationUid: string;
  },
) {
  const { data, error } = await client
    .from(MEMBERSHIPS_TABLE)
    .select<string, Membership>(
      `
      *,
      organization: organization_id !inner (
        uuid
      )
     `,
    )
    .eq('user_id', params.userId)
    .eq('organization.uuid', params.organizationUid)
    .single()
    .throwOnError();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * @description Get the role of a user given an membership ID
 */
export async function getUserRoleByMembershipId(
  client: Client,
  membershipId: number,
) {
  const { data, error } = await client
    .from(MEMBERSHIPS_TABLE)
    .select<string, Pick<Membership, 'role'>>(`role`)
    .eq('id', membershipId)
    .throwOnError()
    .single();

  if (error) {
    throw error;
  }

  return data.role;
}

/**
 * @name getMembershipByEmail
 * @param client
 * @param params
 */
export async function getMembershipByEmail(
  client: Client,
  params: {
    email: string;
    organizationId: number;
  },
) {
  return client
    .from(MEMBERSHIPS_TABLE)
    .select(
      `
      id,
      role,
      code,
      invitedEmail: invited_email,
      organizationId: organization_id,
      userId: user_id
  `,
    )
    .eq('invited_email', params.email)
    .eq('organization_id', params.organizationId)
    .single();
}
