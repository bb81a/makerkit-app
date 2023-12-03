import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

import isUserSuperAdmin from '~/app/admin/utils/is-user-super-admin';
import AdminSidebar from '~/app/admin/components/AdminSidebar';
import getLanguageCookie from '~/i18n/get-language-cookie';
import AdminProviders from '~/app/admin/components/AdminProviders';
import { Page } from '~/core/ui/Page';

async function AdminLayout({ children }: React.PropsWithChildren) {
  const isAdmin = await isUserSuperAdmin();

  const language = getLanguageCookie();

  if (!isAdmin) {
    notFound();
  }

  const csrfToken = headers().get('X-CSRF-Token');

  return (
    <AdminProviders csrfToken={csrfToken} language={language}>
      <Page sidebar={<AdminSidebar />}>{children}</Page>
    </AdminProviders>
  );
}

export default AdminLayout;
