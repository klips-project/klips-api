FROM node:16.13.1-slim

WORKDIR /usr/build

COPY ./ ./

RUN npm install
RUN npm run build

FROM node:16.13.1-slim

WORKDIR /usr/app

COPY --from=0 /usr/build/dist/ ./
COPY --from=0 /usr/build/LICENSE ./
COPY --from=0 /usr/build/package.json ./
COPY --from=0 /usr/build/package-lock.json ./

EXPOSE 3000

CMD ["node", "./src/index.js"]
