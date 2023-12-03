# MakerKit - SaaS Starter for Next.js and Supabase

MakerKit is a SaaS starter project built with Next.js, Supabase and Tailwind CSS.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

This is a quick guide to get you started with the project. For more details, 
please refer to the [documentation](https://makerkit.dev/docs/next-supabase/introduction).

### Before you deploy to production

Many users try to deploy to production without going through the steps below.
The result is the application won't be working as expected.

**Important**: deploying to production (Vercel or other) will require you to 
fill the required environment variables. 

[Please refer to the documentation](https://makerkit.dev/docs/next-supabase/going-to-production-overview) to 
learn more.

**Failure to do so will result in your application not working as expected 
or not deploying at all**. Please ensure you have the required environment 
variables and keys before deploying to production.

### Requirements

Ensure you have the following installed:

- Node.js (LTS, v20 may not work with some dependencies)
- Git
- Docker

### Cloning the Repository

Clone this repository and name it according to your preferences:

```
git clone https://github.com/makerkit/next-supabase-saas-kit.git your-saas --depth=1
```

Move to the folder just cloned:

```
cd your-saas
```

Set this repository as your upstream fork, so you can
pull updates when needed:

```
git remote add upstream https://github.com/makerkit/next-supabase-saas-kit
```

We recommend to watch to the repository, so you know when there's an update.
To pull the latest updates, use:

```
git pull upstream main
```

In case we change the same files, you will need to resolve the conflicts.

Alternatively, you can cherry-pick changes so to reduce the amount of
conflicts across the files.

### Installing the Node Modules

Install the Node modules with the following command:

```
npm i
```

### Supabase

First, run the Supabase stack:

```bash
npm run supabase:start
```

**NB**: this does not run your remote Supabase project, but a local instance
using Docker. This is useful for development and testing.

For production,
you will need to copy your remote instance keys, and push the database
migrations to your remote instance.

My recommendation is to use the local instance for development, and the
production instance when you're ready to deploy. Please set up the local
instance first before attempting to use the production instance.

If you are planning to deploy Supabase to production right away, [please ensure you read this guide by Supabase first](https://supabase.com/docs/guides/cli/local-development#link-your-project).

#### Adding the Supabase Keys to the Environment Variables

If this is the first time you run this command, we will need to get the 
Supabase keys and add them to our local environment variables configuration 
file `.env.local`. The file does not exist because it's not supposed to be 
pushed to the repository: please create it and add the environment variables 
below.

When running the command, we will see a message like this:

```bash
> supabase start

Applying migration 20221215192558_schema.sql...
Seeding data supabase/seed.sql...
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: ****************************************************
service_role key: ****************************************************
```

Now, we need to copy the `anon key` and `service_role key` values and add 
them to the `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=****************************************************
SUPABASE_SERVICE_ROLE_KEY=****************************************************
```

#### Database types (optional)

Now, generate the DB types with:

```
npm run typegen
```

### Next.js Server

Then, run the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Running the Stripe CLI

If you're testing Stripe, also run the Stripe server (requires Docker running):

```
npm run stripe:listen
```

Then, copy the printed webhook key and add it to your environment files.
This can also be used for running the E2E tests.

The environment variable name is `STRIPE_WEBHOOK_SECRET`.

```
STRIPE_WEBHOOK_SECRET=whsec_***********************
```

#### Signing In for the first time

You should now be able to sign in. To quickly get started, use the following credentials:

```
email = test@makerkit.dev
password = testingpassword
```

#### Email Confirmations

When signing up, Supabase sends an email confirmation to a testing account. You can access the InBucket testing emails [using the following link](http://localhost:54324/monitor), and can follow the links to complete the sign up process.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### After Creating your Supabase Project

Make sure to add the environment variables to the provider you're deploying.

### Running Tests

Before running tests, add the required environment variables to your `.env.test` file:

```
SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Retrieve the keys after starting the Supabase server and paste them in the `.env.test` file.

#### Running E2E Stripe Tests

To run the Stripe tests and enable Stripe in development mode, you need to:

1. Enable the tests using the environment variable `ENABLE_STRIPE_TESTING` in
   `.env.test`
2. Have Docker installed and running in your local machine to run the Stripe
   Emulator
3. Generate a webhook key and set the environment variable
   `STRIPE_WEBHOOK_SECRET` and the other required Stripe environment variables

The first two steps are only required to run the Cypress E2E tests for
Stripe. Generating a webhook key and running the Stripe CLI server is
always required for developing your Stripe functionality locally.

The variables should be added either in `.env.test` or as part of your CI 
environment. 

NB: The secret keys should not be added to the repository - even 
though these are test keys. Instead - please add them to your CI 
environment - such as Github Actions.

The test API keys should be added as secrets - while the variable 
ENABLE_STRIPE_TESTING should be added as a simple variable.

To generate a webhook key, run the following command:

```
npm run stripe:listen
```

If it worked, it will print the webhook key. Then, paste it into
your environment files as `STRIPE_WEBHOOK_SECRET`.

This key is also needed to run Stripe during development to receive the
Stripe webhooks to your local server.

```
ENABLE_STRIPE_TESTING=true
```

The Stripe tests work only using the Embedded Stripe Checkout.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
