import { Database } from '~/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

import {
  ORGANIZATIONS_SUBSCRIPTIONS_TABLE,
  ORGANIZATIONS_TABLE,
} from '~/lib/db-tables';

import getSupabaseServerActionClient from '~/core/supabase/action-client';
import getLogger from '~/core/logger';
import getStripeInstance from '~/core/stripe/get-stripe';

/**
 * Deletes an organization.
 *
 * Validation must be done before calling this function.
 *
 * @param {SupabaseClient<Database>} client - The Supabase client instance.
 * @param {Object} params - The parameters for deleting the organization.
 * @param {number} params.organizationId - The ID of the organization to delete.
 *
 *
 * @throws {Error} If there was an error deleting the organization.
 **/
export default async function deleteOrganization(
  client: SupabaseClient<Database>,
  params: {
    organizationId: number;
  },
) {
  const logger = getLogger();
  const { organizationId } = params;

  const subscriptionResponse = await client
    .from(ORGANIZATIONS_SUBSCRIPTIONS_TABLE)
    .select(
      `
      subscriptionId: subscription_id,
      organizationId: organization_id
    `,
    )
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (subscriptionResponse.data) {
    const id = subscriptionResponse.data.subscriptionId;

    // cancel the Stripe subscription if it exists
    if (id) {
      await cancelStripeSubscription(id);
    }
  }

  const adminClient = getSupabaseServerActionClient({ admin: true });

  const response = await adminClient
    .from(ORGANIZATIONS_TABLE)
    .delete()
    .eq('id', organizationId);

  if (response.error) {
    logger.info(
      { ...params, error: response.error },
      `Error deleting organization`,
    );

    throw new Error(`Error deleting organization`);
  }

  logger.info(params, `User successfully deleted organization`);
}

/**
 * Cancel a Stripe subscription.
 *
 * @param {string} subscriptionId - The ID of the subscription to cancel.
 * @throws {Error} - If there's an error cancelling the subscription.
 */
async function cancelStripeSubscription(subscriptionId: string) {
  const stripe = await getStripeInstance();

  try {
    await stripe.subscriptions.cancel(subscriptionId, {
      invoice_now: true,
    });
  } catch (e) {
    getLogger().error(
      {
        e,
      },
      'Failed to cancel stripe subscription',
    );

    throw e;
  }
}
