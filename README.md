# Geriatric Care Assessment Form

A single-page frontend assignment built with React 19, TypeScript, Mantine, Mantine Form, Zod 4, Vite, and Vitest.

## Features

- Ten assessment fields using Mantine components.
- Zod schema-based validation through Mantine's `zodResolver`.
- Validation on blur and submit, with field-level errors.
- Age-at-assessment boundary check (60+), follow-up date check, and pharmacist-review rule for five or more medications.
- Fictional sample-patient fixture.
- Simulated save with an 800 ms loading state and a success alert showing parsed values.
- Schema boundary tests and a rendered form submission test.

## Requirements

- Node.js 20.19+ (or a compatible current Node release)
- Yarn 4 recommended (the supplied assignment template uses Yarn 4)

## Run locally

```bash
yarn install
yarn dev
```

## Checks

```bash
yarn typecheck
yarn lint
yarn format
yarn vitest
yarn build
```

The assignment's `yarn test` script runs all checks in sequence.

## Notes / scope

- No backend, authentication, routing, or real patient data are included.
- Saving is simulated in the browser; no information is sent to a server.
- All sample patient information is fictional.
- Deployment URL: add the public URL here after deploying (for example, with Vercel or Netlify).
- Time spent: fill in your actual time before submission.
- Unfinished work: if any, document it honestly here before submission.

## Deployment

Deploy the repository to a frontend host such as Vercel or Netlify, then add the deployed URL above. Do not claim a deployment URL until deployment is completed.
