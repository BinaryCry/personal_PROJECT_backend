FROM node:carbon

ENV port=3000

WORKDIR /app

COPY dist /app/dist

COPY package*.json ./

RUN npm install --production

RUN npm -g install nodemon

EXPOSE 3000

CMD [ "nodemon", "./dist" ]
