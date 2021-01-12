# Serverless Framework

```bash
# Install
$ npm i -g serverless

# Generate Boilerplate
$ sls create -t aws-nodejs -p <path>

# Change into New Directory
$ cd <path>

# Invoke Function Locally
$ sls invoke local -f <function_name>

# Deploy to AWS
$ sls deploy -v

# Test Function
$ curl -X POST <api_endpoint>

# Stream CloudWatch Logs
$ sls logs -f <function_name> -t

# Check Deployed Functions
$ sls deploy list functions

# Delete Function
$ sls remove
```
