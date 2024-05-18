FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3132

CMD [ "npm", "run", "start:prod" ]