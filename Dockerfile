FROM node:carbon
ENV NODE_ENV production
WORKDIR /usr/src/app
RUN git clone https://github.com/dreambo8563/ts_node.git .
RUN NODE_ENV=development npm i
EXPOSE 8192
CMD npm start