FROM node:18.17

WORKDIR /usr/src/app
COPY package.json package-lock.json nodemon.json ./
RUN npm ci --include=dev
COPY ./src ./src
