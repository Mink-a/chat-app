FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN cd ./chat-client && npm ci  && npm run build && cd ..

RUN cd ./chat-server && npm ci  && cd ..

RUN mkdir -p /usr/src/app/chat-server/public

RUN cp -r ./chat-client/dist/* ./chat-server/public/

WORKDIR  /usr/src/app/chat-server

RUN npm run build

EXPOSE 3132

CMD [ "npm", "run", "start:prod" ]