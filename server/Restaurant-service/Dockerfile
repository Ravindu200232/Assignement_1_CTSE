# Dockerfile for Restaurant Service

FROM node:20-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3002

CMD ["npm", "start"]
