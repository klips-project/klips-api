# KLIPS API

This repo contains a basic API based on [ExpressJS](http://expressjs.com/) for the KLIPS project.

## Development

with local Node.js:

```shell
# install dependencies
npm i

# define environment variables and run
PORT=3000 \
DISPATCHERQUEUE=dispatcher \
RABBITHOST=localhost \
RABBITUSER=rabbit \
RABBITPASS=rabbit \
npm run watch

# create a local build
npm run build
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

## build the production image
docker build --tag klips-api .
```

On every push GitHub Actions builds the Docker image and hosts it on the GitHub registry.

## Installation for Production

Use the Docker image hosted on GitHub:

```shell
docker run \
    -p 3000:3000 \
    -v /home/terrestris/klips-api-config:/klips-conf \
    -e PORT=3000 \
    -e CONFIG_DIR=/klips-conf \
    ghcr.io/klips-project/klips-api:latest
```

## Config files

The API has two config files:

- `basic-auth-users.json`: the credentials for basic authentication
- `schema-geotiff-upload.json`: the JSON schema for validating the API input

## Usage

API starts on port 3000 with these endpoints:
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
