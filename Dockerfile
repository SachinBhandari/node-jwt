FROM node:slim
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
CMD [ "npm", "start" ]
EXPOSE 3000
COPY . .
