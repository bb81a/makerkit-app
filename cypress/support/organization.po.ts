import MembershipRole from '~/lib/organizations/types/membership-role';

const $get = cy.cyGet.bind(cy);

const organizationPageObject = {
  $getOrganizationNameInput: () => $get(`organization-name-input`),
  $getUpdateOrganizationSubmitButton: () =>
    $get(`update-organization-submit-button`),
  $currentOrganization: (name?: string) => {
    if (name) {
      return cy.contains(`[data-cy="organization-selector"]`, name, {
        timeout: 10000,
      });
    }

    return $get(`organization-selector`);
  },
  $createOrganizationButton: () => $get(`create-organization-button`),
  $confirmCreateOrganizationButton: () =>
    $get(`confirm-create-organization-button`),
  $createOrganizationNameInput: () => $get(`create-organization-name-input`),
  $getMemberByEmail(invitedMemberEmail: string) {
    return cy.contains(`[data-cy="organization-member"]`, invitedMemberEmail, {
      timeout: 10000,
    });
  },
  $getInvitedMembers: () => $get(`invited-member`),
  $getInvitedMemberByEmail(invitedMemberEmail: string) {
    return this.$getInvitedMembers().contains(`[data-cy]`, invitedMemberEmail);
  },
  $getMemberActionsDropdown: () => $get(`member-actions-dropdown`),
  $getInviteMembersForm: () => $get('invite-members-form'),
  $getInvitationEmailInput: (index = 0) => $get(`invite-email-input`).eq(index),
  $getAppendNewInviteButton: () => $get(`append-new-invite-button`),
  $getInvitationsSubmitButton: () => $get(`send-invites-button`),
  $getDeleteInviteButton: () => $get(`delete-invite-button`),
  $getConfirmDeleteInviteButton: () => $get(`confirm-delete-invite-button`),
  $getConfirmTransferOwnershipButton: () =>
    $get(`confirm-transfer-ownership-button`),
  $getRoleSelector: (index = 0) => $get(`role-selector-trigger`).eq(index),
  $getRoleBadge: () => $get(`member-role-badge`),
  $removeMemberActionButton: () => $get(`remove-member-action`),
  $transferOwnershipAction: () => $get('transfer-ownership-action'),
  $updateMemberRoleActionButton: () => $get(`update-member-role-action`),
  getDefaultOrganizationId() {
    return 'bc3ab22c-c444-4491-84f2-cd8d9873e8c2';
  },
  openOrganizationsDropdown() {
    organizationPageObject.$currentOrganization().wait(500).click();
  },
  createOrganization(organizationName: string) {
    organizationPageObject.openOrganizationsDropdown();
    organizationPageObject.$createOrganizationButton().click();

    organizationPageObject
      .$createOrganizationNameInput()
      .type(organizationName);

    organizationPageObject.$confirmCreateOrganizationButton().click();
    cy.wait(1000);
  },
  useDefaultOrganization() {
    cy.setCookie('organizationId', this.getDefaultOrganizationId());

    return this.getDefaultOrganizationId();
  },
  getOrganizationDropdownItem(name: string) {
    return cy.contains('[data-cy="organization-selector-item"]', name);
  },
  switchToOrganization(name: string) {
    organizationPageObject.openOrganizationsDropdown();

    organizationPageObject.getOrganizationDropdownItem(name).click({
      force: true,
    });

    return this;
  },
  openMemberActionsDropdown() {
    this.$getMemberActionsDropdown().wait(250).click();

    return this;
  },
  openRoleSelectorDropdown() {
    this.$getRoleSelector().click();

    return this;
  },
  selectRole(role: MembershipRole) {
    this.openRoleSelectorDropdown();
    cy.cyGet(`role-item-${role}`).click();

    return this;
  },
  inviteMember(email: string, role = MembershipRole.Member) {
    this.$getInvitationEmailInput().clear().type(email);
    this.selectRole(role);
    this.$getInvitationsSubmitButton().click();

    return this;
  },
  removeMember(email: string) {
    this.$getMemberByEmail(email).within(() => {
      this.openMemberActionsDropdown();
    });

    this.$removeMemberActionButton().click({ force: true });

    cy.cyGet(`confirm-remove-member`).click();

    return this;
  },
  updateMemberRole(email: string, role: MembershipRole) {
    this.$getMemberByEmail(email).within(() => {
      this.openMemberActionsDropdown();
    });

    this.$updateMemberRoleActionButton().click({ force: true });
    this.selectRole(role);

    cy.cyGet(`confirm-update-member-role`).click();

    return this;
  },
  transferOwnership(email: string) {
    this.$getMemberByEmail(email).within(() => {
      this.openMemberActionsDropdown();
    });

    this.$transferOwnershipAction().click({ force: true });
  },
  assertCurrentOrganization(name: string) {
    this.$currentOrganization(name).should('be.visible');
  },
  $getLeaveOrganizationButton: () => $get(`leave-organization-button`),
  $getConfirmLeaveOrganizationButton: () =>
    $get(`confirm-leave-organization-button`),
  $getDeleteOrganizationButton: () => $get(`delete-organization-button`),
  $getConfirmDeleteOrganizationButton: () =>
    $get(`confirm-delete-organization-button`),
  $getDeleteOrganizationConfirmationInput: () =>
    $get(`delete-organization-input-field`),
};

export default organizationPageObject;
