import organizationPo from '../../support/organization.po';
import organizationPageObject from '../../support/organization.po';

describe(`Transfer Ownership`, () => {
  const targetMemberEmail = `test-transfer-ownership@makerkit.dev`;

  function signIn() {
    const organization = organizationPageObject.useDefaultOrganization();
    cy.signIn(`/dashboard/${organization}/settings/organization/members`);
  }

  function transferOwnership(email: string) {
    organizationPo.transferOwnership(email);
    organizationPo.$getConfirmTransferOwnershipButton().click();
  }

  describe(`When the owner transfers ownership to another member`, () => {
    it('should update the users roles', () => {
      // sign in
      signIn();

      // transfer ownership
      transferOwnership(targetMemberEmail);
      cy.wait(500);

      // should mark the new owner as "Owner"
      organizationPo.$getMemberByEmail(targetMemberEmail).within(() => {
        organizationPo.$getRoleBadge().should(`contain`, `Owner`);
      });

      // should mark the current user as "Admin"
      organizationPo.$getMemberByEmail(`You`).within(() => {
        organizationPo.$getRoleBadge().should(`contain`, `Admin`);
      });

      // should disallow actions on the new owner
      organizationPo.$getMemberByEmail(targetMemberEmail).within(() => {
        organizationPo.$getMemberActionsDropdown().should('be.disabled');
      });
    });
  });
});
