import { redirect } from 'next/navigation';

import AuthPageShell from '~/app/auth/components/AuthPageShell';
import PasswordResetForm from '~/app/password-reset/components/PasswordResetForm';
import { withI18n } from '~/i18n/with-i18n';
import getLanguageCookie from '~/i18n/get-language-cookie';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';

async function PasswordResetPage() {
  const client = getSupabaseServerComponentClient();
  const user = await client.auth.getUser();

  // we require the user to be logged in to access this page
  if (!user.data) {
    redirect('/auth/password-reset');
  }

  return (
    <AuthPageShell language={getLanguageCookie()}>
      <PasswordResetForm />
    </AuthPageShell>
  );
}

export default withI18n(PasswordResetPage);
