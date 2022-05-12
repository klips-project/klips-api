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
  --env-file dev.env \
  klips-api-dev
```

## Production

Create a local build:

`npm run build`

Or build the Docker image:

```shell
# build image
docker build --tag klips-api .

# run image
docker run -p 3000:3000 klips-api
```

## Usage

API starts on port 3000. Current dummy endpoints:
- `GET /status`
- `POST /job`
