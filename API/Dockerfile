FROM node:15-alpine

WORKDIR /API

COPY package.json /API

RUN npm install

COPY . /API

CMD ["npm", "start"]