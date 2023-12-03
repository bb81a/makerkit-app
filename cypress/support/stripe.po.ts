import { Stripe } from 'stripe';

const $get = cy.cyGet.bind(cy);

const stripePo = {
  $plans: () => $get('subscription-plan'),
  $getStripeCheckoutIframe: () => {
    return cy.get('[name="embedded-checkout"]').its('0.contentDocument');
  },
  $fillForm() {
    this.$billingName().type('Mr Makerkit');
    this.$cardNumber().type('4242424242424242');
    this.$expiry().type('1228');
    this.$cvc().type('123');
    this.$billingCountry().select('IT');
  },
  $cardNumber() {
    return this.$getStripeCheckoutIframe().find('#cardNumber');
  },
  $cvc() {
    return this.$getStripeCheckoutIframe().find('#cardCvc');
  },
  $expiry() {
    return this.$getStripeCheckoutIframe().find('#cardExpiry');
  },
  $billingName() {
    return this.$getStripeCheckoutIframe().find('#billingName');
  },
  $cardForm() {
    return this.$getStripeCheckoutIframe().find('form');
  },
  $billingCountry() {
    return this.$getStripeCheckoutIframe().find('#billingCountry');
  },
  selectPlan(number: number = 0) {
    this.$plans().eq(number).find('button').click();
  },
  $manageBillingButton() {
    return cy.cyGet('manage-billing-redirect-button');
  },
  $status() {
    return cy.get('[data-cy-status]');
  },
  $assertStatus(status: Stripe.Subscription.Status) {
    this.$status().should('have.attr', 'data-cy-status', status);
  },
  verifyCreateSubscriptionElements() {
    cy.cyGet('subscription-card').should('exist');
    cy.cyGet('subscription-name').should('contain.text', 'Basic');
  },
};

export default stripePo;
