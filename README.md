# KLIPS API

This repo contains a basic API based on [ExpressJS](http://expressjs.com/) for the KLIPS project.

## Installation

`npm i`

## Development

with local Node.js:

```shell
PORT=3000 \
DISPATCHERQUEUE=dispatcher \
RABBITHOST=localhost \
RABBITUSER=rabbit \
RABBITPASS=rabbit \
npm run watch
```

using Node.js inside Docker:
```shell
# build image
docker build \
  --file Dockerfile.dev \
  --tag klips-api-dev \
  .

# run image with mounted source code
docker run  \
  -p 3000:3000 \
  -v $(pwd):/usr/app \
  -v $(pwd)/src/config:/klips-conf \
  --env-file dev.env \
  klips-api-dev
```

## Config files

The API has two config files:

- `basic-auth-users.json`: the credentials for basic authentication
- `schema-geotiff-upload.json`: the JSON schema for validating the API input

## Production

Create a local build:

`npm run build`

Or build the Docker image:

```shell
# build image
docker build --tag klips-api .

# run image
docker run \
  -p 3000:3000 \
  -v /path/to/your/config/files:/klips-conf \
  --env-file production.env \
  klips-api
```

## Usage

API starts on port 3000. Current dummy endpoints:
- `GET /status`
- `POST /job`

## Access with CLI

```shell
curl \
--request POST \
--header 'Authorization: Basic a2xpcHM6a2xpcHM=' \
--header 'Content-Type: application/json' \
--data @example_requests/send-geotiff.json \
'http://localhost:3000/job'
```
