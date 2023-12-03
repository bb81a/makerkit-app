import { FormEventHandler, useCallback, useTransition } from 'react';

import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';

import Trans from '~/core/ui/Trans';
import { createNewOrganizationAction } from '~/lib/organizations/actions';
import useCsrfToken from '~/core/hooks/use-csrf-token';

const Heading = (
  <Trans i18nKey={'organization:createOrganizationModalHeading'} />
);

const CreateOrganizationModal: React.FC<{
  Trigger: React.ReactNode;
}> = ({ Trigger }) => {
  const [isSubmitting, startTransition] = useTransition();
  const csrfToken = useCsrfToken();

  const createOrganizationMutation = useCallback(
    (organization: string) => {
      return startTransition(async () => {
        await createNewOrganizationAction({
          organization,
          csrfToken,
        });
      });
    },
    [csrfToken],
  );

  const onSubmit: FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget as HTMLFormElement);
      const organization = data.get('name') as string;

      createOrganizationMutation(organization);
    },
    [createOrganizationMutation],
  );

  return (
    <Modal Trigger={Trigger} heading={Heading}>
      <form onSubmit={onSubmit}>
        <div className={'flex flex-col space-y-6'}>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'organization:organizationNameLabel'} />

              <TextField.Input
                data-cy={'create-organization-name-input'}
                name={'name'}
                required
                placeholder={'ex. IndieCorp'}
              />
            </TextField.Label>
          </TextField>

          <div className={'flex justify-end space-x-2'}>
            <Button
              data-cy={'confirm-create-organization-button'}
              loading={isSubmitting}
            >
              <Trans i18nKey={'organization:createOrganizationSubmitLabel'} />
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrganizationModal;
