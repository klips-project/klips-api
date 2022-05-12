# KLIPS API

This repo contains a basic API based on [ExpressJS](http://expressjs.com/) for the KLIPS project.

## Installation

`npm i`

## Development

`npm run watch`

## Production

`npm run build`

## Usage

API starts on port 3000. Current dummy endpoints:
- `GET /status`
- `POST /job`

## Docker

Use Docker for development:

```shell
# build image
docker build --file Dockerfile.dev --tag klips-api-dev .

# run image with mounted source code
docker run  -p 3000:3000 -v $(pwd):/usr/app klips-api-dev
```

Build Docker image for production:

```shell
# build image
docker build --tag klips-api .

docker run -p 3000:3000 klips-api
```