FROM node:8.9-alpine
ENV NODE_ENV production
RUN apk add --update git
WORKDIR /usr/src/app
COPY ["package.json","npm-shrinkwrap.json", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8192
CMD npm start