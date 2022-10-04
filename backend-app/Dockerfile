FROM node:16-alpine3.15

EXPOSE 8080 1337

WORKDIR /backend-app

COPY package*.json ./

RUN npm install

COPY src src

COPY docs docs

CMD npm run start