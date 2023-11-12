FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY src src

RUN npm install
RUN npm run build
    
EXPOSE 3000

CMD [ "node",  "dist/main.js"]