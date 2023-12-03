import type { SupabaseClient } from '@supabase/supabase-js';

interface Params {
  organizationName: string;
  userId: string;
  client: SupabaseClient;
}

/**
 * @name completeOnboarding
 * @description Handles the submission of the onboarding flow. By default,
 * we use the submission to create the Organization and the user record
 * associated with the User who signed up using its ID
 * @param userId
 * @param organizationName
 * @param client
 */
async function completeOnboarding({
  userId,
  organizationName,
  client,
}: Params) {
  return client
    .rpc('create_new_organization', {
      user_id: userId,
      org_name: organizationName,
    })
    .single<string>();
}

export default completeOnboarding;
