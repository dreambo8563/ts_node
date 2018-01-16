FROM node:8.9-alpine
ENV NODE_ENV production
RUN apk add --update git
WORKDIR /usr/src/app
RUN git clone https://github.com/dreambo8563/ts_node.git .
RUN npm install --production --silent
EXPOSE 8192
CMD npm start