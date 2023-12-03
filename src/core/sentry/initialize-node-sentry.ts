import * as Sentry from '@sentry/node';

// Importing @sentry/tracing patches the global hub for tracing to work
// Fore more info: https://docs.sentry.io/platforms/node/
import '@sentry/tracing';

import configuration from '~/configuration';
import isBrowser from '~/core/generic/is-browser';

export function initializeNodeSentry() {
  const dsn = configuration.sentry.dsn;

  if (!dsn) {
    warnSentryNotConfigured();
  }

  if (isBrowser()) {
    warnNotNodeEnvironment();

    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: configuration.environment,
  });
}

function warnSentryNotConfigured() {
  console.warn(
    `Sentry DSN not provided. Please add a SENTRY_DSN environment variable to enable error tracking.`
  );
}

function warnNotNodeEnvironment() {
  console.warn(
    `This Sentry instance is being initialized in a browser environment, but it's for Node. Please use 'initializeBrowserSentry' instead.`
  );
}
