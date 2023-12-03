import { defineConfig } from 'cypress';
import { execSync } from 'child_process';
import { loadEnvConfig } from '@next/env';
import { SupabaseClient } from '@supabase/supabase-js';
import configuration from '~/configuration';

// load environment variables from .env
loadEnvConfig(process.cwd());

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './cypress/fixtures',
  video: false,
  chromeWebSecurity: false,
  port: 4600,
  viewportWidth: 1920,
  viewportHeight: 1080,
  pageLoadTimeout: 60000,
  experimentalInteractiveRunEvents: true,
  retries: {
    runMode: 2,
    openMode: 1,
  },
  env: getEnv(),
  e2e: {
    setupNodeEvents(on, config) {
      const port = 3000;

      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: false,
      };

      on('task', {
        resetDatabase,
        confirmEmail,
        getInviteEmail,
      });

      const env = getEnv();

      return {
        ...config,
        ...configOverrides,
        env,
      };
    },
    defaultCommandTimeout: 10000,
    slowTestThreshold: 5000,
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: getExcludeSpecPattern(),
  },
});

function getExcludeSpecPattern() {
  const enableStripeTests = process.env.ENABLE_STRIPE_TESTING === 'true';
  const enableThemeTests = configuration.features.enableThemeSwitcher;

  const excludePatterns = [];

  if (!enableStripeTests || !configuration.stripe.embedded) {
    excludePatterns.push('**/stripe/*');
  }

  if (!enableThemeTests) {
    excludePatterns.push('**/theme.cy.ts');
  }

  return excludePatterns;
}

function resetDatabase() {
  console.log(`Resetting database...`);

  try {
    execSync('npm run supabase:db:reset');

    console.log(`DB reset successful`);

    return true;
  } catch (error) {
    console.error(`DB reset failed`, error);
  }

  return false;
}

function getEnv() {
  const env = process.env;

  const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const USER_EMAIL = env.USER_EMAIL;
  const USER_PASSWORD = env.USER_PASSWORD;

  return {
    STRIPE_WEBHOOK_SECRET,
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    USER_EMAIL,
    USER_PASSWORD,
  };
}

async function confirmEmail(email: string) {
  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!apiUrl) {
    throw new Error(`NEXT_PUBLIC_SUPABASE_URL not provided`);
  }

  if (!apiKey) {
    throw new Error(`SUPABASE_SERVICE_ROLE_KEY not provided`);
  }

  const client = new SupabaseClient(apiUrl, apiKey);

  const { data } = await client.auth.admin.listUsers({
    perPage: 100,
  });

  const user = data.users.find((user) => user.email === email);

  if (!user) {
    throw new Error(`User ${email} not found: ${JSON.stringify(data.users)}.`);
  }

  console.log(`Confirming email for user ${user.email}...`);

  await client.auth.admin
    .updateUserById(user.id, {
      email_confirm: true,
    })
    .then(() => {
      console.log(`User email confirmed`);
    })
    .catch(console.error);

  return true;
}

async function getInviteEmail(
  mailbox: string,
  params = {
    deleteAfter: true,
  },
) {
  const url = `http://localhost:54324/api/v1/mailbox/${mailbox}`;
  /* @ts-ignore */
  const { default: fetch } = await import('node-fetch');

  const response = await fetch(url);
  const json = (await response.json()) as Maybe<Array<{ id: string }>>;

  if (!json) {
    return;
  }

  const messageId = json[0].id;
  const messageUrl = `${url}/${messageId}`;

  const messageResponse = await fetch(messageUrl);

  // delete message
  if (params.deleteAfter) {
    await fetch(messageUrl, {
      method: 'DELETE',
    });
  }

  return messageResponse.json();
}
