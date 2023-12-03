import { use } from 'react';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { isNotFoundError } from 'next/dist/client/components/not-found';
import If from '~/core/ui/If';
import Heading from '~/core/ui/Heading';
import Trans from '~/core/ui/Trans';

import getLogger from '~/core/logger';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';

import { getMembershipByInviteCode } from '~/lib/memberships/queries';
import ExistingUserInviteForm from '~/app/invite/components/ExistingUserInviteForm';
import NewUserInviteForm from '~/app/invite/components/NewUserInviteForm';
import InviteCsrfTokenProvider from '~/app/invite/components/InviteCsrfTokenProvider';
import { withI18n } from '~/i18n/with-i18n';

interface Context {
  params: {
    code: string;
  };
}

export const metadata = {
  title: `Join Organization`,
};

const InvitePage = ({ params }: Context) => {
  const code = params.code;
  const data = use(loadInviteData(code));

  const organization = data.membership.organization;

  return (
    <>
      <Heading type={4}>
        <Trans
          i18nKey={'auth:joinOrganizationHeading'}
          values={{
            organization: organization.name,
          }}
        />
      </Heading>

      <div>
        <p className={'text-center'}>
          <Trans
            i18nKey={'auth:joinOrganizationSubHeading'}
            values={{
              organization: organization.name,
            }}
            components={{ b: <b /> }}
          />
        </p>

        <p className={'text-center'}>
          <If condition={!data.session}>
            <Trans i18nKey={'auth:signUpToAcceptInvite'} />
          </If>
        </p>
      </div>

      <InviteCsrfTokenProvider csrfToken={data.csrfToken}>
        <If
          condition={data.session}
          fallback={<NewUserInviteForm code={code} />}
        >
          {(session) => (
            <ExistingUserInviteForm code={code} session={session} />
          )}
        </If>
      </InviteCsrfTokenProvider>
    </>
  );
};

export default withI18n(InvitePage);

async function loadInviteData(code: string) {
  const logger = getLogger();
  const client = getSupabaseServerComponentClient();

  // we use an admin client to be able to read the pending membership
  // without having to be logged in
  const adminClient = getSupabaseServerComponentClient({ admin: true });

  try {
    const { data: membership, error } = await getMembershipByInviteCode<{
      id: number;
      code: string;
      organization: {
        name: string;
        id: number;
      };
    }>(adminClient, {
      code,
      query: `
        id,
        code,
        organization: organization_id (
          name,
          id
        )
      `,
    });

    // if the invite wasn't found, it's 404
    if (error) {
      logger.warn(
        {
          code,
        },
        `User navigated to invite page, but it wasn't found. Redirecting to home page...`,
      );

      return notFound();
    }

    const { data: userSession } = await client.auth.getSession();
    const session = userSession?.session;
    const csrfToken = headers().get('x-csrf-token');

    return {
      csrfToken,
      session,
      membership,
      code,
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return notFound();
    }

    logger.error(
      error,
      `Error encountered while fetching invite. Redirecting to home page...`,
    );

    redirect('/');
  }
}
