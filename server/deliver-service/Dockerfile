# Dockerfile for delivery Service

FROM node:20-slim

RUN npm install -g nodemon

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3003

CMD ["npm", "start"]
