'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import { createBillingPortalSessionAction } from '~/lib/stripe/actions';

const BillingPortalRedirectButton: React.FCC<{
  customerId: string;
  className?: string;
}> = ({ children, customerId, className }) => {
  return (
    <form action={createBillingPortalSessionAction}>
      <input type={'hidden'} name={'customerId'} value={customerId} />

      <CsrfTokenInput />

      <Button
        data-cy={'manage-billing-redirect-button'}
        variant={'secondary'}
        className={className}
      >
        <span className={'flex items-center space-x-2'}>
          <span>{children}</span>

          <ArrowRightIcon className={'h-5'} />
        </span>
      </Button>
    </form>
  );
};

function CsrfTokenInput() {
  const csrfToken = useCsrfToken();

  return <input type="hidden" name={'csrfToken'} defaultValue={csrfToken} />;
}

export default BillingPortalRedirectButton;
