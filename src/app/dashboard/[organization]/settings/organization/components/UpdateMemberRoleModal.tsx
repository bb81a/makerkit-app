import { useCallback, useState, useTransition } from 'react';
import Trans from '~/core/ui/Trans';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';

import type MembershipRole from '~/lib/organizations/types/membership-role';
import { updateMemberAction } from '~/lib/memberships/actions';
import useCsrfToken from '~/core/hooks/use-csrf-token';
import MembershipRoleSelector from './MembershipRoleSelector';
import useCurrentUserRole from '~/lib/organizations/hooks/use-current-user-role';

const Heading = <Trans i18nKey={'organization:updateMemberRoleModalHeading'} />;

const UpdateMemberRoleModal: React.FCC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  membershipId: number;
  memberRole: MembershipRole;
}> = ({ isOpen, setIsOpen, memberRole, membershipId }) => {
  const [role, setRole] = useState<MembershipRole>(memberRole);
  const [isSubmitting, startTransition] = useTransition();
  const csrfToken = useCsrfToken();
  const currentUserRole = useCurrentUserRole();

  const onRoleUpdated = useCallback(async () => {
    if (role !== undefined) {
      startTransition(async () => {
        await updateMemberAction({ membershipId, role, csrfToken });

        setIsOpen(false);
      });
    }
  }, [csrfToken, membershipId, role, setIsOpen]);

  return (
    <Modal heading={Heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-6'}>
        <MembershipRoleSelector
          currentUserRole={currentUserRole}
          value={role}
          onChange={setRole}
        />

        <div className={'flex justify-end space-x-2'}>
          <Modal.CancelButton onClick={() => setIsOpen(false)} />

          <Button
            type={'button'}
            data-cy={'confirm-update-member-role'}
            loading={isSubmitting}
            onClick={onRoleUpdated}
          >
            <Trans i18nKey={'organization:updateRoleSubmitLabel'} />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateMemberRoleModal;
