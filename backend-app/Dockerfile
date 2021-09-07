FROM node:16-alpine3.11

WORKDIR /backend-app

COPY . .

RUN yarn install

RUN yarn build 

EXPOSE 8080

CMD yarn start