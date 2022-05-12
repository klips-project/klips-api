FROM node:16.15.0-slim

WORKDIR /usr/build

COPY ./ ./

RUN npm install
RUN npm run build

FROM node:16.15.0-slim

WORKDIR /usr/app

COPY --from=0 /usr/build/dist/ ./dist
COPY --from=0 /usr/build/LICENSE ./
COPY --from=0 /usr/build/package.json ./
COPY --from=0 /usr/build/package-lock.json ./
COPY --from=0 /usr/build/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "./dist/index.js"]
