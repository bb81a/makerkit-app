'use client';

import { useCallback, useTransition } from 'react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

import IconButton from '~/core/ui/IconButton';
import Modal from '~/core/ui/Modal';
import Button from '~/core/ui/Button';
import Trans from '~/core/ui/Trans';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import { deleteMemberAction } from '~/lib/memberships/actions';

const Heading = <Trans i18nKey={'organization:deleteInviteModalHeading'} />;

const DeleteInviteButton: React.FCC<{
  membershipId: number;
  memberEmail: string;
}> = ({ membershipId, memberEmail }) => {
  const [isSubmitting, startTransition] = useTransition();
  const csrfToken = useCsrfToken();

  const onInviteDeleteRequested = useCallback(async () => {
    startTransition(async () => {
      await deleteMemberAction({ membershipId, csrfToken });
    });
  }, [csrfToken, membershipId]);

  return (
    <Modal
      heading={Heading}
      Trigger={
        <IconButton data-cy={'delete-invite-button'} label={'Delete Invite'}>
          <XMarkIcon className={'h-6'} />
        </IconButton>
      }
    >
      <div className={'flex flex-col space-y-6 text-sm'}>
        <p>
          <Trans
            i18nKey={'organization:confirmDeletingMemberInvite'}
            values={{ email: memberEmail }}
            components={{ b: <b /> }}
          />
        </p>

        <p>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <div className={'flex justify-end'}>
          <Button
            loading={isSubmitting}
            data-cy={'confirm-delete-invite-button'}
            variant={'destructive'}
            onClick={onInviteDeleteRequested}
          >
            <Trans i18nKey={'organization:deleteInviteSubmitLabel'} />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteInviteButton;
