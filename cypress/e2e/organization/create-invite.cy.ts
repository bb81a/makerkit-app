import organizationPageObject from '../../support/organization.po';
import MembershipRole from '~/lib/organizations/types/membership-role';
import authPo from '../../support/auth.po';

describe(`Create Invite`, () => {
  const email = `invited-member+${Math.round(
    Math.random() * 1000,
  )}@makerkit.dev`;

  const defaultEmailAddress = authPo.getDefaultUserEmail();

  function signIn() {
    const organization = organizationPageObject.useDefaultOrganization();

    cy.signIn(
      `/dashboard/${organization}/settings/organization/members/invite`,
    );
  }

  describe(`Given a user invites a new member`, () => {
    describe(`When entering current user's email address`, () => {
      it('should disallow the form submission', () => {
        signIn();

        organizationPageObject
          .$getInvitationEmailInput()
          .type(defaultEmailAddress);

        organizationPageObject.$getInviteMembersForm().submit();

        const validity = false;
        getInviteMembersFormValidity().should('equal', validity);
      });
    });

    describe(`When entering the same email address multiple times`, () => {
      const emailAddress = `dupe@makerkit.dev`;

      function setup() {
        signIn();

        organizationPageObject
          .$getInvitationEmailInput()
          .type(defaultEmailAddress);

        organizationPageObject.$getInviteMembersForm().submit();

        // here we add the same email into multiple rows
        organizationPageObject
          .$getInvitationEmailInput()
          .clear()
          .type(emailAddress);
      }

      it('should disallow the form submission', () => {
        setup();

        organizationPageObject.$getAppendNewInviteButton().click();
        organizationPageObject.$getInvitationEmailInput(1).type(emailAddress);
        organizationPageObject.$getInviteMembersForm().submit();

        const validity = false;
        getInviteMembersFormValidity().should('equal', validity);
      });
    });

    describe(`When the user is invited successfully`, () => {
      it('should be added to the list', () => {
        signIn();

        cy.intercept({
          method: 'POST',
          pathname: '*invite',
        }).as('createInvite');

        organizationPageObject.inviteMember(email, MembershipRole.Member);

        cy.wait('@createInvite');

        organizationPageObject.$getInvitedMemberByEmail(email).should('exist');
      });

      it('should be found in InBucket', () => {
        cy.visitSignUpEmailFromInBucket(email);
        cy.cyGet('auth-submit-button').should('exist');
      });
    });

    describe(`When the same user is invited again`, () => {
      it('should update the existing invite', () => {
        signIn();

        organizationPageObject.inviteMember(email, MembershipRole.Admin);

        organizationPageObject.$getInvitedMemberByEmail(email).within(() => {
          organizationPageObject.$getRoleBadge().should('have.text', `Admin`);
        });
      });
    });
  });
});

function getInviteMembersFormValidity() {
  return organizationPageObject.$getInviteMembersForm().then(($form) => {
    const form = $form.get()[0] as HTMLFormElement;

    return form.checkValidity();
  });
}
