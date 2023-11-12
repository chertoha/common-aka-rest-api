FROM node:20-slim

USER node
WORKDIR /home/node/app

COPY --chown=node:node package*.json . 
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node src src

RUN npm install
RUN npm run build
    
EXPOSE 3000

CMD [ "node",  "dist/main.js"]