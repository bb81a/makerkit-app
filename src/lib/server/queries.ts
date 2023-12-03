import type { SupabaseClient } from '@supabase/supabase-js';
import type UserData from '~/core/session/types/user-data';

/**
 * @description Fetch user object data (not auth!) by ID {@link userId}
 */
export async function getUserDataById(client: SupabaseClient, userId: string) {
  const result = await client
    .from('users')
    .select<string, UserData>(
      `
      id,
      displayName: display_name,
      photoUrl: photo_url,
      onboarded
    `
    )
    .eq('id', userId)
    .maybeSingle();

  return result.data;
}
