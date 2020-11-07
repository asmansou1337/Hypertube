FROM alpine:latest
RUN apk add --update nodejs
RUN apk add --update npm
WORKDIR /client
COPY package.json ./
COPY package-lock.json ./
RUN npm install nodemon -g
ENTRYPOINT npm install
