import type UserData from '~/core/session/types/user-data';
import type MembershipRole from '~/lib/organizations/types/membership-role';

/**
 * This interface combines the user's metadata from
 * Supabase Auth and the user's record in Database
 */
interface UserSession {
  auth: {
    accessToken: Maybe<string>;

    user: {
      id: string;
      email: Maybe<string>;
      phone: Maybe<string>;
    };
  };

  data: Maybe<UserData>;
  role: Maybe<MembershipRole>;
}

export default UserSession;
