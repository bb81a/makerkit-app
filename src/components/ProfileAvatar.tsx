import type UserSession from '~/core/session/types/user-session';
import { Avatar, AvatarFallback, AvatarImage } from '~/core/ui/Avatar';

type ProfileAvatarProps =
  | {
      user: Maybe<UserSession>;
    }
  | {
      text: Maybe<string>;
    };

const ProfileAvatar: React.FCC<ProfileAvatarProps> = (props) => {
  if ('user' in props && props.user) {
    const photoUrl = props.user.data?.photoUrl;

    return (
      <Avatar className={'mx-auto w-9 h-9'}>
        {photoUrl ? <AvatarImage src={photoUrl} /> : null}

        <AvatarFallback>{getUserInitials(props.user)}</AvatarFallback>
      </Avatar>
    );
  }

  if ('text' in props && props.text) {
    return (
      <Avatar className={'mx-auto'}>
        <AvatarFallback>{props.text[0]}</AvatarFallback>
      </Avatar>
    );
  }

  return null;
};

function getUserInitials(session: Maybe<UserSession>) {
  const displayName = getDisplayName(session);

  return displayName[0] ?? '';
}

function getDisplayName(session: Maybe<UserSession>) {
  if (!session) {
    return '';
  }

  return (
    session.data?.displayName ??
    session.auth?.user.email ??
    session.auth?.user.phone ??
    ''
  );
}

export default ProfileAvatar;
