'use client';

import React, { useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '~/core/generic/shadcn-utils';

import { cva } from 'cva';
import If from '~/core/ui/If';
import { TooltipContent, Tooltip, TooltipTrigger } from '~/core/ui/Tooltip';
import SidebarContext from '~/lib/contexts/sidebar';

import isRouteActive from '~/core/generic/is-route-active';

export function Sidebar({
  children,
  collapsed = false,
}: React.PropsWithChildren<{
  collapsed?: boolean;
}>) {
  const className = getClassNameBuilder()({
    collapsed,
  });

  return <div className={className}>{children}</div>;
}

export function SidebarContent({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) {
  return (
    <div
      className={cn('flex w-full flex-col space-y-1 px-container', className)}
    >
      {children}
    </div>
  );
}

export function SidebarItem({
  end,
  path,
  children,
  Icon,
}: React.PropsWithChildren<{
  path: string;
  Icon: React.ElementType;
  end?: boolean;
}>) {
  const { collapsed } = useContext(SidebarContext);

  const currentPath = usePathname() ?? '';
  const active = isRouteActive(path, currentPath, end ? 1 : 3);

  const className = getSidebarItemClassBuilder()({
    collapsed,
    active,
  });

  return (
    <Link key={path} href={path} className={className}>
      <If condition={collapsed} fallback={<Icon className={'h-6'} />}>
        <Tooltip>
          <TooltipTrigger>
            <Icon className={'h-6'} />
          </TooltipTrigger>

          <TooltipContent side={'right'} sideOffset={20}>
            {children}
          </TooltipContent>
        </Tooltip>
      </If>

      <span>{children}</span>
    </Link>
  );
}

export default Sidebar;

function getClassNameBuilder() {
  return cva(
    [
      'relative flex hidden h-screen flex-col border-r ' +
        ' border-gray-100 dark:border-dark-800 lg:flex space-y-4',
    ],
    {
      variants: {
        collapsed: {
          true: `w-[5rem]`,
          false: `w-2/12 max-w-xs sm:min-w-[12rem] lg:min-w-[17rem]`,
        },
      },
    },
  );
}

function getSidebarItemClassBuilder() {
  return cva(
    [
      `flex w-full items-center rounded-md border-transparent text-sm font-base transition-colors duration-300`,
    ],
    {
      variants: {
        collapsed: {
          true: `justify-center space-x-0 px-0.5 py-2 [&>span]:hidden`,
          false: `py-2 px-3 pr-12 space-x-2.5`,
        },
        active: {
          true: `bg-primary/5 dark:bg-primary-300/10 font-medium`,
          false: `ring-transparent hover:bg-gray-50 dark:hover:bg-dark-800/40 active:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:active:bg-dark-700`,
        },
      },
      compoundVariants: [
        {
          collapsed: true,
          active: true,
          className: `bg-primary/5 dark:bg-dark-800 text-primary dark:text-white`,
        },
        {
          collapsed: false,
          active: true,
          className: `dark:bg-dark-800 text-primary-700 dark:text-white`,
        },
        {
          collapsed: true,
          active: false,
          className: `dark:text-gray-300`,
        },
      ],
    },
  );
}
