# Serverless Framework

Both functions use Serverless Framework v4 and the `nodejs24.x` Lambda runtime. v4 needs a free Serverless account
(free for individuals and organizations under $2M annual revenue): sign in once with `serverless login`, or set
`SERVERLESS_ACCESS_KEY` (an Access Key from the Serverless Dashboard) in the environment.

The tooling needs Node.js 20+ locally; the repo-root `.nvmrc` selects Node.js 24 (`nvm use`).

`stripe-lambda` reads `STRIPE_SECRET_KEY` from a git-ignored `config.js`:

```js
module.exports = { STRIPE_SECRET_KEY: '<secret_key>' };
```

```bash
# Install
$ npm i -g serverless

# Sign In
$ serverless login

# Generate Boilerplate (interactive, pick a template)
$ serverless

# Change into Function Directory
$ cd <path>

# Install Dependencies (stripe-lambda)
$ npm ci

# Invoke Function Locally
$ sls invoke local -f <function_name>

# Deploy to AWS
$ sls deploy --verbose

# Test Function
$ curl -X POST <api_endpoint>

# Stream CloudWatch Logs
$ sls logs -f <function_name> -t

# Check Deployed Functions
$ sls deploy list functions

# Delete Function
$ sls remove
```
