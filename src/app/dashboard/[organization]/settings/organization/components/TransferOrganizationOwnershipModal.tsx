import { useCallback, useTransition } from 'react';

import Trans from '~/core/ui/Trans';
import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import If from '~/core/ui/If';
import useCsrfToken from '~/core/hooks/use-csrf-token';

import { transferOrganizationOwnershipAction } from '~/lib/organizations/actions';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

const ModalHeading = <Trans i18nKey="organization:transferOwnership" />;

const TransferOrganizationOwnershipModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  membershipId: number;
  targetDisplayName: string;
}> = ({ isOpen, setIsOpen, targetDisplayName, membershipId }) => {
  const csrfToken = useCsrfToken();
  const organization = useCurrentOrganization();
  const organizationUid = organization?.uuid ?? '';
  const [pending, startTransition] = useTransition();

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      startTransition(async () => {
        await transferOrganizationOwnershipAction({
          membershipId,
          organizationUid,
          csrfToken,
        });

        setIsOpen(false);
      });
    },
    [csrfToken, membershipId, organizationUid, setIsOpen],
  );

  return (
    <Modal heading={ModalHeading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className={'flex flex-col space-y-6 text-sm'} onSubmit={onSubmit}>
        <p>
          <Trans
            i18nKey={'organization:transferOwnershipDisclaimer'}
            values={{
              member: targetDisplayName,
            }}
            components={{ b: <b /> }}
          />
        </p>

        <p>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <div className={'flex justify-end space-x-2'}>
          <Modal.CancelButton onClick={() => setIsOpen(false)} />

          <Button
            type={'submit'}
            data-cy={'confirm-transfer-ownership-button'}
            variant={'destructive'}
            loading={pending}
          >
            <If
              condition={pending}
              fallback={<Trans i18nKey={'organization:transferOwnership'} />}
            >
              <Trans i18nKey={'organization:transferringOwnership'} />
            </If>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferOrganizationOwnershipModal;
