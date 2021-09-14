FROM node:16-alpine3.11

EXPOSE 1337

WORKDIR /ocpp

COPY package*.json ./

RUN npm install

COPY src src

CMD npm run start