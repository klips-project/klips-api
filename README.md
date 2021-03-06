# KLIPS API

This repo contains the API  for the KLIPS project.

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
USE_RABBIT_MQ=1 \
CONFIG_DIR=src/config \
PARTNER_URL_START=http://www.example.com \
PARTNER_API_USERNAME=myusername \
PARTNER_API_PASSWORD=randompassword \
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

## Environment variables

- `USE_RABBIT_MQ` - if API shall forward messages to RabbitMQ. Allowed values: `0`, `1`. Default is `0`
- `PORT` -  The Port on which to publish this API
- `DISPATCHERQUEUE` - the name of the dispatcher queue
- `RABBITHOST` - the host of the RabbitMQ instance
- `RABBITUSER` - the username for the RabbitMQ instance
- `RABBITPASS` - the password for the RabbitMQ instance
- `CONFIG_DIR` - the path to the directory with the configuration files
- `PARTNER_URL_START` - the start string of the partner's API URL, e.g. "https://www.example.com/api"
- `PARTNER_API_USERNAME` - the username of the partner's API
- `PARTNER_API_PASSWORD` - the password of the partner's API

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
