FROM node:19-alpine3.15

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]