# Serverless Framework

Both functions use Serverless Framework v4 and the `nodejs24.x` Lambda runtime. v4 needs a free Serverless account
(free for individuals and organizations under $2M annual revenue): sign in once with `serverless login`, or set
`SERVERLESS_ACCESS_KEY` (an Access Key from the Serverless Dashboard) in the environment.

The tooling needs Node.js 20+ locally; the repo-root `.nvmrc` selects Node.js 24 (`nvm use`).

`stripe-lambda` reads `STRIPE_SECRET_KEY` from a git-ignored `config.js`:

```js
module.exports = { STRIPE_SECRET_KEY: '<secret_key>' };
```

Pushes to `main` deploy both functions from GitHub Actions (`.github/workflows/main.yml`). The job assumes the
`AWS_ROLE_ARN` role via OIDC, so that role also needs permission to deploy a Serverless stack in `ca-central-1`
(CloudFormation, Lambda, API Gateway, IAM, S3 and CloudWatch Logs). It reads `SERVERLESS_ACCESS_KEY` and
`STRIPE_SECRET_KEY` from repository secrets and writes a `config.js` that passes the key through.

```bash
# Install
$ pnpm add -g serverless

# Sign In
$ serverless login

# Generate Boilerplate (interactive, pick a template)
$ serverless

# Change into Function Directory
$ cd <path>

# Install Dependencies
$ pnpm install --frozen-lockfile

# Invoke Function Locally
$ sls invoke local -f <function_name>

# Deploy to AWS
$ sls deploy --verbose

# Run a Function Locally behind an Emulated API Gateway (see Testing below for the mocks)
$ sls offline start

# Test the Deployed Functions with Live Data (from the repo root, see Testing below)
$ pnpm test:functions

# Stream CloudWatch Logs
$ sls logs -f <function_name> -t

# Check Deployed Functions
$ sls deploy list functions

# Delete Function
$ sls remove
```

## Testing

`test-endpoints.mjs` sends the requests the site sends to a function's endpoint and checks the responses: first the
CORS preflight a browser sends, then the POST with the same body as `Contact.vue` or `AppStripe.vue`. Each function
prints a line with the result and the endpoint it called (the SES message ID or the PaymentIntent ID on success, the
reason on failure), and the command exits non-zero if any check fails.

### With mocks (serverless offline)

The deploy workflow's `test-functions` job runs each function under
[serverless-offline](https://github.com/dherault/serverless-offline), which emulates API Gateway and Lambda locally,
with the external services mocked. `deploy-functions` waits for it, so a function that fails its test isn't deployed.

- `contact-lambda` sends its SES calls to [aws-ses-v2-local](https://github.com/domdomegg/aws-ses-v2-local) (a
  devDependency) through the AWS SDK's `AWS_ENDPOINT_URL_SES` variable. The SDK itself is only a devDependency, since
  the Lambda runtime provides it.
- `stripe-lambda` sends its Stripe calls to [stripe-mock](https://github.com/stripe/stripe-mock), Stripe's official
  mock API, through the handler's `STRIPE_API_URL` variable. stripe-mock accepts any test-mode key.

To run the same test locally, start the mock and serverless offline in the function's directory (serverless needs
`serverless login` or `SERVERLESS_ACCESS_KEY`), then test the endpoint from another terminal:

```bash
# contact-lambda (the SES mock's inbox is at http://localhost:8005)
$ pnpm exec aws-ses-v2-local --host 127.0.0.1
$ AWS_ACCESS_KEY_ID=offline AWS_SECRET_ACCESS_KEY=offline AWS_ENDPOINT_URL_SES=http://127.0.0.1:8005 \
    serverless offline start
$ node ../test-endpoints.mjs contact --url http://localhost:3000/dev/contact

# stripe-lambda (needs a config.js with a test-mode key, e.g. sk_test_offline)
$ docker run --rm --publish 12111:12111 stripe/stripe-mock:v0.206.0
$ STRIPE_API_URL=http://127.0.0.1:12111 serverless offline start --localEnvironment
$ node ../test-endpoints.mjs stripe --url http://localhost:3000/dev/stripe
```

serverless offline only passes `AWS_*` variables through to the handlers by default; `--localEnvironment` passes
`STRIPE_API_URL` too.

### With live data (deployed functions)

`pnpm test:functions` (run it from the repo root) calls the deployed endpoints, reading each URL from the component
that calls it, so it tests the URLs the site uses. It needs no AWS credentials or Serverless login, and nothing runs
it automatically. The requests are real:

- `contact` sends an email through SES to the address in `contact-lambda/handler.js`.
- `stripe` creates a $1.00 CAD PaymentIntent with the deployed Stripe key. Nothing confirms it, so nothing is charged;
  it shows as Incomplete in the Stripe dashboard.

```bash
# Test both functions
$ pnpm test:functions

# Test one function
$ pnpm test:functions contact
```

Run `sls logs -f <function_name>` in the function's directory to see the Lambda side of a failure.
