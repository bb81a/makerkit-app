'use client';

import Trans from '~/core/ui/Trans';
import { SidebarItem } from '~/core/ui/Sidebar';

import NAVIGATION_CONFIG from '~/navigation.config';

function AppSidebarNavigation({
  organization,
}: React.PropsWithChildren<{
  organization: string;
}>) {
  return (
    <div className={'flex flex-col space-y-1.5'}>
      {NAVIGATION_CONFIG(organization).items.map((item) => {
        return (
          <SidebarItem
            key={item.path}
            end={item.end}
            path={item.path}
            Icon={item.Icon}
          >
            <Trans i18nKey={item.label} defaults={item.label} />
          </SidebarItem>
        );
      })}
    </div>
  );
}

export default AppSidebarNavigation;
